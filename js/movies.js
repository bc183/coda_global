(function () {
    'use strict';
    
    angular.module('movies',[]).
    controller('MoviesController',MoviesController).
    controller('BookingsController',BookingsController).
    service('MoviesControllerService',MoviesControllerService).
    constant('ApiBasePath1',"http://localhost:3000/admin").
    constant('ApiBasePath2',"http://localhost:3000/customer").
    directive('moviesDisplay',MoviesDisplay);


    function MoviesDisplay()
    {
        var ddo={
            templateUrl : 'moviesdisplay.html',
            scope : {
                moviesList : '<'
            },
            controller : MoviesController,
            controllerAs: 'movies',
            bindToController : true
        };

        return ddo;
    }
    MoviesController.$inject=['MoviesControllerService'];
    function MoviesController(MoviesControllerService)
    {
        var movies = this;
        var promise = MoviesControllerService.getMovies();
        promise.then(function(response){
            movies.items=response.data;
            console.log(movies.items);
            
        }).catch(function(err){
            console.log(err);
            
        });


        movies.login=false;

        movies.signup=false;

        movies.name ='';
        movies.password='';

        movies.transfer = function(){
            movies.signup=true;
        }
        movies.signupbutton = function(){
            var post = {
                username : movies.name,
                password : movies.password,
            }

            var promise = MoviesControllerService.getUserDetails();

            promise.then(function(res){
                for(var i=0;i<res.data.length;i++)
                {
                    if(movies.name === res.data[i].username)
                    {
                        window.alert('Username already exists');
                        movies.signup=false;
                        return;
                    }

                }

                var promise = MoviesControllerService.postUserDetails(post);
                promise.then(function(res){
                    window.alert('signup successfull please log in to continue');
                    movies.signup=true;
                    movies.login=true;
                }).catch(function(res){
                    throw new Error('something went wrong');
                })
            }).catch(function(){
                throw new Error('Something went wrong');
            })
        };
        movies.loginbutton = function(){
            var promise = MoviesControllerService.getUserDetails();

            promise.then(function(res){
                for(var i=0;i<res.data.length;i++)
                {
                    if(movies.name === res.data[i].username && movies.password === res.data[i].password)
                    {
                        movies.login=true;
                        movies.signup=true;
                        return;
                    }

                    window.alert('please check your username or password');
                }
            }).catch(function(){
                throw new Error('Something went wrong');
            })
        }



        

        movies.setMovie = function(arg){

            var name = movies[arg].movie;
            MoviesControllerService.setMovie(name);
        
        };
        
    }
    
    BookingsController.$inject=['MoviesControllerService']
    function BookingsController(MoviesControllerService)
    {
        var bookings= this;
        bookings.name='';
        bookings.movie='';
        bookings.date='';
        bookings.show='';
        bookings.seatNo='';
        bookings.screen='';
        bookings.tickets='';
        bookings.totalprice = 120*Number.parseInt(bookings.tickets);
        bookings.booked=false;
        //bookings.name = MoviesControllerService.getName();
        console.log(bookings);
        bookings.id='';
        bookings.cancel = function(){
            var promise = MoviesControllerService.cancelTicket(bookings.id);
            promise.then(function(res){
                window.alert('cancellation successful');
            }).catch(function(){
                throw new Error('something worng');
            });
        }
        //bookings.items=[];
        bookings.seats=[]
        bookings.names=[]
        var promise = MoviesControllerService.getMovies();

        promise.then(function(response){
            var temp=[]
            for(var i=0;i<response.data.length;i++)
            {
                bookings.names.push({name : response.data[i].movie, url : response.data[i].url});
                temp.push(response.data[i].seatno);
            }
            for(var i=1;i<=10;i++)
            {
                if(temp.indexOf(i)==-1)
                {
                    bookings.seats.push(i);
                }
            }
            console.log(bookings.seats);
            console.log(bookings.names);
            
            
            
        }).catch(function(err){
            console.log(err);
            
        });
        bookings.bookTicket= function()
        {
            //console.log(bookings.name)
            var post = {
                "customer": bookings.name,
                "movie": bookings.movie,
                "date": bookings.date,
                "show": bookings.show,
                "screen": bookings.screen,
                "seatno": Number.parseInt(bookings.seatNo),
                "ticket": Number.parseInt(bookings.tickets),
                "totalprice": Number.parseInt(bookings.totalprice)
            }
            var promise = MoviesControllerService.book(post);
            promise.then(function(response){
                bookings.items=response.data;
                bookings.booked=true;
                console.log(bookings.items);
            }).catch(function(err){
                window.alert(err);
            })
        };

        bookings.cancelNow = function(){

            var promise = MoviesControllerService.cancelTicket(bookings.items._id);
            promise.then(function(res){
                window.alert('cancellation successful');
            }).catch(function(){
                throw new Error('something worng');
            });

        }
    }

    MoviesControllerService.$inject=['$http','ApiBasePath1','ApiBasePath2'];
    function MoviesControllerService($http,ApiBasePath1,ApiBasePath2)
    {
        var service = this;

        service.getMovies = function(){
            return $http({
                method:"GET",
                url : ApiBasePath1
            }).then(function(response){
                return response;
            }).catch(function(err){
                throw new Error("error");
            });
        };

        service.cancelTicket = function(arg){
            return $http({
                method:"DELETE",
                url : "http://localhost:3000/customer"
            }).then(function(response){
                return response;
            }).catch(function(response){
                return new Error("Something wrong");
            });
        };

        service.book = function(post){
            console.log(post);
            
            return $http({
                method:"POST",
                url : ApiBasePath2,
                data : JSON.stringify(post),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
               }
            }).then(function(response){
                return response;
            }).catch(function(err){
                throw new Error(err);
            })
            
        };

        service.setMovie = function(arg)
        {
            service.name=arg;
            
        };

        service.getName = function(){
            return service.name;
        }

        service.getUserDetails = function(){

            return $http({
                method:"GET",
                url : 'http://localhost:3000/user'
            }).then(function(response){
                return response;
            }).catch(function(err){
                throw new Error("error");
            });

        }

        service.postUserDetails = function(arg){

            return $http({
                method:"POST",
                url : 'http://localhost:3000/user',
                data : JSON.stringify(arg),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
               }
            }).then(function(response){
                return response;
            }).catch(function(err){
                throw new Error(err);
            })
            
        }





    }
    
})();