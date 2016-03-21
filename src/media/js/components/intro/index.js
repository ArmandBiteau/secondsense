'use strict';

import Vue from 'vue';

import connectionComponent from '../connection';

export default Vue.extend({

	inherit: true,

	template: require('./template.html'),

	props: {

		socket: {},
		me: {}

	},

	data: function() {

		return {

		};

	},

	created: function() {

		this.bind();

	},

	ready: function() {

		this.enter = new TimelineMax({paused: true, onComplete:() => {}});

		this.enter
			.to('.intro-wrapper', 3, {
				opacity: 1
			}, '+=0')

			.fromTo('.background-wrapper', 2, {
				opacity: 0
			}, {
				opacity: 1
			}, '-=2');

		this.enter.play();

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

			document.getElementById('intro-wrapper').addEventListener('mousemove', (event) => {

				this.updateContainer3D(event);

			});

		},

		updateContainer3D: function(event) {

			let x = event.clientX - window.innerWidth/2;
			let y = event.clientY - window.innerHeight/2;

			TweenMax.to(this.$els.container, 0.001, {
				css: {
					'transform': 'rotateX('+ -y/60 +'deg) rotateY('+ x/100 +'deg) translateZ(50px)'
				}
			});

		}

	},

	components: {
		connectionComponent
	},

	transitions: {

		'intro': {

			leave: function(el, done) {

				this.leave = new TimelineMax({paused: true, onComplete:() => {

					done();

				}});

				this.leave
					.fromTo('.intro-wrapper', 1, {
						opacity: 1
					}, {
						opacity: 0
					}, '+=0');

				this.leave.play();

			}

		},

		'connection': {

			enter: function(el, done) {

				this.connectionEnter = new TimelineMax({paused: true, onComplete:() => {

					done();

				}});

				this.connectionEnter
					.fromTo('.connection-wrapper', 1, {
						opacity: 0
					}, {
						opacity: 1
					}, '+=1');

				this.connectionEnter.play();

			},

			leave: function(el, done) {

				this.connectionLeave = new TimelineMax({paused: true, onComplete:() => {

					done();

				}});

				this.connectionLeave
					.fromTo('.connection-wrapper', 1, {
						opacity: 1
					}, {
						opacity: 0
					}, '+=0');

				this.connectionLeave.play();

			}

		}

	}

});
