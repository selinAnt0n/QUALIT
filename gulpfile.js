var gulp = require('gulp'),
	sass = require('gulp-sass'),
	browSync = require('browser-sync'),
	imagemin = require('gulp-imagemin'),
	cssmin = require('gulp-cssmin'),
	concat = require('gulp-concat');

gulp.task('sass', function() {
	return gulp.src('app/sass/**/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('dist/css'))
		.pipe(browSync.reload({stream: true}))
});



gulp.task('jsBuild', function() {
  return gulp.src('app/js/components/**/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('static', function() {
  return gulp.src('app/js/*.js')
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('moveStatic', function() {
	gulp.src('app/img/**/*')
		.pipe(gulp.dest('dist/img'))
		.pipe(browSync.reload({stream: true}));

	gulp.src('app/*.html')
		.pipe(gulp.dest('dist/'))
		.pipe(browSync.reload({stream: true}));
});

gulp.task('sync', function() {
	browSync({
		server:{
			baseDir: 'dist'
		},
		notify: false
	});
});

gulp.task('watch', ['sync', 'sass', 'moveStatic', 'jsBuild', 'static'], function() {
	gulp.watch('app/sass/**/*.scss' , ['sass']);
	gulp.watch('app/*.html', ['moveStatic', browSync.reload]);
	gulp.watch('app/js/components/**/*.js', ['jsBuild']);
	gulp.watch('app/js/*.js', ['static']);
});

gulp.task('build', ['jsBuild', 'static'] ,function () {
	gulp.src('app/sass/**/*.scss')
		.pipe(sass())
		.pipe(cssmin())
		.pipe(gulp.dest('dist/css'));

	gulp.src('app/img/**/*.*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/img'));

	gulp.src('app/*.html')
		.pipe(gulp.dest('dist/'));
});
