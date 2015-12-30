var files = require('../files');
var	gulp = require('gulp');

var	phplint = require('phplint').lint;

gulp.task('lint-api', function(cb) {

	phplint([files.lintApiEntry], {limit: 10}, function(err, stdout, stderr) {
		if (err) {
			cb(err)
			process.exit(1)
		}
		cb()
	})

});
