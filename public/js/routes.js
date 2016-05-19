// Creación del módulo
var angularRoutingApp = angular.module('angularRoutingApp', ['ngRoute', 'angular-clipboard']);
var secrets = ('secrets.js');
var rsa = ('rsa.js');


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
        .otherwise({
            redirectTo: '/'
        });
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
                var keys = rsa.generateKeys(1024);

                // PRIVATE KEY
                $scope.p = keys.privateKey.p.toString();
                $scope.q = keys.privateKey.q.toString();
                $scope.d = keys.privateKey.d.toString();

                //PUBLIC KEY
                $scope.n = keys.publicKey.n.toString();

            })
          
                    
            .error(function (data) {
                console.log(data);

            })
            
        };
        //Conexión con backend

        //
});

angularRoutingApp.controller('registerController', function ($scope, $http) {

    $scope.sign = function(){
        $http.get('/serverKeys').success(function(data){
            var nServer = bigInt(data.n);
            var eServer = bigInt(data.e);

            console.log("n", nServer);

            $http.post('signKey').success(function(signkey){

            })
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