var gulp = require('gulp');

gulp.task('build', ['clean'], function() {
	gulp.start('postbuild');
});

gulp.task('postbuild', ['css', 'copy', 'librairies', 'vendors', 'browserify', 'babel-server', 'lint-app', 'lint-server', 'lint-api'], function() {
	process.exit();
});
