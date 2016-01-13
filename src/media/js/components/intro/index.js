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

			document.addEventListener('mousemove', (event) => {

				this.updateContainer3D(event);

			});

		},

		updateContainer3D: function(event) {

			let _this = this;

			let x = event.clientX - window.innerWidth/2;
			let y = event.clientY - window.innerHeight/2;

			TweenMax.to(_this.$els.container, 0.3, {
				css: {
					'transform': 'rotateX('+ -y/70 +'deg) rotateY('+ x/100 +'deg)'
				}
			});

		}

	},

	components: {
		connectionComponent
	}

});
