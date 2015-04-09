var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({lazy:false});
var runSequence = require('run-sequence');
var del = require('del');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');
var browserify = require('browserify');
gulp.task('clean', function(cb){
  'use strict';
  del(['build'], cb);
});


var bundler = watchify(browserify(watchify.args));
bundler.add('./app/main.jsx');
bundler.transform('babelify');
bundler.transform('reactify');
bundler.on('log', plugins.util.log); // output build logs to terminal
bundler.on('update', bundle); // on any dep update, runs the bundler

function bundle(){
  'use strict';
    return bundler.bundle()
      // log errors if they happen
      .on('error', plugins.util.log.bind(plugins.util, 'Browserify Error'))
      .pipe(source('bundle.js'))
      // optional, remove if you dont want sourcemaps
        .pipe(buffer())
        .pipe(plugins.sourcemaps.init({loadMaps: true})) // loads map from browserify file
        .pipe(plugins.sourcemaps.write('./')) // writes .map file
      .pipe(gulp.dest('./build'));
}
gulp.task('scripts', bundle);

// gulp.task('scripts-prod', function(){
  // 'use strict';
  // return compileScripts('prod');
// });

gulp.task('sass', function () {
  'use strict';
  return gulp.src('./app/**/*.scss')
  .pipe(plugins.sass())
  .pipe(plugins.concat('app.css'))
  .pipe(gulp.dest('./build'));
});

gulp.task('index', function () {
  'use strict';
  var target = gulp.src('./app/index.html');
  var sources = gulp.src(['./build/bundle.js']);
  return target.pipe(plugins.inject(sources))
  .pipe(gulp.dest('./build'));
});

gulp.task('copy-static-files', function() {
  'use strict';
  gulp.src(['./app/images/**', './app/fonts/**'], {'base': '.'})
  .pipe(gulp.dest('./build/'));
});

gulp.task('watch',function(){
  'use strict';
  gulp.watch([
    'build/**/*.html',
    'build/**/*.js',
    'build/**/*.css'
  ], function(event) {
    return gulp.src(event.path)
    .pipe(plugins.connect.reload());
  });
  gulp.watch('./app/index.html',['index']);
  //gulp.watch(['./bower_components/vcc-common/*.js'], ['vendorJS']);
  //gulp.watch(['./app/**/*.js','!./app/**/*test.js'],['scripts', 'index']);
  //gulp.watch(['!./app/index.html','./app/**/*.html'],['templates', 'index']);
  //gulp.watch(['./app/**/*.scss', './bower_components/**/*.css'],['sass', 'vendorCSS']);
});

console.log('connect: ', plugins.connect.server);
gulp.task('connect', function(){
  plugins.connect.server({
    root: ['build','.'],
    port: 9000,
    livereload: true
  });
});

gulp.task('default', [ 'scripts', 'connect', 'sass', 'index', 'watch']);
// gulp.task('default',function(callback){
//   'use strict';
//   runSequence('clean', 'scripts', ['connect','sass', 'index','watch'],callback);
// });

// gulp.task('build',function(callback){
//   'use strict';
//   runSequence('clean', 'scripts-prod','templates','sass','vendorJS-prod','vendorCSS', 'index-prod', 'copy-static-files', callback);
// });
