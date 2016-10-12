angular.module('factory', [])

.factory('grabPokemonFact', function($http) {
	
	var grabPokemon = function() {
		var off = poke.user.pokeLoadNumber - 20;
		console.log('hi')
		console.log('off');
		return $http.get('http://pokeapi.co/api/v2/pokemon?offset=' + off)
		
	};
	
	var grabOne = function(url) {
		return $http.get(url);
	}


	return {
		grabPokemon : grabPokemon,
		grabOne : grabOne
	}



})