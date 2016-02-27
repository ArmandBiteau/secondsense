'use strict';

import Vue from 'vue';

export default Vue.component('connection-component', {

	inherit: true,

	template: require('./template.html'),

	data: function() {

		return {

			connected: false

		};

	},

	props: {

		socket: {},
		me: {}

	},

	created: function() {

		this.bind();

	},

	ready: function() {

		this.addEventListener();

	},

	watch: {

		connected: function() {

			console.log('Connected as', this.me.name);

			this.onConnected();

		}

	},

	methods: {

		/*
		 * Binding & Events
		 */

		 bind: function() {

		 },

		 addEventListener: function() {

		 },

		 getFBInfos: function(token) {

		 	FB.api('/me', 'get', {

		 		access_token: token,

		 		fields: 'id, name, gender, picture, email'

		 	}, (response) => {

		 		this.me.id = response.id;

		 		this.me.name = response.name;

		 		this.me.email = response.email;

		 		this.me.gender = response.gender;

		 		this.me.picture = response.picture.data.url;

		 	});

		 	FB.api('/me/friends', 'get', {

		 		access_token: token

		 	}, (response) => {

		 		this.me.friends = response.data;

		 		this.checkDatabase();

		 	});

		 },

		 statusChangeCallback: function(response) {

		 	if (response.status === 'connected') {

		 		let token = response.authResponse.accessToken;

		 		this.getFBInfos(token);

		 	} else {

		 		FB.login((response) => {

		 			this.statusChangeCallback(response);

		 		}, {scope: 'public_profile, email, user_friends'});

		 	}

		 },

		 checkLoginState: function() {

		 	FB.getLoginStatus((response) => {

		 		this.statusChangeCallback(response);

		 	});

		 },

		 checkDatabase: function() {

		 	// Access to player infos
		 	this.getPlayerInfos().catch(this.setPlayerInfos).then(this.updatePlayerInfos).then(this.updatePlayerFriends).then(this.getPlayerFriends).then(this.getPlayerScore).then(this.updatePlayerScore).then(this.getPlayerScore).then(this.getPlayerRewards).then((player) =>
				{
					console.log('All done !! : ', player);

					this.connected = true;
		 		});
		 },

		 getPlayerInfos: function() {

		 	return new Promise((resolve, reject) => {

		 		var _this = this;

		 		var player = {

		 			facebook_user_id: _this.me.id,

		 			facebook_user_name: _this.me.name,

		 			facebook_user_picture: _this.me.picture,

		 			friends: _this.me.friends

		 		};

		 		this.$http.get('/api/users/' + player.facebook_user_id, (data) => {

		 			if (!data) {

		 				console.log('This player doesn\'t exit yet');

		 				reject(player);

		 			} else {

		 				console.log('This player already exists');

		 				resolve(player);

		 			}

		 		}).error((data, status, request) => {

		 			console.log(data, status, request);

		 		});

		 	});
        },

        setPlayerInfos: function(player) {

        	return new Promise((resolve, reject) => {

	        	this.$http.post('/api/users', player, () => {

	        		console.log('New player added');

	        		resolve(player);

	        	}).error((data, status, request) => {

	        		console.log(data, status, request);

	        		reject('Error during player creation');

	        	});
	        });
        },

        updatePlayerInfos: function(player) {

        	return new Promise((resolve, reject) => {

	        	this.$http.put('/api/users/' + player.facebook_user_id, player, (data) => {

	        		console.log('Player info updated  :', data.facebook_user_name);

	        		resolve(player);

	        	}).error((data, status, request) => {

	        		console.log(data, status, request);

	        		reject('Error during Player Infos update');

	        	});
	        });
        },

        updatePlayerFriends: function(player) {

        	return new Promise((resolve, reject) => {

	        	this.$http.put('/api/users/' + player.facebook_user_id + '/friends', player, () => {

	        		console.log('Player friends updated');

	        		resolve(player);

	        	}).error((data, status, request) => {

	        		console.log(data, status, request);

	        		reject('Error during Player Friends update');

	        	});
	        });
        },
// This function updatePlayerScore will move in an other component soon
        updatePlayerScore: function(player) {

        	return new Promise((resolve, reject) => {

        		//TEST
	        	player.game_score = 99999;
	        	//

	        	this.$http.put('/api/users/' + player.facebook_user_id + '/score', player, () => {

	        		console.log('Player score updated');

	        		resolve(player);

	        	}).error((data, status, request) => {

	        		console.log(data, status, request);

	        		reject('Error during Player score update');

	        	});
	        });
        },

        getPlayerScore: function(player) {

        	return new Promise((resolve, reject) => {

	        	this.$http.get('/api/users/' + player.facebook_user_id + '/score', (data) => {

	        		this.me.score = data;
	        		player.score = data;

	        		resolve(player);

	        	}).error((data, status, request) => {

	        		console.log(data, status, request);

	        		reject('Error while accessing to Player score');

	        	});
	        });
        },

        getPlayerRewards: function(player) {

        	return new Promise((resolve, reject) => {

	        	this.$http.get('/api/users/' + player.facebook_user_id + '/rewards', (data) => {

	        		this.me.rewards = data;
	        		player.rewards = data;

	        		resolve(player);

	        	}).error((data, status, request) => {

	        		console.log(data, status, request);

	        		reject('Error while accessing to Player rewards');

	        	});
	        });
        },

        getPlayerFriends: function(player) {

        	return new Promise((resolve, reject) => {

	        	this.$http.get('/api/users/' + player.facebook_user_id + '/friends', player, (data) => {

	        		this.me.friends = data;
	        		player.friends = data;

	        		resolve(player);

	            }).error((data, status, request) => {

	                console.log(data, status, request);

	                reject('Error while accessing to Player friends');
	            });
	        });
        },

        onConnected: function() {

        	this.me.connected = true;

        	setTimeout(() => {

        		this.$parent.$parent.switchView('rooms');

        	}, 2000);

        }

    },

    components: {

    }

});
