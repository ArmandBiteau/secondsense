'use strict';

import Vue from 'vue';

import Emitter from '../../core/emitter';

export default Vue.component('game-score-component', {

	template: require('./template.html'),

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

	data: function() {

		return {

		};

	},

	created: function() {

		this.bind();

	},

	ready: function() {

        this.addEventListener();

		this.createTimer();

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

			document.addEventListener('mousemove', this.onMouseMove);

		},

		createTimer: function() {

			// var timeLeft = 3*60 + 51;

			var timeLeft = 1;

			var r = document.getElementById('timer');

			var w = 0;
			var per = 100 / timeLeft;

			var timer = setInterval(function() {
				timeLeft--;
				var m =(timeLeft / 60) >> 0;
				var s = (timeLeft - m*60) + '';
				w += per;

				r.innerHTML = '<span class="minutes">' + (m.length > 1 ? '' : '0') + m + '</span>' + ':' + '<span class="seconds">' + (s.length > 1 ? '' : '0') + s + '</span>';

				TweenMax.to('#timer-bar-done', 0.1, {
					width: w + '%'
				});

				if (timeLeft <= 0) {

					clearInterval(timer);

					Emitter.emit('GAME_END_REQUEST');

				}

			}, 1000);

		},

		onMouseMove: function() {

		}

	},

	components: {

	},

	partials: {

		boxPartial: require('../../partials/box-partial/index.html')

	}

});
