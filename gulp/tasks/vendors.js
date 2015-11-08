var files = require('../files');
var	gulp = require('gulp');

var concat = require('gulp-concat');

gulp.task('vendors', function() {
    return gulp.src(files.vendorsBase)
        .pipe(concat({ path: files.vendorsConcat, stat: { mode: 0666 }}))
        .pipe(gulp.dest(files.vendorsDest));
});
