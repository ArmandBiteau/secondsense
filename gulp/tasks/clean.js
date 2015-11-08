var files = require('../files');
var	gulp = require('gulp');
var	del = require('del');

gulp.task('clean', function(cb) {
	del(files.delEntry, cb);
});
