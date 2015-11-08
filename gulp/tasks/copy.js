var files = require('../files');
var	gulp = require('gulp');

gulp.task('copy', function() {
	return gulp.src(files.copyEntry, {
			base: files.copyBase
		})
		.pipe(gulp.dest(files.copyDest));
});
