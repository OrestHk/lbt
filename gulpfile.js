/* Require */
var gulp          = require('gulp');
var nano          = require('gulp-cssnano')
var sass          = require('gulp-sass');
var concat        = require('gulp-concat');
var uglify        = require('gulp-uglify');
var autoprefixer  = require('gulp-autoprefixer');
/* End require */

/* Paths */
var paths = {
  sass: {
    source: './assets/css/sass/',
    dist: './assets/css/'
  },
  css: {
    source: './assets/css/',
    dist: './www/css/'
  },
  js: {
    source: {
      libs: './assets/js/libs/',
      scripts: [
        './assets/js/modules/*.js',
        './assets/js/*.js'
      ]
    },
    dest: './www/js/'
  }
};
/* End paths */

/* Tasks */
// SASS
gulp.task('sass', function(){
  return gulp.src(paths.sass.source+'*.+(sass|scss)')
    .pipe(sass())
    .pipe(gulp.dest(paths.sass.dist));
});
// CSS
gulp.task('css', ['sass'], function(){
  return gulp.src(paths.css.source+'*.css')
    .pipe(autoprefixer(['> 0.2%']))
    .pipe(nano())
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest(paths.css.dist));
});
// JS libs
gulp.task('jsLibs', function(){
  return gulp.src(paths.js.source.libs+'*.js')
    .pipe(uglify())
    .pipe(concat('libs.min.js'))
    .pipe(gulp.dest(paths.js.dest));
});
// JS
gulp.task('jsScripts', function(){
  return gulp.src(paths.js.source.scripts)
    //.pipe(uglify())
    .pipe(concat('script.min.js'))
    .pipe(gulp.dest(paths.js.dest));
});
/* End tasks */

/* Watchers */
gulp.task('sass-watch', function(){
  gulp.watch(paths.css.source+'**/*.+(sass|scss|css)', ['css']);
});
gulp.task('js-watch', function(){
  gulp.watch(paths.js.source.libs+'*.js', ['jsLibs']);
  gulp.watch(paths.js.source.scripts, ['jsScripts']);
});
gulp.task('watch', function(){
  gulp.watch(paths.js.source.libs+'*.js', ['jsLibs']);
  gulp.watch(paths.js.source.scripts, ['jsScripts']);
  gulp.watch(paths.css.source+'**/*.+(sass|scss|css)', ['css']);
});
/* End watchers */
