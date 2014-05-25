var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    filesize = require('gulp-filesize'),
    gutil = require('gulp-util'),
    sass = require('gulp-ruby-sass'),
    minifycss = require('gulp-minify-css'),
    notify = require('gulp-notify');

var paths = {
      sass: 'assets/sass',
      css: 'assets/css',
      js: 'assets/js',
      temp: '.tmp'
};

// gulp.task('coffee', function () {
//   return gulp.src([
//       'assets/coffee/*.coffee'
//     ])
//     .pipe(plumber())
//     .pipe(coffee())
//     .pipe(gulp.dest('js'))
//     .on('error', gutil.log)
// });

gulp.task('js-vendor', function () {
  return gulp.src([
    'assets/js/vendor/*'
  ])
  .pipe(concat('vendor.js'))
  .pipe(uglify())
  .pipe(rename({ suffix: '.min' }))
  .pipe(gulp.dest('assets/js'))
  .pipe(filesize())
  .on('error', gutil.log)
});

gulp.task('styles', function () {
  var options = {
    trace: true,
    style: 'compact',
    compass: true
    // sourcemap: true
  };
  return gulp.src('assets/sass/*.sass')
    .pipe(sass(options))
    .on('error', gutil.log)
    .pipe(gulp.dest('assets/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('assets/css'))
    .on('error', gutil.log)
});

gulp.task('styles:dist', function () {
  var options = {
    trace: true,
    style: 'compressed',
    compass: true
  };
  return gulp.src('assets/sass/*.sass')
    .pipe(sass(options))
    .pipe(gulp.dest('assets/css'))
    .pipe(minifycss())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('assets/css'))
    .on('error', gutil.log)
});


gulp.task('js-all', ['js-vendor']);

// gulp.task('server', function(next) {
//   var connect = require('connect'),
//       server = connect();
//   server.use(connect.static('../../../')).listen(process.env.PORT || 35729, next);
// });

gulp.task('watch', function () {
  var path = require('path');
    //   livereload = require('gulp-livereload')();

  gulp.watch('assets/coffee/**/*.coffee', ['js-all']);
  gulp.watch('assets/sass/**/*.sass', ['styles']);
  gulp.watch([
    'assets/js/*.min.js',
    'assets/css/*.css'], function (file) {
      var relPath = path.relative('./', file.path);
      gutil.log('File Changed: ' + gutil.colors.magenta(relPath));
    //   livereload.changed(file.path);
  });

});

gulp.task('default', ['watch']);
gulp.task('build', ['styles:dist', 'js-all']);
