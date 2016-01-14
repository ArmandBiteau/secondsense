'use strict';

import Detectizr from '../../utils/detectizr';

/*
 * CORE
*/

// export const DEBUG = window.config.DEBUG;

// export const LOG = window.config.LOG;

// export const LIVE = window.config.LIVE;

/*
 * PATHS
*/

export const ROOT_URL = window.location.origin || window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');

export const PATH_DATA = ROOT_URL + '/media/data';

export const PATH_MODELS = PATH_DATA + '/models';

export const PATH_SCRIPTS = ROOT_URL + '/media/js';

export const PATH_GLSL = ROOT_URL + '/media/glsl';

export const PATH_IMAGES = ROOT_URL + '/media/img';

export const PATH_TEXTURES = PATH_IMAGES + '/textures';

export const PATH_SOUNDS = ROOT_URL + '/media/sounds';

/*
 * LOCALS
*/

export const DATE =  new Date();

export const TIMEZONE_OFFSET = -(DATE.getTimezoneOffset() / 60);

/*
 * EXPERIENCE
*/

/*
 * ROUTES
*/

/*
 * DEVICE
*/

export const BROWSER_ENGINE = Detectizr.browser.engine;

export const BROWSER_LANGUAGE = Detectizr.browser.language;

export const BROWSER_MAJOR = parseInt(Detectizr.browser.major, 10);

export const BROWSER_MINOR = parseInt(Detectizr.browser.minor, 10);

export const BROWSER_NAME = Detectizr.browser.name;

export const BROWSER_PATCH = Detectizr.browser.patch;

export const BROWSER_USERAGENT = Detectizr.browser.userAgent;

export const BROWSER_VERSION = Detectizr.browser.version;

export const DEVICE_MODEL = Detectizr.device.model;

export const DEVICE_ORIENTATION = Detectizr.device.orientation;

export const DEVICE_TYPE = Detectizr.device.type;

export const OS_MAJOR = parseInt(Detectizr.os.major, 10);

export const OS_MINOR = parseInt(Detectizr.os.minor, 10);

export const OS_NAME = Detectizr.os.name;

export const OS_PATCH = Detectizr.os.patch;

export const OS_VERSION = Detectizr.os.version;

export const IS_DESKTOP = (Detectizr.device.type === 'desktop') ? true : false;

export const IS_TABLET = (Detectizr.device.type === 'tablet') ? true : false;

export const IS_MOBILE = (Detectizr.device.type === 'mobile') ? true : false;

export const DEVICE_PIXEL_RATIO = window.devicePixelRatio;

/*
 * SOUND FILES
*/

export const SOUND_AMBIANCE = 'ambiance';

export const SOUND_CLICK = 'click';
