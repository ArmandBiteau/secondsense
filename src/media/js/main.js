'use strict';

/*!
 * VERSION: 2.0.15
 * DATE: 2015-02-11
 *
 * @license Copyright (c) 2015, Armand Biteau. All rights reserved.
 * @author: Armand Biteau, hello@armandbiteau.com
 **/

import Vue from 'vue';

import VueResource from 'vue-resource';

import i18n from 'vue-i18n';

import locales from './core/i18n';

import Application from './components/application';

import domready from 'domready';

class Main {

	constructor() {

		this.bind();

		this.addEventListener();

		this.initilizeresources();

		this.start();
	}

	bind() {}

	addEventListener() {}

	initilizeresources() {

		Vue.use(i18n, {
			lang: 'en',
			locales: locales
		});

        Vue.use(VueResource);

	}

	start() {

		Promise.all([
			// SoundManager.start()
		])

		.then(() => {

			new Vue(Application);

		});

	}
}

domready(() => {

	new Main();

});
