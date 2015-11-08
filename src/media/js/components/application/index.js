'use strict';

var Vue = require('vue');

var i18n = require('vue-i18n');

var locales = require('../../core/i18n');

Vue.use(i18n, {
  lang: 'en',
  locales: locales
});

new Vue({

    el: '#application',

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

        console.log('Application ready !');

        var socket = io('http://secondsense.dev:8000');

        socket.on('news', function(data) {

            console.log(data);

            socket.emit('my other event', {my: 'data'});

        });

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
