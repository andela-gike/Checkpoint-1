const eslint = require('gulp-eslint');
const gulp = require('gulp');
const jasmineBrowser = require('gulp-jasmine-browser');
const browserify = require('browserify');
const browserSync = require('browser-sync').create();
const browserSpec = require('browser-sync').create();
const source = require('vinyl-source-stream');


gulp.task('eslint', () => {
  gulp.src(['./src/*.js', 'jasmine/lib/spec/inverted-index-test.js'])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: './',
      index: 'index.html',
    },
    port: process.env.PORT || 8080,
    ui: false,
    ghostMode: false
  });
});


gulp.task('watch', () => {
  gulp.watch('./src/styles/*.css', browserSync.reload);
  gulp.watch('index.html', browserSync.reload);
  gulp.watch('./src/inverted-index.js', browserSync.reload);
  gulp.watch('jasmine/spec/inverted-index-test.js', browserSync.reload);
});

gulp.task('jasmine', () => {
  gulp.src(['src/inverted-index.js', 'jasmine/spec/inverted-index-test.js'])
    .pipe(jasmineBrowser.specRunner())
    .pipe(jasmineBrowser.server({
      port: 8880
    }));
});

gulp.task('browserSpec', () => {
  browserSync.init({
    server: {
      baseDir: ['./'],
      index: 'spec.html'
    },
    port: 8888,
    ui: false,
    ghostMode: false
  });
});


gulp.task('browserify', () =>
   browserify('jasmine/spec/inverted-index-test.js')
    .bundle()
    .pipe(source('index-test-spec1.js'))
    .pipe(gulp.dest('./jasmine/spec/tests'))
);

gulp.task('default', ['browserSync', 'jasmine', 'watch']);
