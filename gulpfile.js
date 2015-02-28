'use strict';

var gulp = require('gulp'),
  s3 = require('gulp-s3'),
  gzip = require('gulp-gzip'),
  filter = require('gulp-filter'),
  copy = require('gulp-copy'),
  sass = require('gulp-sass'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  htmlreplace = require('gulp-html-replace'),
  fs = require('fs');

var options = {
  headers: {'Cache-Control': 'max-age=315360000, no-transform, public'},
  gzippedOnly: true
};

// var aws = JSON.parse(fs.readFileSync('./aws.json'));

gulp.task('copy-images', function(){
  return gulp.src(['./src/assets/**/*.{png,gif,jpg}'])
    .pipe(copy('./dist/assets', {prefix: 2}));
});

gulp.task('build-html', function(){
  return gulp.src('./src/index.html')
    .pipe(htmlreplace({
      'js': 'js/bundle.min.js'
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('copy-css-vendor', function(){
  return gulp.src('./src/styles/vendor/**/*.css')
    .pipe(copy('./dist/styles', {prefix: 2}));
});

gulp.task('sass', function(){
  return gulp.src(['./src/styles/**/*.scss'])
    .pipe(sass())
    .pipe(gulp.dest('./dist/styles'));
});

gulp.task('compress-js', function(){
  return gulp.src(['./src/js/jquery.min.js',
    './src/js/wow.min.js', 
    './src/js/init.js',
    './src/js/scripts.js' ])
    .pipe(concat('bundle.min.js'))
    // .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
})

gulp.task('build', [
  'copy-images',
  'build-html',
  'sass',
  'copy-css-vendor',
  'compress-js'
]);

gulp.task('publish', function(){
  return gulp.src('./dist/**')
    .pipe(gzip())
    .pipe(s3(aws, options));
});
