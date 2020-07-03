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

        //bookings.items=[];
        bookings.seats=[]
        var promise = MoviesControllerService.getMovies();

        promise.then(function(response){
            var temp=[]
            for(var i=0;i<response.data.length;i++)
            {
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





    }
    
})();