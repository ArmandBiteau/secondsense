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

		'src/server/**'

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

	serverEntry: './src/server/index.js',
	serverDest: './server',

	cssEntry: 'src/media/scss/**/*.scss',
	cssDest: 'public/media/css',
	cssBase: 'src',

	lintEntry: [
		'src/media/js/**/*.js',
		'src/server.js'
	],
	remapifyEntry: 'src/media/js'

};
