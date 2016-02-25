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

			document.getElementById('FBlogin').addEventListener('mousedown', () => {

				FB.login((response) => {

					let token = response.authResponse.accessToken;

					this.getFBInfos(token);

				}, {scope: 'public_profile, email, user_friends'});

			});

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

				console.log(this.me);

				this.checkDatabase();

			});

			FB.api('/me/friends', 'get', {

				access_token: token

			}, (response) => {

				this.me.friends = response.data;

			});

		},

		// statusChangeCallback: function(response) {
		//
		// 	if (response.status === 'connected') {
		//
		// 		let token = response.authResponse.accessToken;
		//
		// 		this.getFBInfos(token);
		//
		// 	} else {
		//
		// 		FB.login((response) => {
		//
		// 			this.statusChangeCallback(response);
		//
		// 		}, {scope: 'public_profile, email, user_friends'});
		//
		// 	}
		//
		// },
		//
		// checkLoginState: function() {
		//
		// 	FB.getLoginStatus((response) => {
		//
		// 		this.statusChangeCallback(response);
		//
		// 	});
		//
		// },

		checkDatabase: function() {

			var _this = this;

			var player = {

				facebook_user_id: _this.me.id,

				facebook_user_name: _this.me.name,

				facebook_user_picture: _this.me.picture

			};

            this.$http.get('/api/users/'+_this.me.id, (data) => {

                console.log('Already exists :', data.facebook_user_name);

				// Update player informations
                this.$http.put('/api/users/'+_this.me.id, player, (data) => {

                	console.log('Player info updated  :', data.facebook_user_name);

                });

	            // this.$http.get('/api/users/'+_this.me.id+'/friends', (data) => {
				//
	            //     this.me.friends = data;
				//
	            // }).error((data, status, request) => {
				//
	            //     console.log(data, status, request);
				//
	            // });

				// GET score
	            this.$http.get('/api/users/'+_this.me.id+'/score', (data) => {

	                this.me.score = data;

	            }).error((data, status, request) => {

					this.me.score = {
						sum_score: 0
					};

	                console.log(data, status, request);

	            });

				this.connected = true;

            }).error(() => {

				this.$http.post('/api/users', player, (data) => {

	                console.log('New player added :', data);

					this.connected = true;

	            }).error((data, status, request) => {

	                console.log(data, status, request);

	            });

            });

		},

		onConnected: function() {

			this.me.connected = true;

			setTimeout(() => {

				this.$parent.$parent.switchView('rooms');

			}, 500);

		}

	},

	components: {

	}

});
