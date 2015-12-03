'use strict';

import loading from '../loading';

import intro from '../intro';

import connection from '../connection';

import rooms from '../rooms';

import game from '../game';

// import {
//     ROOT_URL
// } from '../../core/config';

export default {

    el: '#application',

	template: require('./template.html'),

	data: function() {

		return {

            currentView: 'connection',

            me: {

                id: '',

                name: '',

                email: '',

                gender: '',

                picture: '',

                friends: []

            }

		};

	},

	created: function() {

		this.bind();

	},

	ready: function() {

        this.addEventListener();

        this.createFbSDK();

        this.$http.get('/api/users', function(data) {

            console.log('/api/users :', data);

        }).error(function(data, status, request) {

            console.log(data, status, request);

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

        },

        createFbSDK: function() {

            window.fbAsyncInit = function() {

                FB.init({
                    appId: '1653645381585414',
                    cookie: true,
                    xfbml: true,
                    version: 'v2.5'
                });

            };

            (function(d, s, id) {

                var js;

                var fjs = d.getElementsByTagName(s)[0];

                if (d.getElementById(id)) {return;}

                js = d.createElement(s); js.id = id;

                js.src = 'http://connect.facebook.net/en_US/sdk.js';

                fjs.parentNode.insertBefore(js, fjs);

            }(document, 'script', 'facebook-jssdk'));

        },

        switchView: function(toView) {

            this.currentView = toView;

        }

	},

	components: {

        loading,
        intro,
        connection,
        rooms,
        game

	}

};
