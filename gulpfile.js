var gulp = require('gulp'),
	jade = require('gulp-jade'),
	sass = require('gulp-sass'),
	connect = require('gulp-connect'),
	clean = require('gulp-clean'),
	open = require('gulp-open'),
	runSequence = require('run-sequence');


var host = 'localhost';
var port = '80';

function swallowError(error){  
  console.log(error.toString());
  this.emit('end');
}

gulp.task('sass', function(){	
	return gulp.src("source/style/**/*.sass")
	.pipe(sass().on('error', swallowError))
	.pipe(gulp.dest("build/styles"))
	.pipe(connect.reload());	
});

gulp.task('jade', function(){	
	return gulp.src("source/view/**/*.jade")
	.pipe(jade({ pretty: true }).on('error', swallowError))
	.pipe(gulp.dest("build/"))
	.pipe(connect.reload());	
});

gulp.task('copy:script', function(){
	gulp.src('source/script/**/*').pipe(gulp.dest('build/script')).pipe(connect.reload());		
});

gulp.task('copy:lib', function(){
	gulp.src('source/lib/**/*').pipe(gulp.dest('build/lib')).pipe(connect.reload());	
});

gulp.task('copy', function(){
	gulp.start('copy:script', 'copy:lib');
});

gulp.task('connect', function(){
	connect.server({
		livereload: true,
		root: 'build',
		host: host,
		port: port		
	});
});

gulp.task('watch', function(){	
	gulp.watch('source/style/**/*.sass', ['sass']);
	gulp.watch('source/view/**/*.jade', ['jade']);	
	gulp.watch('source/script/**/*', ['copy:script']);	
	gulp.watch('source/lib/**/*', ['copy:lib']);	
});

gulp.task('open', function(){
	return gulp.src('').pipe(open({
		app: 'chrome',
		uri: 'http://' + host + ':' + port
	}))
});

gulp.task('clean', function(){
	return gulp.src('build', {read: false}).pipe(clean());
});

gulp.task('default', function(){
	runSequence('clean', 'connect', ['copy', 'sass', 'jade', 'watch'],'open');
	console.log('Success!');			
});