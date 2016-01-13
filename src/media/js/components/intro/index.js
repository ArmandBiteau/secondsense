'use strict';

import Vue from 'vue';

import connectionComponent from '../connection';

export default Vue.extend({

	inherit: true,

	template: require('./template.html'),

	props: {

		socket: {},
		me: {}

	},

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
		connectionComponent
	}

});
