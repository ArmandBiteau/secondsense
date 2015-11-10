var files = require('../files');
var	gulp = require('gulp');
var	base64 = require('gulp-base64');
var	filter = require('gulp-filter');
var	sass = require('gulp-sass');
var	minifyCSS = require('gulp-minify-css');
var	sourcemaps = require('gulp-sourcemaps');
var	reload = require('browser-sync').reload;
var	autoprefixer = require('gulp-autoprefixer');
var errorHandler = require('../error-handler');

gulp.task('css', function() {

	return gulp.src(files.cssEntry)
		.pipe(sourcemaps.init())
		.pipe(sass())
		.on('error', errorHandler)
		.pipe(base64({
			baseDir: files.cssBase,
			maxImageSize: 14 * 1024,
			debug: true
		}))
		.pipe(autoprefixer())
		.pipe(minifyCSS())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(files.cssDest))
		.pipe(filter('**/*.css'))
		.pipe(reload({
			stream: true
		}));
});
