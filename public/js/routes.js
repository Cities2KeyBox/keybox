/**
 * Created by Oriol on 15/4/16.
 */
// Creación del módulo
var angularRoutingApp = angular.module('angularRoutingApp', ['ngRoute']);

// Configuración de las rutas
angularRoutingApp.config(function($routeProvider) {

    $routeProvider
        .when('/', {
            templateUrl : 'views/home.html',
            controller  : 'mainController'
        })
        .when('/students', {
            templateUrl : 'views/students.html',
            controller  : 'studentsController'
        })
        .when('/subjects', {
            templateUrl : 'views/subjects.html',
            controller  : 'subjectController'
        })
        .otherwise({
            redirectTo: '/'
        });
});

angularRoutingApp.controller('mainController', function($scope) {
    $scope.message =  'Mínimo MEAN - EA - Oriol Castaño';
});

angularRoutingApp.controller('studentsController', function($scope, $http) {
    $scope.message = 'Formulario para añadir estudiantes';
    $scope.newStudent = {};
    $scope.students = {};
    $scope.selected = false;

    // Obtenemos todos los estudiantes
    $http.get('/api/student').success(function(data) {
            $scope.students = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });


    // Función para registrar estudiante
    $scope.registrarPersona = function() {
        $http.post('/api/student', $scope.newStudent)
            .success(function(data) {
                $scope.newStudent = {}; // Borramos los datos del formulario
                $scope.students = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // Función para eliminar estudiante
    $scope.deleteStudent = function(id) {
        $http.delete('/api/student/' + id)
            .success(function(data) {
                $scope.newStudent = {};
                $scope.students = data;
                $scope.selected = false;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // Función para editar los datos de una persona
    $scope.modificarPersona = function(newPersona) {
        $http.put('/api/persona/' + $scope.newPersona._id, $scope.newPersona)
            .success(function(data) {
                $scope.newPersona = {}; // Borramos los datos del formulario
                $scope.personas = data;
                $scope.selected = false;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

});

angularRoutingApp.controller('subjectController', function($scope, $http) {
    $scope.message = 'Clicar sobre el nombre de una asignatura y/o alumno para ver los detalles';
    $scope.newSubject = {};
    $scope.selectedSubject = {};
    $scope.selectedStudent = {};
    $scope.subjects = {};
    $scope.students = {};
    $scope.selected = false;
    $scope.table1 = false;
    $scope.table2 = false;

    // Obtenemos todos los datos de la base de datos
    $http.get('/api/subject').success(function(data) {
            $scope.subjects = data;
            console.log($scope.subjects);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // Función para añadir asignatura
    $scope.addSubject = function() {
        $http.post('/api/subject', $scope.newSubject)
            .success(function(data) {
                $scope.newSubject = {}; // Borramos los datos del formulario
                $scope.subjects = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // Función para eliminar asignatura
    $scope.deleteSubject = function(id) {
        $http.delete('/api/subject/' + id)
            .success(function(data) {
                $scope.newSubject = {};
                $scope.subjects = data;
                $scope.selected = false;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // Función para añadir alumno a asignatura
    $scope.addStudent = function() {
        console.log($scope.selectedSubject._id);
        console.log($scope.newStudent);
        $http.post('/api/subject/' + $scope.selectedSubject._id, $scope.newStudent)
            .success(function(data) {
                $scope.selectedSubject = data;
                location.reload();

            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // Función para coger el Subject seleccionado en la tabla
    $scope.selectSubject = function(subject) {
        $scope.table1 = true;
        $scope.selectedSubject = subject;
        $scope.selected = true;
        console.log($scope.selectedSubject);
    };

    // Función para coger el Student seleccionado en la tabla
    $scope.selectStudent = function(students) {
        $scope.table2 = true;
        $scope.selectedStudent = students;
        $scope.selected = true;
        console.log($scope.selectedStudent);

        $http.get('/api/student/' + $scope.selectedStudent)
            .success(function(data) {
                $scope.students = data;
                console.log($scope.students);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });


    };
});