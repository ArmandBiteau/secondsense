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

		// this.createFakeActiveRoom();

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

			this.socket.emit('new player', {id: _this.me.id, name: _this.me.name, score: _this.me.score, picture: _this.me.picture});

			this.socket.on('new player', _this.onNewPlayer);

			this.socket.on('exit room', _this.onExitRoom);

			this.socket.on('update rooms', _this.onUpdateRoom);

			this.onUpdateRoom();

		},

		onNewPlayer: function(data) {

			console.log('New player : ' + data.name + ' => ' + data.room);

		},

		createFakeActiveRoom: function() {

			this.activeRoom = {
				id: 'AwesomeImac-12',
				maxPlayers: 5,
				name: 'Awesome Imac',
				players: [{
					id: null,
					name: 'Armand Bto',
					score: 12467,
					picture: 'https://scontent.xx.fbcdn.net/hprofile-xtf1/v/t1.0-1/p50x50/10982891_1184887868203877_3238801022109576051_n.jpg?oh=be9261d34e8eed564bb003e024e84d28&oe=5769CE9D'
				},{
					id: null,
					name: 'Jordi Bastide',
					score: 365,
					picture: 'https://scontent.xx.fbcdn.net/hprofile-xtf1/v/t1.0-1/p50x50/10982891_1184887868203877_3238801022109576051_n.jpg?oh=be9261d34e8eed564bb003e024e84d28&oe=5769CE9D'
				},{
					id: null,
					name: 'Denis Tribouillois',
					score: 1193,
					picture: 'https://scontent.xx.fbcdn.net/hprofile-xtf1/v/t1.0-1/p50x50/10982891_1184887868203877_3238801022109576051_n.jpg?oh=be9261d34e8eed564bb003e024e84d28&oe=5769CE9D'
				}],
				messages: [{
					player: 'Armand Bto',
					content: 'test message'
				},{
					player: 'Jordi Bastide',
					content: 'second test message'
				}]
			};

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
					host: this.me.id,
					name: name,
					maxPlayers: parseInt(players, 10)
				};

				this.socket.emit('new room', newRoom);

				this.activeRoom_uid = newRoom.id;

				this.isanActiveRoom = true;

			} else {

				console.log('Give a name to your room');

			}

			this.newRoomName = '';

			this.newRoomPlayers = 5;

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
