var gulp = require('gulp');
var	browserSync = require('browser-sync');

gulp.task('browser-sync', function() {
	browserSync({
		proxy: 'secondsense.local',
		browser: 'google chrome',
		online: false,
		ui: false,
		ghostMode: false
	});
});
