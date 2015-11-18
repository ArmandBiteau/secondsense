'use strict';

var Vue = require('vue');

// var i18n = require('vue-i18n');

// var locales = require('../../core/i18n');

// var config = require('../../config');

module.exports = Vue.extend({

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

			}, function(response) {

				this.$parent.me.id = response.id;

				this.$parent.me.name = response.name;

				this.$parent.me.email = response.email;

				this.$parent.me.gender = response.gender;

				this.$parent.me.picture = response.picture.data.url;

			}.bind(this));


			FB.api('/me/friends', 'get', {

				access_token: token

			}, function(response) {

				this.$parent.me.friends = response.data;

			}.bind(this));

			console.log(this.$parent.me);

		},

		statusChangeCallback: function(response) {

			if (response.status === 'connected') {

				var token = response.authResponse.accessToken;

				this.getFBInfos(token);

			} else {

				FB.login(function(response) {

					this.statusChangeCallback(response);

				}.bind(this), {scope: 'public_profile, email, user_friends'});

			}

		},

		checkLoginState: function() {

			FB.getLoginStatus(function(response) {

				this.statusChangeCallback(response);

			}.bind(this));

		}

	},

	components: {

	}

});
