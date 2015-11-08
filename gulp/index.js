var fs = require('fs');
var	tasks = fs.readdirSync('./gulp/tasks');

tasks.forEach(function(task) {
	if (task === '.DS_Store') return;

	require('./tasks/' + task);
});
