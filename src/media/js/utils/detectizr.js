'use strict';

/*!
 * Detectizr v2.0.0
 * http://barisaydinoglu.github.com/Detectizr/
 *
 * Written by Baris Aydinoglu (http://baris.aydinoglu.info) - Copyright 2012
 * Released under the MIT license
 *
 * Date: 2014-03-21
 */

var Modernizr = window.Modernizr;

var docElement = document.documentElement;

var resizeTimeoutId;

var oldOrientation;

let deviceTypes = ['tv', 'tablet', 'mobile', 'desktop'];

let options = {

	// option for enabling HTML classes of all features (not only the true features) to be added
	addAllFeaturesAsClass: false,
	// option for enabling detection of device
	detectDevice: true,
	// option for enabling detection of device model
	detectDeviceModel: true,
	// option for enabling detection of screen size
	detectScreen: true,
	// option for enabling detection of operating system type and version
	detectOS: true,
	// option for enabling detection of browser type and version
	detectBrowser: true
};

let rclass = /[\t\r\n]/g;

function extend(obj, extObj) {
	var a;
	var b;
	var i;

	if (arguments.length > 2) {

		for (a = 1, b = arguments.length; a < b; a += 1) {

			extend(obj, arguments[a]);
		}

	} else {

		for (i in extObj) {

			if (extObj.hasOwnProperty(i)) {

				obj[i] = extObj[i];
			}
		}
	}

	return obj;
}

// localized string trim method

function trim(value) {

	return value.replace(/^\s+|\s+$/g, '');
}

// convert string to camelcase

function toCamel(string) {

	if (string === null || string === undefined) {

		return '';
	}

	return String(string).replace(/((\s|\-|\.)+[a-z0-9])/g, function($1) {

		return $1.toUpperCase().replace(/(\s|\-|\.)/g, '');
	});
}

// removeClass function inspired from jQuery.removeClass

function removeClass(element, value) {

	var class2remove = value || '';
	var cur = element.nodeType === 1 && (element.className ? (' ' + element.className + ' ').replace(rclass, ' ') : '');

	if (cur) {

		while (cur.indexOf(' ' + class2remove + ' ') >= 0) {

			cur = cur.replace(' ' + class2remove + ' ', ' ');

		}

		element.className = value ? trim(cur) : '';
	}
}

// add test to Modernizr based on a condition
function addConditionalTest(feature, test) {

	if (!!feature && !!Modernizr) {

		if (options.addAllFeaturesAsClass) {

			Modernizr.addTest(feature, test);

		} else {

			test = typeof test === 'function' ? test() : test;

			if (test) {

				Modernizr.addTest(feature, true);

			} else {

				delete Modernizr[feature];

				removeClass(docElement, feature);
			}
		}
	}
}

// set version based on versionFull
function setVersion(versionType, versionFull) {

	versionType.version = versionFull;

	var versionArray = versionFull.split('.');

	if (versionArray.length > 0) {

		versionArray = versionArray.reverse();

		versionType.major = versionArray.pop();

		if (versionArray.length > 0) {

			versionType.minor = versionArray.pop();

			if (versionArray.length > 0) {

				versionArray = versionArray.reverse();

				versionType.patch = versionArray.join('.');

			} else {

				versionType.patch = '0';
			}

		} else {

			versionType.minor = '0';
		}

	} else {

		versionType.major = '0';
	}
}

// add version test to Modernizr

function addVersionTest(version, major, minor) {

	if (!!version) {

		version = toCamel(version);

		if (!!major) {

			major = toCamel(major);

			addConditionalTest(version + major, true);

			if (!!minor) {

				addConditionalTest(version + major + '_' + minor, true);
			}
		}
	}
}

class Detectizr {

	constructor(opt) {

		this.options = extend({}, options, opt || {});

		this.device = this.os = {};

		this.browser = {

			userAgent: (navigator.userAgent || navigator.vendor || window.opera).toLowerCase()

		};

		this.detect();

	}

	// simplified and localized indexOf method as one parameter fixed as useragent

	is(key) {

		return this.browser.userAgent.indexOf(key) > -1;
	}

	// simplified and localized regex test method as one parameter fixed as useragent

	test(regex) {

		return regex.test(this.browser.userAgent);
	}

	// simplified and localized regex exec method as one parameter fixed as useragent

	exec(regex) {

		return regex.exec(this.browser.userAgent);
	}

	checkOrientation() {

		//timeout wrapper points with doResizeCode as callback
		window.clearTimeout(resizeTimeoutId);

		var _this = this;

		resizeTimeoutId = window.setTimeout(function() {

			oldOrientation = _this.device.orientation;

			//wrapper for height/width check
			if (window.innerHeight > window.innerWidth) {

				_this.device.orientation = 'portrait';

			} else {

				_this.device.orientation = 'landscape';
			}

			addConditionalTest(_this.device.orientation, true);

			if (oldOrientation !== _this.device.orientation) {

				addConditionalTest(oldOrientation, false);
			}

		}, 10);
	}

	detect() {

		/** Device detection **/

		if (this.options.detectDevice) {

			if (this.test(/googletv|smarttv|internet.tv|netcast|nettv|appletv|boxee|kylo|roku|dlnadoc|ce\-html/)) {

				// Check if user agent is a smart tv

				this.device.type = deviceTypes[0];

				this.device.model = 'smartTv';

			} else if (this.test(/xbox|playstation.3|wii/)) {

				// Check if user agent is a game console

				this.device.type = deviceTypes[0];

				this.device.model = 'gameConsole';

			} else if (this.test(/ip(a|ro)d/)) {

				// Check if user agent is a iPad

				this.device.type = deviceTypes[1];

				this.device.model = 'ipad';

			} else if ((this.test(/tablet/) && !this.test(/rx-34/)) || this.test(/folio/)) {

				// Check if user agent is a Tablet

				this.device.type = deviceTypes[1];

				this.device.model = String(this.exec(/playbook/) || '');

			} else if (this.test(/linux/) && this.test(/android/) && !this.test(/fennec|mobi|htc.magic|htcX06ht|nexus.one|sc-02b|fone.945/)) {

				// Check if user agent is an Android Tablet

				this.device.type = deviceTypes[1];

				this.device.model = 'android';

			} else if (this.test(/kindle/) || (this.test(/mac.os/) && this.test(/silk/))) {

				// Check if user agent is a Kindle or Kindle Fire

				this.device.type = deviceTypes[1];

				this.device.model = 'kindle';

			} else if (this.test(/gt-p10|sc-01c|shw-m180s|sgh-t849|sch-i800|shw-m180l|sph-p100|sgh-i987|zt180|htc(.flyer|\_flyer)|sprint.atp51|viewpad7|pandigital(sprnova|nova)|ideos.s7|dell.streak.7|advent.vega|a101it|a70bht|mid7015|next2|nook/) || (this.test(/mb511/) && this.test(/rutem/))) {

				// Check if user agent is a pre Android 3.0 Tablet

				this.device.type = deviceTypes[1];

				this.device.model = 'android';

			} else if (this.test(/bb10/)) {

				// Check if user agent is a BB10 device

				this.device.type = deviceTypes[1];

				this.device.model = 'blackberry';

			} else {

				// Check if user agent is one of common mobile types

				this.device.model = this.exec(/iphone|ipod|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec|j2me/);

				if (this.device.model !== null) {

					this.device.type = deviceTypes[2];

					this.device.model = String(this.device.model);

				} else {

					this.device.model = '';

					if (this.test(/bolt|fennec|iris|maemo|minimo|mobi|mowser|netfront|novarra|prism|rx-34|skyfire|tear|xv6875|xv6975|google.wireless.transcoder/)) {

						// Check if user agent is unique Mobile User Agent

						this.device.type = deviceTypes[2];

					} else if (this.test(/opera/) && this.test(/windows.nt.5/) && this.test(/htc|xda|mini|vario|samsung\-gt\-i8000|samsung\-sgh\-i9/)) {

						// Check if user agent is an odd Opera User Agent - http://goo.gl/nK90K

						this.device.type = deviceTypes[2];

					} else if ((this.test(/windows.(nt|xp|me|9)/) && !this.test(/phone/)) || this.test(/win(9|.9|nt)/) || this.test(/\(windows 8\)/)) {

						// Check if user agent is Windows Desktop, '(Windows 8)' Chrome extra exception

						this.device.type = deviceTypes[3];

					} else if (this.test(/macintosh|powerpc/) && !this.test(/silk/)) {

						// Check if agent is Mac Desktop

						this.device.type = deviceTypes[3];

						this.device.model = 'mac';

					} else if (this.test(/linux/) && this.test(/x11/)) {

						// Check if user agent is a Linux Desktop

						this.device.type = deviceTypes[3];

					} else if (this.test(/solaris|sunos|bsd/)) {

						// Check if user agent is a Solaris, SunOS, BSD Desktop

						this.device.type = deviceTypes[3];

					} else if (this.test(/bot|crawler|spider|yahoo|ia_archiver|covario-ids|findlinks|dataparksearch|larbin|mediapartners-google|ng-search|snappy|teoma|jeeves|tineye/) && !this.test(/mobile/)) {

						// Check if user agent is a Desktop BOT/Crawler/Spider

						this.device.type = deviceTypes[3];

						this.device.model = 'crawler';

					} else {

						// Otherwise assume it is a Mobile Device

						this.device.type = deviceTypes[2];

					}
				}
			}

			let j = deviceTypes.length;

			for (let i = 0; i < j; i += 1) {

				addConditionalTest(deviceTypes[i], (this.device.type === deviceTypes[i]));
			}

			if (this.options.detectDeviceModel) {

				addConditionalTest(toCamel(this.device.model), true);
			}
		}

		/** Screen detection **/
		if (this.options.detectScreen) {

			if (!!Modernizr && !!Modernizr.mq) {

				addConditionalTest('smallScreen', Modernizr.mq('only screen and (max-width: 480px)'));

				addConditionalTest('verySmallScreen', Modernizr.mq('only screen and (max-width: 320px)'));

				addConditionalTest('veryVerySmallScreen', Modernizr.mq('only screen and (max-width: 240px)'));
			}

			if (this.device.type === deviceTypes[1] || this.device.type === deviceTypes[2]) {

				var _this = this;

				window.onresize = function(event) {

					_this.checkOrientation(event);
				};

				this.checkOrientation();

			} else {

				this.device.orientation = 'landscape';

				addConditionalTest(this.device.orientation, true);
			}
		}

		/** OS detection **/
		if (this.options.detectOS) {

			if (this.device.model !== '') {

				if (this.device.model === 'ipad' || this.device.model === 'iphone' || this.device.model === 'ipod') {

					this.os.name = 'ios';

					setVersion(this.os, (this.test(/os\s([\d_]+)/) ? RegExp.$1 : '').replace(/_/g, '.'));

				} else if (this.device.model === 'android') {

					this.os.name = 'android';

					setVersion(this.os, (this.test(/android\s([\d\.]+)/) ? RegExp.$1 : ''));

				} else if (this.device.model === 'blackberry') {

					this.os.name = 'blackberry';

					setVersion(this.os, (this.test(/version\/([^\s]+)/) ? RegExp.$1 : ''));

				} else if (this.device.model === 'playbook') {

					this.os.name = 'blackberry';

					setVersion(this.os, (this.test(/os ([^\s]+)/) ? RegExp.$1.replace(';', '') : ''));
				}
			}

			if (!this.os.name) {

				if (this.is('win') || this.is('16bit')) {

					this.os.name = 'windows';

					if (this.is('windows nt 6.3')) {

						setVersion(this.os, '8.1');

					} else if (this.is('windows nt 6.2') || this.test(/\(windows 8\)/)) { //windows 8 chrome mac fix

						setVersion(this.os, '8');

					} else if (this.is('windows nt 6.1')) {

						setVersion(this.os, '7');

					} else if (this.is('windows nt 6.0')) {

						setVersion(this.os, 'vista');

					} else if (this.is('windows nt 5.2') || this.is('windows nt 5.1') || this.is('windows xp')) {

						setVersion(this.os, 'xp');

					} else if (this.is('windows nt 5.0') || this.is('windows 2000')) {

						setVersion(this.os, '2k');

					} else if (this.is('winnt') || this.is('windows nt')) {

						setVersion(this.os, 'nt');

					} else if (this.is('win98') || this.is('windows 98')) {

						setVersion(this.os, '98');

					} else if (this.is('win95') || this.is('windows 95')) {

						setVersion(this.os, '95');

					}

				} else if (this.is('mac') || this.is('darwin')) {

					this.os.name = 'mac os';

					if (this.is('68k') || this.is('68000')) {

						setVersion(this.os, '68k');

					} else if (this.is('ppc') || this.is('powerpc')) {

						setVersion(this.os, 'ppc');

					} else if (this.is('os x')) {

						setVersion(this.os, (this.test(/os\sx\s([\d_]+)/) ? RegExp.$1 : 'os x').replace(/_/g, '.'));

					}

				} else if (this.is('webtv')) {

					this.os.name = 'webtv';

				} else if (this.is('x11') || this.is('inux')) {

					this.os.name = 'linux';

				} else if (this.is('sunos')) {

					this.os.name = 'sun';

				} else if (this.is('irix')) {

					this.os.name = 'irix';

				} else if (this.is('freebsd')) {

					this.os.name = 'freebsd';

				} else if (this.is('bsd')) {

					this.os.name = 'bsd';

				}
			}

			if (!!this.os.name) {

				addConditionalTest(this.os.name, true);

				if (!!this.os.major) {

					addVersionTest(this.os.name, this.os.major);

					if (!!this.os.minor) {

						addVersionTest(this.os.name, this.os.major, this.os.minor);
					}
				}
			}

			if (this.test(/\sx64|\sx86|\swin64|\swow64|\samd64/)) {

				this.os.addressRegisterSize = '64bit';

			} else {

				this.os.addressRegisterSize = '32bit';
			}

			addConditionalTest(this.os.addressRegisterSize, true);
		}

		/** Browser detection **/

		if (this.options.detectBrowser) {

			if (!this.test(/opera|webtv/) && (this.test(/msie\s([\d\w\.]+)/) || this.is('trident'))) {

				this.browser.engine = 'trident';

				this.browser.name = 'ie';

				if (!window.addEventListener && document.documentMode && document.documentMode === 7) {

					setVersion(this.browser, '8.compat');

				} else if (this.test(/trident.*rv[ :](\d+)\./)) {

					setVersion(this.browser, RegExp.$1);

				} else {

					setVersion(this.browser, (this.test(/trident\/4\.0/) ? '8' : RegExp.$1));

				}

			} else if (this.is('firefox')) {

				this.browser.engine = 'gecko';

				this.browser.name = 'firefox';

				setVersion(this.browser, (this.test(/firefox\/([\d\w\.]+)/) ? RegExp.$1 : ''));

			} else if (this.is('gecko/')) {

				this.browser.engine = 'gecko';

			} else if (this.is('opera')) {

				this.browser.name = 'opera';

				this.browser.engine = 'presto';

				setVersion(this.browser, (this.test(/version\/([\d\.]+)/) ? RegExp.$1 : (this.test(/opera(\s|\/)([\d\.]+)/) ? RegExp.$2 : '')));

			} else if (this.is('konqueror')) {

				this.browser.name = 'konqueror';

			} else if (this.is('chrome')) {

				this.browser.engine = 'webkit';

				this.browser.name = 'chrome';

				setVersion(this.browser, (this.test(/chrome\/([\d\.]+)/) ? RegExp.$1 : ''));

			} else if (this.is('iron')) {

				this.browser.engine = 'webkit';

				this.browser.name = 'iron';

			} else if (this.is('crios')) {

				this.browser.name = 'chrome';

				this.browser.engine = 'webkit';

				setVersion(this.browser, (this.test(/crios\/([\d\.]+)/) ? RegExp.$1 : ''));

			} else if (this.is('applewebkit/')) {

				this.browser.name = 'safari';

				this.browser.engine = 'webkit';

				setVersion(this.browser, (this.test(/version\/([\d\.]+)/) ? RegExp.$1 : ''));

			} else if (this.is('mozilla/')) {

				this.browser.engine = 'gecko';

			}

			if (!!this.browser.name) {

				addConditionalTest(this.browser.name, true);

				if (!!this.browser.major) {

					addVersionTest(this.browser.name, this.browser.major);

					if (!!this.browser.minor) {

						addVersionTest(this.browser.name, this.browser.major, this.browser.minor);

					}

				}

			}

			addConditionalTest(this.browser.engine, true);

			// Browser Language
			this.browser.language = navigator.userLanguage || navigator.language;

			addConditionalTest(this.browser.language, true);
		}
	}
}

export default new Detectizr();
