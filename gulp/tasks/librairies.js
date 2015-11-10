var files = require('../files');
var	gulp = require('gulp');
var	uglify = require('gulp-uglify');
var	browserify = require('browserify');
var	source = require('vinyl-source-stream');
var	buffer = require('vinyl-buffer');

var packageJSON = require('../../package.json');
var librairies = Object.keys(packageJSON.dependencies);

gulp.task('librairies', function() {
	return browserify()
		.require(librairies)
		.bundle()
		.pipe(source('libs.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(gulp.dest(files.browserifyDest));
});
