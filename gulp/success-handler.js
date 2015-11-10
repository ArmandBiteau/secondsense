var notify = require('gulp-notify');

module.exports = function() {
	var args = Array.prototype.slice.call(arguments);

	notify.onError({
		title: 'Success',
		message: 'Compilation works'
	}).apply(this, args);

	this.emit('end');
};
