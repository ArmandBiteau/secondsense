var gulp = require('gulp');
var	browserSync = require('browser-sync');

gulp.task('browser-sync', function() {
	browserSync({
		ui: {
		    port: 8080
		},
		proxy: {
		    target: 'http://secondsense.local',
		    ws: true
		},
		browser: (process.platform === 'linux' ? 'google-chrome' : 'google chrome'),
	});
});
