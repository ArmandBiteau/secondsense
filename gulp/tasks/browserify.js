var files = require('../files');
var	gulp = require('gulp');
var	watchify = require('watchify');
var	uglify = require('gulp-uglify');
var	buffer = require('vinyl-buffer');
var	browserify = require('browserify');
//var	remapify = require('remapify');
var	reload = require('browser-sync').reload;
var	sourcemaps = require('gulp-sourcemaps');
var	source = require('vinyl-source-stream');
var	filter = require('gulp-filter');
var errorHandler = require('../error-handler');

var babelify = require('babelify');

var packageJSON = require('../../package.json');
var librairies = Object.keys(packageJSON.dependencies);

gulp.task('browserify', function() {
	var browserifyConfig = watchify(browserify(files.browserifyEntry, watchify.args));

	function rebundle() {
		browserifyConfig
			.external(librairies)
			.transform(babelify, {presets: ['es2015']})
			.bundle()
			.on('error', errorHandler)
			.pipe(source('bundle.js'))
			.pipe(buffer())
			.pipe(sourcemaps.init({
				loadMaps: true
			}))
			.pipe(uglify())
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest(files.browserifyDest))
			.pipe(filter('**/*.js'))
			.pipe(reload({
				stream: true
			}));
	}

	browserifyConfig.on('update', rebundle);

	return rebundle();
});
