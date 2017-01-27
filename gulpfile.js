
const gulp = require('gulp');
const jasmineBrowser = require('gulp-jasmine-browser');
const browserSync = require('browser-sync').create();
const eslint = require('gulp-eslint');

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
    port: 8080
  });
});


gulp.task('watch', () => {
  gulp.watch('/src/styles/*.css', browserSync.reload);
  gulp.watch('/index.html', browserSync.reload);
  gulp.watch('/src/inverted-index.js', browserSync.reload);
});

gulp.task('jasmine', () => {
  gulp.src(['src/**/*.js', 'spec/**/*_spec.js'])
    .pipe(jasmineBrowser.specRunner())
    .pipe(jasmineBrowser.server({ port: 8888 }));
});

gulp.task('default', ['browserSync', 'eslint', 'jasmine']);
