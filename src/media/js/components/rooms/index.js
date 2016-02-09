'use strict';

import Vue from 'vue';

export default Vue.extend({

	inherit: true,

	template: require('./template.html'),

	data: function() {

		return {

			rooms: [],

			newRoomName: '',

			newRoomPlayers: null,

			maxPlayers: 5

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

			this.socket.on('update rooms', _this.onUpdateRoom);

			this.onUpdateRoom();

		},

		onNewPlayer: function(data) {

			console.log(data);

		},

		onSwitchRoom: function(newroom) {

			this.socket.emit('switch room', newroom);

		},

		onUpdateRoom: function(rooms) {

			//tmp
			// rooms = [{
			// 		maxPlayers: 5,
			// 		name: 'Temporary room',
			// 		players: [{
			// 			id: null,
			// 			name: 'Armand Bto'
			// 		}]
			// 	},{
			// 		maxPlayers: 3,
			// 		name: 'Another room',
			// 		players: [{
			// 			id: null,
			// 			name: 'Jordi Bastide'
			// 		}]
			// 	}
			// ];

			this.rooms = rooms;

			// console.log(this.rooms);

		},

		createRoom: function(name, players) {

			if (name) {

				let newRoom = {
					name: name,
					maxPlayers: parseInt(players, 10)
				};

				console.log(newRoom);

				this.socket.emit('new room', newRoom);

			} else {

				console.log('Give a name to your room');

			}

		},

		updateContainer3D: function(event) {

			let x = event.clientX - window.innerWidth/2;
			let y = event.clientY - window.innerHeight/2;

			TweenMax.to(this.$els.container, 0.3, {
				css: {
					'transform': 'rotateX('+ -y/60 +'deg) rotateY('+ x/100 +'deg) translateZ(50px)'
				}
			});

		}

	},

	components: {

	}

});
