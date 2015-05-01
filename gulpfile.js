var gulp = require('gulp');
var del = require('del');
var minify = require('gulp-minify');
var minifyCSS = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var wrap = require('gulp-wrap');
var header = require('gulp-header');
var replace = require('gulp-replace');
var minifyHTML = require('gulp-minify-html');

gulp.task('clean', function (cb) {
	del([
	     'temp',
	     'dist',
	   ], cb);
});

gulp.task('lint',function(){
	return gulp.src('src/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter('fail'));
}); // end lint

gulp.task('concat-js',['templates'],function(){
	return gulp.src(['src/**/*.js', '.tmp/template.js'])
		.pipe(concat('dialogs.js'))
		.pipe(wrap('(function(){\n\'use strict\';\n<%= contents %>\n})();'))
		.pipe(gulp.dest('.tmp'));
}); // end concat-js

gulp.task('compress-js',['concat-js'],function(){
	var bower = require('./bower.json');
	var banner = ['/**',
		' * <%= bower.name %> - <%= bower.description %>',
		' * @version v<%= bower.version %>',
		' * @author <%= bower.authors[0].name %>, <%= bower.authors[0].email %>',
		' * @license <%= bower.licenses[0].type %>, <%= bower.licenses[0].url %>',
		' */',
		''].join('\n');

	gulp.src(['.tmp/dialogs.js'])
		.pipe(header(banner, {bower : bower}))
		.pipe(minify({}))
		.pipe(gulp.dest('dist'));
			
}); // end comrpess-js

gulp.task('templates', ['clean'], function(){
	gulp.src(['src/views/template.html'])
	.pipe(replace(/\\/g, '\\\\'))
	.pipe(replace(/"/g, '\\"'))
	.pipe(replace(/[\r\n\t]/g, ''))
	.pipe(wrap('angular.module("DialogsModule").run(["$templateCache", function ($templateCache) {\r\n\t$templateCache.put("bower_components/angular-dialog/views/template.html", "<%= contents %>");\r\n}]);'))
	.pipe(rename(function (path) {
		path.extname=".js";
	}))
	.pipe(gulp.dest('.tmp'));
});

gulp.task('default',['clean', 'lint','compress-js']);
gulp.task('t',['clean', 'templates']);