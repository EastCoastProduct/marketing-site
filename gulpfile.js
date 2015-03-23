'use strict';

var fs          = require('fs'),
    gulp        = require('gulp'),
    concat      = require('gulp-concat'),
    copy        = require('gulp-copy'),
    filter      = require('gulp-filter'),
    gzip        = require('gulp-gzip'),
    htmlreplace = require('gulp-html-replace'),
    minifyCSS   = require('gulp-minify-css'),
    s3          = require('gulp-s3'),
    sass        = require('gulp-sass'),
    uglify      = require('gulp-uglify');

var options = {
  headers: {'Cache-Control': 'max-age=315360000, no-transform, public'},
  gzippedOnly: true
};

var aws = JSON.parse(fs.readFileSync('./aws.json'));

gulp.task('copy-images', function(){
  return gulp.src(['./src/assets/**/*.{png,gif,jpg}'])
    .pipe(copy('./dist/assets', {prefix: 2}));
});

gulp.task('build-html', function(){
  return gulp.src('./src/index.html')
    .pipe(htmlreplace({
      'js': 'js/bundle.min.js',
      'css': 'styles/main.min.css'
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('compress-style', function(){
  var scssFilter = filter('**/*.scss');
  return gulp.src(['./src/styles/vendor/**/*.css', './src/styles/**/*.scss'])
    .pipe(scssFilter)
    .pipe(sass())
    .pipe(scssFilter.restore())
    .pipe(concat('main.min.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./dist/styles'));
});

gulp.task('compress-js', function(){
  return gulp.src(['./src/js/jquery.min.js',
    './src/js/wow.min.js',
    './src/js/init.js',
    './src/js/scripts.js' ])
    .pipe(concat('bundle.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
})

gulp.task('build', [
  'copy-images',
  'build-html',
  'compress-style',
  'compress-js'
]);

gulp.task('publish', function(){
  return gulp.src('./dist/**')
    .pipe(gzip())
    .pipe(s3(aws, options));
});
