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

		this.openNodeSession();

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

		openNodeSession: function() {

			let socket = io.connect('http://192.168.33.10:3000');

			socket.emit('nouveau_gamer', {id: this.$parent.me.id, name: this.$parent.me.name});

	        socket.on('message', (message) => {

	            console.log('Serveur : ' + message);

	        });

			socket.emit('message', 'Je suis dans le game ?');

		}

	},

	components: {

	}

});
