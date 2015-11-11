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

		}

	},

	components: {

	}

});
