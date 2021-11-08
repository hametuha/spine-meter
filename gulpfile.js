const gulp = require( 'gulp' );
const $ = require( 'gulp-load-plugins' )();
const webpack = require( 'webpack-stream' );
const webpackBundle = require( 'webpack' );
const named = require( 'vinyl-named' );

let plumber = true;

// Package jsx.
gulp.task( 'jsx', function () {
	return gulp.src( [
		'./public.js',
	] )
		.pipe( $.plumber( {
			errorHandler: $.notify.onError( '<%= error.message %>' )
		} ) )
		.pipe( named( (file) =>  {
			return file.relative.replace(/\.[^\.]+$/, '');
		} ) )
		.pipe( webpack( require( './webpack.config.js' ), webpackBundle ) )
		.pipe( gulp.dest( './docs/js' ) );
} );

// ESLint
gulp.task( 'eslint', function () {
	let task = gulp.src( [
		'./*.js',
	] );
	if ( plumber ) {
		task = task.pipe( $.plumber() );
	}
	return task.pipe( $.eslint( { useEslintrc: true } ) )
		.pipe( $.eslint.format() );
} );

// watch
gulp.task( 'watch', function () {
	// Bundle JS
	gulp.watch( [ './*.{js,jsx}' ], gulp.parallel( 'jsx', 'eslint' ) );
} );

// Toggle plumber.
gulp.task( 'noplumber', ( done ) => {
	plumber = false;
	done();
} );

// Build
gulp.task( 'build', gulp.parallel( 'jsx' ) );

// Default Tasks
gulp.task( 'default', gulp.series( 'watch' ) );

// Lint
gulp.task( 'lint', gulp.series( 'noplumber', gulp.parallel( 'eslint' ) ) );
