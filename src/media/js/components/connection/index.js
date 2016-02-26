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
		 		console.log('Friends via FB API: ', this.me.friends);
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

		 	this.getPlayerInfos().then(this.updatePlayerInfos).catch(this.setPlayerInfos).then(this.updatePlayerFriends).then(this.getPlayerFriends).then(this.getPlayerScore);

		 	this.connected = true;

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

		 				console.log('Already exists :', data);
		 				resolve(player);

		 			}

		 		}).error((data, status, request) => {

		 			console.log(data, status, request);

		 		});

		 	});
        },

        setPlayerInfos: function(player) {

        	this.$http.post('/api/users', player, (data) => {

        		console.log('New player added :', data);

        	}).error((data, status, request) => {

        		console.log(data, status, request);

        	});

        	return player;
        },

        updatePlayerInfos: function(player) {

        	this.$http.put('/api/users/' + player.facebook_user_id, player, (data) => {

        		console.log('Player info updated  :', data.facebook_user_name);

        	}).error((data, status, request) => {

        		console.log(data, status, request);

        	});

        	return player;
        },

        updatePlayerFriends: function(player) {

        	this.$http.put('/api/users/' + player.facebook_user_id + '/friends', player, (data) => {

        		console.log('Player friends updated  :', data);

        	}).error((data, status, request) => {

        		console.log(data, status, request);

        	});

        	return player;
        },

        getPlayerScore: function(player) {

        	this.$http.get('/api/users/' + player.facebook_user_id + '/score', (data) => {

        		this.me.score = data;

        	}).error((data, status, request) => {

        		console.log(data, status, request);

        	});

        },

        getPlayerFriends: function(player) {

        	this.$http.get('/api/users/' + player.facebook_user_id + '/friends', player, (data) => {

        		this.me.friends = data;
        		console.log('Player friends via BDD:', this.me.friends);

            }).error((data, status, request) => {

                console.log(data, status, request);

            });

            return player;
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
