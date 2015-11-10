'use strict';

var Vue = require('vue');

var i18n = require('vue-i18n');

var locales = require('../../core/i18n');

Vue.use(i18n, {
  lang: 'en',
  locales: locales
});

Vue.use(require('vue-resource'));

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

         this.$http.get('/api/users', function (data, status, request) {

             console.log('/api/users :', data);

          });

        //   this.$http.get('/api/users/2', function (data, status, request) {
          //
        //       console.log('/api/users/2 :', data);
          //
        //    }).error(function (data, status, request) {
          //
        //    });

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
