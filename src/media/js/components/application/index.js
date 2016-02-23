'use strict';

import loading from '../loading';

import intro from '../intro';

import rooms from '../rooms';

import game from '../game';

import background from '../background';

import Emitter from '../../core/emitter';

// import {
//     ROOT_URL
// } from '../../core/config';

export default {

    el: '#application',

	template: require('./template.html'),

	data: function() {

		return {

            currentView: 'intro',

            me: {

                id: '',

                name: '',

                email: '',

                gender: '',

                picture: '',

                friends: [],

                connected: false

            },

            isGameRunning: false,

            GameRunningRoom: {},

            socket: null

		};

	},

	created: function() {

		this.bind();

	},

	ready: function() {

        this.initSounds();

        this.addEventListener();

        this.createNodeSession();

        this.createFbSDK();

        // this.testPHPApi();

	},

	watch: {

        currentView: function() {

            this.initSounds();

        }

	},

	methods: {

        /*
        * Binding & Events
        */

        bind: function() {

        },

        addEventListener: function() {

            Emitter.on('NEW_GAME_REQUEST', this.newGame);

        },

        initSounds: function() {

            let zbtns = document.querySelectorAll('.is-sound');

            for (var x=0; x<zbtns.length; x++)
            {
                zbtns[x].addEventListener('mouseover', () => {

                        Emitter.emit('SOUND_MANAGER_REQUEST_SOUND_CLICK');

                });
            }

        },

        testPHPApi: function() {

            // GET ALL PLAYERS
            this.$http.get('/api/users', (data) => {

                console.log('/api/users :', data);

            }).error((data, status, request) => {

                console.log(data, status, request);

            });

            // GET Armand Bto
            this.$http.get('/api/users/1259753977383932', (data) => {

                console.log('/api/users/1259753977383932 :', data);

            }).error((data, status, request) => {

                console.log(data, status, request);

            });

            // GET Armand Bto's friends
            this.$http.get('/api/users/1259753977383932/friends', (data) => {

                console.log('/api/users/1259753977383932/friends :', data);

            }).error((data, status, request) => {

                console.log(data, status, request);

            });

            // GET Jordi score
            this.$http.get('/api/users/10207942504911437/score', (data) => {

                console.log('/api/users/10207942504911437/score :', data);

            }).error((data, status, request) => {

                console.log(data, status, request);

            });

        },

        createNodeSession: function() {

            var _this = this;

            this.socket = io.connect('http://192.168.33.10:3000');

            this.socket.on('new game', _this.onNewGameAsGuest);

        },

        createFbSDK: function() {

            window.fbAsyncInit = () => {

                FB.init({
                    appId: '1653645381585414',
                    cookie: true,
                    xfbml: true,
                    version: 'v2.5'
                });

            };

            (function(d, s, id) {

                let js;

                let fjs = d.getElementsByTagName(s)[0];

                if (d.getElementById(id)) {return;}

                js = d.createElement(s); js.id = id;

                js.src = 'http://connect.facebook.net/en_US/sdk.js';

                fjs.parentNode.insertBefore(js, fjs);

            }(document, 'script', 'facebook-jssdk'));

        },

        switchView: function(toView) {

            this.currentView = toView;

        },

        newGame: function(room) {

            this.isGameRunning = true;

            this.socket.emit('new game', room);

            this.GameRunningRoom = room;

        },

        onNewGameAsGuest: function(room) {

            this.isGameRunning = true;

            this.GameRunningRoom = room;

        }

	},

	components: {

        loading,
        intro,
        rooms,
        game,
        background

	}

};
