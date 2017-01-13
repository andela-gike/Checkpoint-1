var gulp = require('gulp');
var browserSync = require('browser-sync').create();

gulp.task('default', ['style'], function() {
   // watch for CSS changes
   gulp.watch('src/style/*.css', function() {
      // run styles upon changes
      gulp.run('style');
   });
});