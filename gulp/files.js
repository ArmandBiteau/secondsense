module.exports = {

	copyEntry: [
		'src/.htaccess',
		'src/index.html',
		'src/robots.txt',
		'src/humans.txt',
		'src/favicon/**',
		'src/media/img/**',
		'src/media/glsl/**',
		'src/media/data/**',
		'src/media/icons/**',
		'src/media/sounds/**',
		'src/media/fonts/**',
		'src/api/**',
	],

	delEntry: [
		'**/.DS_Store',
		'public/media',
		'npm-debug.log',
		'.sass-cache'
	],

	copyBase: 'src',
	copyDest: 'public',

	vendorsBase:'./src/media/vendors/*.js',
	vendorsDest: './public/media/js',
	vendorsConcat: 'vendors.bundle.js',

	browserifyEntry: './src/media/js/main.js',
	browserifyDest: 'public/media/js',

	browserifyServerEntry: './src/server/index.js',
	browserifyServerDest: 'server',

	cssEntry: 'src/media/scss/**/*.scss',
	cssDest: 'public/media/css',
	cssBase: 'src',

	lintAppEntry: 'src/media/js/**/*.js',
	lintServerEntry: 'src/server/**/*.js',
	lintApiEntry: 'src/api/**/*.php',

	remapifyEntry: 'src/media/js'

};
