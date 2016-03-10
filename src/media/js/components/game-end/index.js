'use strict';

import Vue from 'vue';

import Emitter from '../../core/emitter';

export default Vue.component('game-end-component', {

	template: require('./template.html'),

	data: function() {

		return {

		};

	},

	props: {

		socket: {
			type: Object,
			required: true
		},

		me: {
			type: Object,
			required: true
		},

		GameRoom: {
			type: Object,
			required: true
		}

	},

	created: function() {

		this.bind();

	},

	ready: function() {

        this.addEventListener();

	},

	watch: {

	},

	methods: {

		/*
		 * Binding & Events
		*/

		bind: function() {

		},

		addEventListener: function() {

			document.getElementById('game-end-wrapper').addEventListener('mousemove', (event) => {

				this.updateContainer3D(event);

			});

		},

		updateScores: function(my_score) {

			this.me.game_score = my_score;
			this.me.score.game_count++;

			return new Promise((resolve, reject) => {

	        	this.$http.put('/api/users/' + this.me.id + '/score', this.me, () => {

	        		// console.log('Player score updated : ', data);

	        		resolve();

	        	}).error((data, status, request) => {

	        		console.log(data, status, request);

	        		reject('Error during Player score update');

	        	});
	        });

		},

		getPlayerScore: function() {

        	return new Promise((resolve, reject) => {

	        	this.$http.get('/api/users/' + this.me.id + '/score', (data) => {

	        		this.me.score = data[0];

	        		resolve();

	        	}).error((data, status, request) => {

	        		console.log(data, status, request);

	        		reject('Error while accessing to Player score');

	        	});
	        });
        },

        getPlayerRewards: function() {

        	return new Promise((resolve, reject) => {

	        	this.$http.get('/api/users/' + this.me.id + '/rewards', (data) => {

	        		this.me.rewards = data;

	        		resolve();

	        	}).error((data, status, request) => {

	        		console.log(data, status, request);

	        		reject('Error while accessing to Player rewards');

	        	});
	        });
        },

		exitRoom: function() {

			Emitter.emit('EXIT_PARTY_REQUEST');

		},

		updateContainer3D: function(event) {

			let x = event.clientX - window.innerWidth/2;
			let y = event.clientY - window.innerHeight/2;

			TweenMax.to(this.$els.waitcontainer, 0.001, {
				css: {
					'transform': 'rotateX('+ -y/60 +'deg) rotateY('+ x/100 +'deg) translateZ(50px)'
				}
			});

		}

	},

	components: {

	},

	partials: {

		outPartial: require('../../partials/out-partial/index.html')

	},

	transitions: {

		'gameend': {

			beforeEnter: function() {

				var myRoomProfile = this.GameRoom.players.filter((obj) => {	return obj.id === this.me.id; })[0];

				this.updateScores(myRoomProfile.gems).then(this.getPlayerScore).then(this.getPlayerRewards).then(() => {

					console.log('Scores updated : ', this.me.score);

				});

			},

			enter: function() {

			},

			beforeLeave: function() {

			},

			leave: function() {

			}

		}

	}

});
