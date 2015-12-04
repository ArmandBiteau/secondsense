'use strict';

import Vue from 'vue';

export default Vue.extend({

	template: require('./template.html'),

	data: function() {

		return {

		};

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

		},

		getFBInfos: function(token) {

			FB.api('/me', 'get', {

				access_token: token,

				fields: 'id, name, gender, picture, email'

			}, (response) => {

				this.$parent.me.id = response.id;

				this.$parent.me.name = response.name;

				this.$parent.me.email = response.email;

				this.$parent.me.gender = response.gender;

				this.$parent.me.picture = response.picture.data.url;

			});

			FB.api('/me/friends', 'get', {

				access_token: token

			}, (response) => {

				this.$parent.me.friends = response.data;

			});

			console.log(this.$parent.me);

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

		}

	},

	components: {

	}

});
