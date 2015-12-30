var files = require('../files');
var	gulp = require('gulp');
var	reload = require('browser-sync').reload;

gulp.task('watch', ['browser-sync', 'css', 'lint-app', 'lint-server', 'lint-api', 'copy'], function() {
	gulp.watch(files.cssEntry, ['css', reload]);
	gulp.watch(files.lintAppEntry, ['lint-app', reload]);
	gulp.watch(files.lintApiEntry, ['lint-api', reload]);
	gulp.watch(files.lintServerEntry, ['lint-server', reload]);
	gulp.watch(files.copyEntry, ['copy', reload]);
});
