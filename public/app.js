var poke = {};
poke.user = {};
poke.user.pokemon = [];
poke.opponent = {};
poke.opponent.stats = {};
poke.myPokemon = {};
poke.myPokemon.stats = {};
poke.fight = {};


var renderStuff = function(obj, data) {
		obj.stats.name = data.name;
		obj.stats.type = /*'type: ' + */data.types[0].type.name;
		obj.stats.def = /*data.stats[3].stat.name + ': ' + */data.stats[3].base_stat ;
		obj.stats.hp = /*data.stats[5].stat.name + ': ' + */data.stats[5].base_stat;
		obj.stats.attack = /*data.stats[4].stat.name + ': ' + */data.stats[4].base_stat;
		obj.front = data.sprites.front_default
		obj.back = data.sprites.back_default
	}

/////// no more global variables

angular.module('app', ['factory'])

.controller('loginCont', function($window) {
	var logCont = this;
	logCont.poke = $window.poke;
	logCont.ans = false;
	logCont.initGame = function() {
		logCont.poke.user.name = prompt('username please')
		//poke.user.name = username;
		if (logCont.poke.user.name) {
			logCont.poke.user.wins = 0
			logCont.poke.user.losses = 0
			logCont.poke.user.coins = 5;
			logCont.poke.user.potions = 0;
			logCont.poke.user.pokeLoadNumber = 20;
			logCont.poke.user.moreWins = 0;
			logCont.ans = true
			logCont.poke.winsUntilNewPokeLoadNumber();
		}
		return logCont.ans;
	}

	logCont.sellCoin = function() {
		if (poke.user.coins > 0) {
			poke.user.coins --;
			poke.user.potions++;
		} else {console.log("NOT ENOUGH POKE COINS!")}
	}

	logCont.poke.winsUntilNewPokeLoadNumber = function() {
		if (poke.user.wins % 5 === 0) {
			poke.user.pokeLoadNumber = ((poke.user.wins / 5) + 1) * 20
		}
		poke.user.moreWins = 5 - ((poke.user.wins + 5) % 5)
	};
	

})

.controller('grabPokemonCont', function($window, grabPokemonFact) {
	var my = this;
	my.Poke = $window.poke;
	my.answer = false;
	my.grabber = function () {
	grabPokemonFact.grabPokemon()
		.then(function(response) {
			console.log(response.data);
			console.log(response.data.results)
			console.log(my.Poke.user.pokemon, 'lalalhehe');
			response.data.results.forEach(function(item) {
		
				if (my.Poke.user.pokemon.indexOf(item) === -1) {
					my.Poke.user.pokemon.push(item);
				}
			})
			
			
		})
		.catch(function(err) {
			console.log(err, 'error grabPokemon, app.js')
		})

	}
	my.grabOnePokemon = function(url) {
		my.answer = true;
		grabPokemonFact.grabOne(url)
			.then(function(response) {
				console.log(response.data, 'one from factory')
				renderStuff(my.Poke.myPokemon, response.data)

			})
			.catch(function(err) {
				console.log(err, 'error in grabOnePokemon app.js')
			})
	}

	

	})
.controller('grabOpponentCont', function($window, grabPokemonFact){
	var opp = this;
	opp.Poke = $window.poke;
	opp.ans = false;
	opp.grabOneOpponent = function() {
		opp.ans = true;
		var randomIndex = Math.ceil(Math.random() * 149);
		grabPokemonFact.grabOne('http://pokeapi.co/api/v2/pokemon/' + randomIndex)
		.then(function(response) {
			console.log(response, 'this is the opponent')
			renderStuff(opp.Poke.opponent, response.data)
		})
		.catch(function(err) {
			console.log(err, 'this is error in grabOpponnentCont')
		})
	}
})
.controller('fight', function($window) {
	var f = this;
	f.ans = false;
	f.Poke = $window.poke;

	f.startRound = function() {
		if(poke.opponent.stats.hp < 0) {
			poke.opponent = {};
			poke.opponent.stats = {};
			alert('Load New Random Opponent')
			f.ans = !f.ans;
		} else {f.ans = !f.ans;}
		
	}
	
	f.win = function() {
		f.Poke.user.wins++;
		var randomCoin = Math.ceil(Math.random() * 3)
		f.Poke.user.coins += randomCoin;
		alert('You Win! You found ' + randomCoin + ' poke coins!')
		f.hits = false;
		f.Poke.winsUntilNewPokeLoadNumber();
		f.startRound();

	}

	f.lose = function() {
		f.Poke.user.losses++
		alert('You Lost! ', f.Poke.opponent.name, ' wins!')
		f.hits = false;
		f.startRound();
	}

	f.usePotion = function() {
		if (f.Poke.user.potions > 0){
			f.Poke.user.potions--;
			f.Poke.myPokemon.stats.hp += f.Poke.myPokemon.stats.hp
		} else {alert("NO MORE POKE POTIONS!")}
	
	}

	f.attack = function() {
		f.hits = false;
		console.log(poke.myPokemon.stats.hp, poke.opponent.stats.hp)
		var myhit = poke.myPokemon.stats.attack * (poke.opponent.stats.def / 200);
		poke.opponent.stats.hp -= Math.ceil(myhit);
		var opphit = poke.opponent.stats.attack * (poke.myPokemon.stats.def / 200);
		poke.myPokemon.stats.hp -= Math.ceil(opphit);
		f.hits = true;
		f.me = poke.myPokemon.stats.hp
		f.op = poke.opponent.stats.hp
		f.myhit = myhit;
		f.ophit = opphit
		if(poke.myPokemon.stats.hp <= 0) {
			f.lose();
		} else if (poke.opponent.stats.hp <= 0) {
			f.win()
		}

	}
})






