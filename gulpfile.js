var gulp = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('hint', function () {
	return gulp.src('*.js')
	.pipe(jshint())
	.pipe(jshint.reporter('default'));
});

gulp.task('default', ['hint'], function () {
	gulp.watch('*.js', ['hint']).on('change', function () {
		console.log('\n------------------\n');
		console.log('[' + new Date().toLocaleTimeString() + ']\n');
	});
});
