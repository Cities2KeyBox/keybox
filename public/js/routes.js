// Creación del módulo
var angularRoutingApp = angular.module('angularRoutingApp', ['ngRoute', 'angular-clipboard']);
var secrets = ('secrets.js');
var rsa = ('rsa.js');
//var rsa2 = ('rsa2.js');

rsa2 = {
    publicKey: function (bits, n, e) {
        this.bits = bits;
        this.n = n;
        this.e = e;
    },
    privateKey: function (p, q, d, publicKey) {
        this.p = p;
        this.q = q;
        this.d = d;
        this.publicKey = publicKey;
    },
    generateKeys: function(bitlength) {
        var p, q, n, phi, e, d, keys = {};
        this.bitlength = bitlength || 2048;
        console.log("Generating RSA keys of", this.bitlength, "bits");
        p = bigInt.prime(this.bitlength / 2);
        do {
            q = bigInt.prime(this.bitlength / 2);
        } while (q.compare(p) === 0);
        n = p.multiply(q);

        phi = p.subtract(1).multiply(q.subtract(1));

        e = bigInt(65537);
        d = bigInt.modInv(e, phi);

        keys.publicKey = new rsa2.publicKey(this.bitlength, n, e);
        keys.privateKey = new rsa2.privateKey(p, q, d, keys.publicKey);
        return keys;
    }
};


rsa2.publicKey.prototype = {
    encrypt: function(m) {
        return m.modPow(this.e, this.n);
    },
    decrypt: function(c) {
        return c.modPow(this.e, this.n);
    }
};

rsa2.privateKey.prototype = {
    encrypt: function(m) {
        return m.modPow(this.d, this.publicKey.n);
    },
    decrypt: function(c) {
        return c.modPow(this.d, this.publicKey.n);
    }
};


// Configuración de las rutas
angularRoutingApp.config(function($routeProvider) {

    $routeProvider
        .when('/', {
            templateUrl : 'views/home.html',
            controller  : 'mainController'
        })
        .when('/secret', {
            templateUrl : 'views/secret.html',
            controller  : 'secretController'
        })
        .when('/combine', {
            templateUrl : 'views/combine.html',
            controller  : 'combineController'
        })
        .when('/signup', {
            templateUrl : 'views/signup.html',
            controller  : 'mainController'
        })
        .when('/register', {
            templateUrl : 'views/register.html',
            controller  : 'registerController'
        })
        .when('/mykeys', {
            templateUrl : 'views/mykeys.html',
            controller  : 'mykeysController'
        })
        .otherwise({
            redirectTo: '/'
        });
});
angularRoutingApp.controller('mykeysController', function($scope, $http) {
   $scope.message = "Add a new Key";


});

angularRoutingApp.controller('mainController', function($scope,$http) {
    $scope.message =  'Smart Cities II - KeyBox Proyect';
    $scope.signupI = false;
    $scope.signupII = true;

        $scope.signI = function() {
        
        $scope.signupI = false; //poner a true
        $scope.signupII = false;
        
        var mail = $scope.signup.mail;
        var username= $scope.signup.user;
        var newuser = {
            email: mail,
            name : username
        };
            $http.post('/commonRegister', newuser)
            .success(function (data) {


                $scope.signup.mail = "";
                $scope.signup.user = "";
                console.log("HOLA 1");
                var keys = rsa2.generateKeys(1024);

                console.log('keys', keys);

                // PRIVATE KEY
                $scope.p = keys.privateKey.p.toString(16);
                $scope.q = keys.privateKey.q.toString(16);
                $scope.d = keys.privateKey.d.toString(16);

                //PUBLIC KEY
                $scope.n = keys.publicKey.n.toString(16);


            }).error(function (data) {
                console.log(data);
            });
            
        };
        //Conexión con backend

        //
});

angularRoutingApp.controller('registerController', function ($scope, $http) {

    $scope.signPKey = function(){
        $http.get('/serverKeys')
            .success(function(data){

            var nServer = bigInt(data.n, 16);
            var eServer = bigInt(data.e, 16);

            var r = bigInt.randBetween(0, nServer);

            var publicKey = bigInt($scope.key.public, 16);

            var blindMsg = publicKey.multiply(r.modPow(eServer, nServer)).mod(nServer);

            var text = blindMsg.toString(16);

            $scope.text = text;

            console.log($scope.text);

            $http.post('/serverKeys2', {text:text})
            .success(function(info){
                console.log(info)
            })
            .error(function(data){
                console.log(data);
            })
        }).error(function(data2){
                    console.log(data2);
                })
    };

});

angularRoutingApp.controller('secretController', function($scope) {
    $scope.message = 'Formulario para añadir clave compartida';
    //////////Parte SSS
    $scope.secreto = '';
    $scope.secretoHex = '';
    $scope.n = ''; //nº shares
    $scope.t = ''; //threshold
    $scope.shares = '';
    $scope.share = '';

    $scope.registrar = function () {

        /**
         * Created by Oriol on 10/4/16.
         */
        console.log('\nSecreto Compartido - Shamir\n');

        //var secreto = 'supersecerto';
// Convierte el texto del secreto a hexadecimal
        $scope.secretoHex = secrets.str2hex($scope.secreto); // => 240-bit
// Genera secreto aleatorio de 512-bit en hexadecimal
//var secreto = secrets.random(1024);
        var n = parseInt($scope.n);
        var t = parseInt($scope.t);
        var i = 0;
        console.log('-Secreto:', $scope.secreto);
        console.log('-Secreto en hexa:', $scope.secretoHex);
        console.log('-Número de shares:', $scope.n);
        console.log('-Umbral de cooperación:', $scope.t);

// Divide el secreto en "n" shares, con un umbral de "t" shares para descifrarlo, añadiendo zero-padding si los shares no llegan a 1024 bits
        $scope.shares = secrets.share($scope.secretoHex, n, t, 1024); // => 1024-bit shares
//Muestra por consola  todos los shares
        while (i < $scope.n) {
            console.log('Share', i, ':', $scope.shares[i]);
            i++;
        }
    };

    //Script para copiar share en portapapeles
    $scope.supported = false;
    $scope.textToCopy = 'I can copy by clicking!';
    $scope.success = function () {
        console.log('Copiado en portapapeles!');
    };
    $scope.fail = function (err) {
        console.error('Error al copiar en portapapeles!', err);
    };
    //////////Fin parte SSS
});

angularRoutingApp.controller('combineController', function($scope) {
    $scope.message = 'Formulario para añadir los "shares"';
    //////////Parte SSS
    $scope.comb = '';
    $scope.secreto = '';
    $scope.secretoHex = '';
    $scope.n = ''; //nº shares
    $scope.t = ''; //threshold
    $scope.shares = [];
    $scope.share = '';
    $scope.s0 = '';
    $scope.s1 = '';
    $scope.s2 = '';

    $scope.addShare = function () {
        console.log($scope.share);
        $scope.shares.push($scope.share);
        console.log($scope.shares);
        $scope.share = "";
    };


    $scope.combine = function () {

        /**
         * Created by Oriol on 10/4/16.
         */
        console.log('\n Recuperar Secreto Compartido - Shamir\n');

// Combina los shares (mínimo de "t" para conseguir descifrar el secreto)
        //$scope.comb = secrets.combine( [ $scope.s0, $scope.s1, $scope.s2 ] );
// Combina toods los shares
        $scope.comb = secrets.combine($scope.shares);
// Combina "x" shares seguidos
        //var comb = secrets.combine($scope.shares.slice(2, 6));

// Convierte de nuevo a UTF
        $scope.comb = secrets.hex2str($scope.comb);

        console.log('\nCombinación de los shares:', $scope.comb);
        console.log('Descifrado correctamente:', $scope.comb === $scope.secreto); // => true / false
    };

    $scope.supported = false;

    $scope.textToCopy = 'I can copy by clicking!';

    $scope.success = function () {
        console.log('Copiado en portapapeles!');
    };

    $scope.fail = function (err) {
        console.error('Error al copiar en portapapeles!', err);
    };
    //////////Fin parte SSS


});