/* jshint node:true */
'use strict';
// generated on 2015-01-15 using generator-gulp-webapp 0.2.0
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('styles', function() {
  return gulp.src('app/styles/main.scss')
    .pipe($.plumber())
    .pipe($.sass()) 
    .pipe($.autoprefixer({browsers: ['last 1 version']}))
    .pipe(gulp.dest('.tmp/styles'));
});

gulp.task('jst', function () {
  return gulp.src('./app/scripts/**/*.jst.ejs')
    .pipe($.jstConcat('compiled-templates.js', {
      renameKeys: ['^.*\/app\/scripts\/(.*).jst.ejs$', '$1']
    }))
    .pipe(gulp.dest('./app/scripts'));
});

gulp.task('jshint', function () {
  return gulp.src(['app/scripts/**/*.js', '!app/scripts/compiled-templates.js'])
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});

gulp.task('html', ['styles'], function () {
  var lazypipe = require('lazypipe');
  var cssChannel = lazypipe()
    .pipe($.csso)
    .pipe($.replace, 'bower_components/bootstrap-sass-official/assets/fonts/bootstrap','fonts');
  var assets = $.useref.assets({searchPath: '{.tmp,app}'});

  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', cssChannel()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function () {
  return gulp.src(require('main-bower-files')().concat('app/fonts/**/*'))
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', function () {
  return gulp.src([
    'app/*.*',
    '!app/*.html',
    'node_modules/apache-server-configs/dist/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

gulp.task('connect', ['styles'], function () {
  var serveStatic = require('serve-static');
  var serveIndex = require('serve-index');
  var app = require('connect')()
    .use(require('connect-livereload')({port: 35729}))
    .use(serveStatic('.tmp'))
    .use(serveStatic('app'))
    // paths to bower_components should be relative to the current file
    // e.g. in app/index.html you should use ../bower_components
    .use('/bower_components', serveStatic('bower_components'))
    .use(serveIndex('app'));

  require('http').createServer(app)
    .listen(9000)
    .on('listening', function () {
      console.log('Started connect web server on http://localhost:9000');
    });
});

gulp.task('serve', ['connect', 'watch'], function () {
  require('opn')('http://localhost:9000');
});

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('app/styles/*.scss')
    .pipe(wiredep())
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/*.html')
    .pipe(wiredep({exclude: ['bootstrap-sass-official']}))
    .pipe(gulp.dest('app'));
});

gulp.task('watch', ['connect'], function () {
  $.livereload.listen();

  // watch for changes
  gulp.watch([
    'app/*.html',
    '.tmp/styles/**/*.css',
    'app/scripts/**/*.js',
    'app/images/**/*'
  ]).on('change', $.livereload.changed);

  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('app/**/*.jst.ejs', ['jst']);
  gulp.watch('bower.json', ['wiredep']);
  gulp.watch(['app/scripts/**/*.js', 'test/spec/**/*.spec.js'], ['jshint', 'test']);
});

gulp.task('build', ['jshint', 'test', 'html', 'styles', 'jst', 'images', 'fonts', 'extras'], function () {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});

gulp.task('deploy', [ 'build' ], function () {
  return gulp.src('dist/**/*')
    .pipe($.ghPages());
});

var deps = [
  'bower_components/jquery/dist/jquery.js',
  'bower_components/underscore/underscore.js',
  'bower_components/backbone/backbone.js',
  'bower_components/backbone.babysitter/lib/backbone.babysitter.js',
  'bower_components/backbone.wreqr/lib/backbone.wreqr.js',
  'bower_components/marionette/lib/core/backbone.marionette.js',
  'bower_components/backbone-fetch-cache/backbone.fetch-cache.js',
  'bower_components/moment/moment.js',
  'test/lib/init.js',
  'app/scripts/app.js',
  'app/scripts/utils/mapmanager.js',
  'app/scripts/base/search-view.js',
  'app/scripts/entities/search-model.js',
  'app/scripts/app-config.js',
  'app/scripts/compiled-templates.js',
  'app/scripts/header-search-view.js',
  'app/scripts/app-layout.js',
  'app/scripts/home/home-view.js',
  'app/scripts/home/home-controller.js',
  'app/scripts/home/home-module.js',
  'app/scripts/entities/dataset-model.js',
  'app/scripts/entities/dataset-collection.js',
  'app/scripts/results/results-view.js',
  'app/scripts/results/results-controller.js',
  'app/scripts/results/results-module.js',
  'app/scripts/datasets/datasets-view.js',
  'app/scripts/datasets/datasets-controller.js',
  'app/scripts/datasets/datasets-module.js',
];

gulp.task('test', function () {
  return gulp.src('test/spec/**/*.spec.js')
    .pipe($.jasminePhantom({
      integration: true,
      vendor: deps,
      keepRunner: 'test/'
    }));
});
