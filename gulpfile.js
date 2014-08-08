var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var htmlmin = require('gulp-htmlmin');
//var zip = require('gulp-zip');
var jade = require('gulp-jade');
//var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');
var autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    clean = require('gulp-clean'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache');



var paths = {scripts: ['app/js/**/*.js','app/js/*.js'],
			 images: ['app/img/*'],
			 html: ['app/views/**/*.html','app/views/*.html','app/*.html'],
			 css: ['app/css/*.css'],
			 jade: ['app/views/**/*.jade','app/views/*.jade','app/index.jade'],
			 compile: ['app/resources/.js','./web.js','app/build/**']};

gulp.task('lint', function () {
	return gulp.src('scripts.paths')
			.pipe(jshint())
			.pipe(jshint.reporter('default'));
});

gulp.task('scripts',function() {
	return gulp.src(paths.scripts)
			//.pipe(sourcemaps.init())
			.pipe(concat('all.js'))
			//.pipe(gulp.dest('app/build/js'))
			.pipe(rename('all.min.js'))
			//.pipe(uglify())
			//.pipe(sourcemaps.write('maps'))
			//.pipe(zip('archive.zip'))
			.pipe(gulp.dest('app/build/js'));
});

gulp.task('styles', function() {
  return gulp.src(paths.css)
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('app/build/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('app/build/css'));
});

// Copy all static images
gulp.task('images', function() {
  return gulp.src(paths.images)
    // Pass in options to the task
    .pipe(cache(imagemin({optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('app/build/img'));
});



gulp.task('htmlmin', function() {
  gulp.src(paths.jade)
  	.pipe(jade({}))
  	.pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('app/build/html'));
});

gulp.task('clean', function() {
  return gulp.src(['app/build/js','app/build/html','app/build/css','app/build/img'], {read: false})
    .pipe(clean());
});

gulp.task('watch',function() {
	gulp.watch(paths.scripts,['lint','scripts']);
	gulp.watch(paths.jade,['htmlmin']);
	gulp.watch(paths.css,['styles']);
	gulp.watch(paths.images,['images']);

	//var server = livereload();

	// gulp.watch(paths.compile, function(file) {
 //        server.changed(file.path);
 //    });
});

//run app using nodemon
gulp.task('serve',['default'], function(){
  return nodemon({script: 'web.js'})
			.on('restart',function () {
				console.log("Restarted");
			});
});


gulp.task('default',['clean'], function() {
	gulp.start(['styles','lint','scripts','watch','images','htmlmin']);
});
