var files = require('../files');
var	gulp = require('gulp');
var	uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');

var babel = require('gulp-babel');

gulp.task('babel-server', function() {

	return gulp.src('src/server/**/*.js')
	.pipe(plumber())
	.pipe(babel())
	// .pipe(uglify())
	.pipe(gulp.dest('server'));

});
