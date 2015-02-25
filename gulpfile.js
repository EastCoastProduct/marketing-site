'use strict';

var gulp = require('gulp'),
  s3 = require('gulp-s3'),
  gzip = require('gulp-gzip'),
  filter = require('gulp-filter'),
  fs = require('fs');

var options = {
  headers: {'Cache-Control': 'max-age=315360000, no-transform, public'},
  gzippedOnly: true
};

var aws = JSON.parse(fs.readFileSync('./aws.json'));

gulp.task('publish', function(){
  return gulp.src('./src/**')
    .pipe(gzip())
    .pipe(s3(aws, options));
});
