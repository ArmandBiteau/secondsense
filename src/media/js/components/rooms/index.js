'use strict';

import Vue from 'vue';

import IScroll from 'iscroll';

import roomsWaitComponent from '../rooms-wait';

export default Vue.extend({

	inherit: true,

	template: require('./template.html'),

	data: function() {

		return {

			rooms: [],

			newRoomName: '',

			newRoomPlayers: null,

			maxPlayers: 5,

			isanActiveRoom: false,

			activeRoom: {},

			activeRoom_uid: ''

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

		this.initIscroll();

		this.updateMaxPlayers(this.maxPlayers);

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

			document.getElementById('rooms-wrapper').addEventListener('mousemove', (event) => {

				this.updateContainer3D(event);

			});

			var newRoomPlayersCounter = document.getElementsByClassName('rooms-create-form-players-trig');
			for (var i = 0; i < newRoomPlayersCounter.length; i++) {

				newRoomPlayersCounter[i].addEventListener('click', (event) => {

					this.updateMaxPlayers(event.target.attributes.dataTrig.nodeValue);

				}, false);

			}

		},

		initIscroll: function() {

			let wrapper = document.getElementById('rooms-list-iscroll');
			this.IScroll = new IScroll(wrapper, {
				mouseWheel: true,
				scrollbars: true,
				keyBindings: false
			});

			setTimeout(this.IscrollRefresh, 500);
			setInterval(this.IscrollRefresh, 1000);

		},

		IscrollRefresh: function() {

			 this.IScroll.refresh();

		},

		updateMaxPlayers: function(n) {

			this.newRoomPlayers = n;

			for (var i = 0; i < this.maxPlayers; i++) {

				if (i < this.newRoomPlayers) {

					document.getElementsByClassName('rooms-create-form-players-trig')[i].className = 'rooms-create-form-players-trig trig-'+ (i+1) +' active';

				} else {

					document.getElementsByClassName('rooms-create-form-players-trig')[i].className = 'rooms-create-form-players-trig trig-'+ (i+1);

				}

			}

		},

		openRoomSession: function() {

			let _this = this;

			this.socket.on('connect', function() {

            });

			this.socket.emit('new player', {name: _this.me.name});

			this.socket.on('new player', _this.onNewPlayer);

			this.socket.on('exit room', _this.onExitRoom);

			this.socket.on('update rooms', _this.onUpdateRoom);

			this.onUpdateRoom();

		},

		onNewPlayer: function(data) {

			console.log('New player : ' + data.name + ' => ' + data.room);

		},

		onSwitchRoom: function(room) {

			this.activeRoom_uid = room.id;

			this.isanActiveRoom = true;

			this.socket.emit('switch room', room.id);

		},

		onExitRoom: function() {

			this.activeRoom_uid = '';

			this.isanActiveRoom = false;

			this.activeRoom = {};

		},

		onUpdateRoom: function(rooms) {

			// rooms = [{
			// 		maxPlayers: 5,
			// 		name: 'Awesome Imac',
			// 		players: [{
			// 			id: null,
			// 			name: 'Armand Bto'
			// 		}]
			// 	}
			// ];

			if (rooms) {

				this.rooms = rooms;

				if (this.isanActiveRoom) {

					this.updateActiveRoom();

				}

			} else {

				this.rooms = [];

				this.isanActiveRoom = false;

			}

			this.IscrollRefresh();

		},

		updateActiveRoom: function() {

			this.activeRoom = this.getRoomById(this.activeRoom_uid);

		},

		getRoomById: function(uid) {

			for (let i = 0; i < this.rooms.length; i++) {

	    		if (this.rooms[i].id === uid)

	    			return this.rooms[i];

	    	}

	    	return {};

		},

		createRoom: function(name, players) {

			if (name) {

				let newRoom = {
					id: (name + '-' + (new Date()).getTime()).replace(/\s/g, ''),
					name: name,
					maxPlayers: parseInt(players, 10)
				};

				this.socket.emit('new room', newRoom);

				this.activeRoom_uid = newRoom.id;

				this.isanActiveRoom = true;

			} else {

				console.log('Give a name to your room');

			}

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

		roomsWaitComponent

	}

});
