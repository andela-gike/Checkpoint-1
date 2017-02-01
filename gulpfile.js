const eslint = require('gulp-eslint');
const gulp = require('gulp');
const jasmineBrowser = require('gulp-jasmine-browser');
const browserSync = require('browser-sync').create();

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
      port: 8888
    }));
});

gulp.task('default', ['browserSync', 'jasmine', 'watch']);
