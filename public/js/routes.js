// Creación del módulo
var angularRoutingApp = angular.module('angularRoutingApp', ['ngRoute', 'angular-clipboard', 'mdo-angular-cryptography'])
    .run(function($rootScope) {
        $rootScope.token = "";
    });

var secrets = ('secrets.js');
var rsa = ('rsa.js');
//var rsa2 = ('rsa2.js');
var passUser;
var aliasUser;
var token;

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
angularRoutingApp.controller('mykeysController', function($scope, $http, $crypto, $location, $window, $rootScope) {
    $scope.message = "Add a new Key";

    //$window.location.reload();

    $scope.keys = {};

    $http.defaults.headers.common['authoritation'] = $rootScope.token;


    $http({
        method: 'GET',
        url:'/key/',
        headers:{
            authoritation : $rootScope.token
        }
    }).success(function(keys){
        console.log($rootScope.token);
        $scope.keys = keys;
    }).error(function(data){
    console.log('Error: ' + data);
    console.log($rootScope.token);
    });



  /*  $http.get('/key/').success(function(keys){
        console.log($rootScope.token);
        $scope.keys = keys;
    }).error(function(data){
        console.log('Error: ' + data);
        console.log($rootScope.token);

    });
*/
    $scope.addkey = function() {

        var pass = $crypto.encrypt($scope.key.password, '1234');
        var name = $crypto.encrypt($scope.key.username, '1234');


        var newKey = {
            tag: $scope.key.tag,
            username: name,
            password: pass,
            comment: $scope.key.comment
        };

        console.log('New key:', newKey);


        $http({
            method: 'POST',
            url: '/key/',
            headers: {authoritation: $rootScope.token},
            data: myData
    });

        $http.post('/key/', newKey)({
            headers: {
                authoritation: $rootScope.token
            }
        }).success(function (keys) {
            $scope.keys = keys;
            console.log('Envio correcto, claves:', keys);
        }).error(function (data) {
            console.log('Error: ' + data);
        });

    }
});

angularRoutingApp.controller('mainController', function($scope, $http, $rootScope, $location) {
    $scope.message =  'Smart Cities II - KeyBox Proyect';
    $scope.signupI = false;
    $scope.signupII = true;
    $scope.logueado = true; //false si logueado
    $scope.nologueado = false; //true si logueado
    $scope.user = window.sessionStorage.getItem("user");

    $scope.signIn = function (){

        var username = $scope.username;
        var password = $scope.password;
        var credentials = {
            username: username,
            password: password
        };
        $http.post('/login', credentials)
            .success(function (data) {
                console.log("User Logged", data);
                $rootScope.token = "TOKEN " + data.token;
                console.log($rootScope.token);
                $location.path("/");
                $scope.logueado = false; //false si logueado
                $scope.nologueado = true; //true si logueado
            })
            .error(function (data) {
                console.log(data);
            })

    };

    $scope.signOut = function () {

        $rootScope.token = "";
        $scope.logueado = true; //false si logueado
        $scope.nologueado = false; //true si logueado
        console.log("Token eliminado", $scope.token);
        $location.path('/');
    };

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
});

angularRoutingApp.controller('registerController', function ($scope, $http, $location) {

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

                var signtextBig = bigInt(info.signtext, 16);

                var msgsign = signtextBig.multiply(bigInt.modInv(r, nServer).mod(nServer));

                var signtext = msgsign.toString(16);

                $scope.signed = signtext;

            })
            .error(function(data){
                console.log(data);
            })
        }).error(function(data2){
                    console.log(data2);
                })
    };

    $scope.signup = function(){
        var p = bigInt($scope.user.p, 16);
        var q = bigInt($scope.user.q, 16);
        var d = bigInt($scope.user.d, 16);
        var signedKeyBig = bigInt($scope.key.signed, 16);
        var signedKey = signedKeyBig.toString(16);



        console.log('info', signedKey);

        $http.post('/challenge1', {info:signedKey})
            .success(function(data){
                console.log('this is the nonce', data);
                var n = p.multiply(q);
                var nonce = bigInt(data, 16);
                var signedNonceBig = nonce.modPow(d, n);
                var signedNonce = signedNonceBig.toString(16);

                console.log('nonce firmado', signedNonce);

                $http.post('/challenge2', {signNonce:signedNonce})
                    .success(function(data2){
                        if (data2.statusCode < 200 || data2.statusCode > 200){
                            console.log(data2);
                        }else {
                            console.log('comprobación correcta', data2);

                            passUser = $scope.user.pass;
                            aliasUser = $scope.user.alias;

                            var newuser = {
                                username : $scope.user.alias,
                                password : $scope.user.pass
                            };

                            $http.post('/register', newuser).success(function(info2){
                                console.log('token', info2);
                                token = "TOKEN " + info2.token;
                                $scope.user.alias = "";
                                $scope.user.pass = "";
                                $scope.logueado = false;
                                $scope.nologueado = true;
                                $scope.token = token;
                                console.log($scope.token);
                                $location.path('/');
                            }).error(function(info2){
                                console.log("error en login", info2)
                            })

                        }

                }).error(function(data2){
                    console.log("error en challenge2", data2)
                })

            })
            .error(function(data){
                console.log(data);
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