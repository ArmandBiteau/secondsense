'use strict';

import Vue from 'vue';

export default Vue.extend({

	inherit: true,

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

		room: {
			type: Object,
			required: false
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

			document.getElementById('rooms-wait-wrapper').addEventListener('mousemove', (event) => {

				this.updateContainer3D(event);

			});

		},

		exitRoom: function() {

			this.socket.emit('exit room');

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

	}

});
