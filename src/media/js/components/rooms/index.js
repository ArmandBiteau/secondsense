'use strict';

import Vue from 'vue';

export default Vue.extend({

	inherit: true,

	template: require('./template.html'),

	data: function() {

		return {

			rooms: [],

			me: null

		};

	},

	created: function() {

		this.bind();

	},

	ready: function() {

        this.addEventListener();

		this.openNodeSession();

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

		openNodeSession: function() {

			let _this = this;

			this.socket = io.connect('http://192.168.33.10:3000');

			this.socket.on('connect', function() {

				_this.socket.emit('new player', {name: _this.$parent.me.name});

			});

			this.socket.on('new player', _this.onNewPlayer);

			this.socket.on('update rooms', _this.onUpdateRoom);

		},

		onNewPlayer: function(data) {

			console.log(data);

		},

		onSwitchRoom: function(newroom) {

			this.socket.emit('switch room', newroom);

		},

		onUpdateRoom: function(rooms, currentRoom) {

			this.rooms = rooms;

			this.currentRoom = currentRoom;

			console.log('you join '+currentRoom.name);

			console.log('Players in '+currentRoom.name, currentRoom.players);

		}

	},

	components: {

	}

});
