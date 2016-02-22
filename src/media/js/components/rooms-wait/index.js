'use strict';

import Vue from 'vue';

import IScroll from 'iscroll';

import Emitter from '../../core/emitter';

export default Vue.extend({

	inherit: true,

	template: require('./template.html'),

	data: function() {

		return {

			newMessage: ''

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

		this.initIscroll();

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

		initIscroll: function() {

			let wrapper = document.getElementById('rooms-wait-list-chat-iscroll');
			this.IScroll = new IScroll(wrapper, {
				mouseWheel: true,
				scrollbars: true,
				keyBindings: false
			});

			setTimeout(this.IscrollRefresh, 500);

		},

		IscrollRefresh: function() {

			 this.IScroll.refresh();

			 this.IScroll.scrollTo(0, this.IScroll.maxScrollY, 0);

		},

		exitRoom: function() {

			this.socket.emit('exit room');

		},

		startGame: function() {

			Emitter.emit('NEW_GAME_REQUEST', this.room);

		},

		sendMessage: function(txt) {

			if ((txt.replace(/\s/g, '')).length) {

				this.socket.emit('new message', {player: this.me.name, content: txt});

				this.socket.on('new message', this.IscrollRefresh);

				this.newMessage = '';

			}

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

		joypadPartial: require('../../partials/joypad-partial/index.html'),
		clockPartial: require('../../partials/clock-partial/index.html'),
		outPartial: require('../../partials/out-partial/index.html'),
		inPartial: require('../../partials/in-partial/index.html')

	}

});
