'use strict';

import Vue from 'vue';

export default Vue.component('game-end-component', {

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
