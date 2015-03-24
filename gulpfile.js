'use strict';

var del          = require('del'),
    fs           = require('fs'),
    gulp         = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    cssmin       = require('gulp-cssmin'),
    filter       = require('gulp-filter'),
    gzip         = require('gulp-gzip'),
    rev          = require('gulp-rev'),
    revReplace   = require('gulp-rev-replace'),
    s3           = require('gulp-s3'),
    sass         = require('gulp-sass'),
    uglify       = require('gulp-uglify'),
    useref       = require('gulp-useref'),
    gutil        = require('gulp-util');

var options = {
  headers: {'Cache-Control': 'max-age=315360000, no-transform, public'},
  gzippedOnly: true
};

var aws = JSON.parse(fs.readFileSync('./aws.json'));

gulp.task('copy-images', ['clean'], function(){
  return gulp.src(['./src/assets/**/*.{png,gif,jpg}'])
    .pipe(gulp.dest('./dist/assets', {prefix: 2}));
});

gulp.task('build-html', ['clean', 'styles'], function(){
  var jsFilter = filter('**/*.js');
  var cssFilter = filter('**/*.css');

  var userefAssets = useref.assets();

  return gulp.src("./src/index.html")
    .pipe(userefAssets)             // Concatenate with gulp-useref
    .pipe(jsFilter)
    .pipe(uglify())                 // Minify any javascript sources
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe(cssmin())                 // Minify any CSS sources
    .pipe(cssFilter.restore())
    .pipe(rev())                    // Rename the concatenated files
    .pipe(userefAssets.restore())
    .pipe(useref())
    .pipe(revReplace())             // Substitute in new filenames
    .pipe(gulp.dest('./dist'));
});

gulp.task('styles', function() {
  return gulp.src('./src/styles/**/*.scss')
    .pipe(sass({
      onError: function(error) {
        gutil.log(gutil.colors.red(error));
        gutil.beep();
      },
      onSuccess: function() {
        gutil.log(gutil.colors.green('Sass styles compiled successfully.'));
      }
    }))
    .pipe(autoprefixer('last 2 versions', 'ie >= 8'))
    .pipe(gulp.dest('./src/styles'));
});

gulp.task('clean', function(cb) {
  del(['dist/**'], cb);
});

gulp.task('build', [
  'clean',
  'copy-images',
  'build-html'
]);

gulp.task('publish', function(){
  return gulp.src('./dist/**')
    .pipe(gzip())
    .pipe(s3(aws, options));
});
