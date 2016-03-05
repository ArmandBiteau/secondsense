'use strict';

import Vue from 'vue';

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

		updateScores: function() {

			console.log('UPDATE SCORES');

		},

		exitRoom: function() {

			// this.socket.emit('exit room');

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

				this.updateScores();

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
