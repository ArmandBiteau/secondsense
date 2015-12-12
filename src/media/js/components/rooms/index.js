'use strict';

import Vue from 'vue';

export default Vue.extend({

	inherit: true,

	template: require('./template.html'),

	data: function() {

		return {

			rooms: []

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
	    }

	},

	created: function() {

		this.bind();

	},

	ready: function() {

        this.addEventListener();

		this.openRoomSession();

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

		},

		openRoomSession: function() {

			let _this = this;

			this.socket.emit('new player', {name: _this.me.name});

			this.socket.on('new player', _this.onNewPlayer);

			this.socket.on('update rooms', _this.onUpdateRoom);

		},

		onNewPlayer: function(data) {

			console.log(data);

		},

		onSwitchRoom: function(newroom) {

			this.socket.emit('switch room', newroom);

		},

		onUpdateRoom: function(rooms) {

			this.rooms = rooms;

			console.log(this.rooms);

		}

	},

	components: {

	}

});
