"use strict";

var browserify = require('browserify');
var del = require('del');
var glob = require('glob');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var karma = require('gulp-karma');
var assign = require('lodash.assign');
var merge = require('merge-stream');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var watchify = require('watchify');

gulp.task('clean', function() {
    del(['dist']);
});

gulp.task('lint', function() {
    return gulp.src(['./src/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


var testBundler = browserify(assign({}, watchify.args, {
    entries: glob.sync('./test/src/**/test-*.js'),
    debug: true
}));

function rebundleTest(bundler) {
    return bundler
        .bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('test-bundle.js'))
        .pipe(gulp.dest('./test/build'))
}

gulp.task('build-test', function() {
    return rebundleTest(testBundler);
});

gulp.task('test', ['build-test'], function() {
    // Be sure to return the stream
    return gulp.src([])
        .pipe(karma({
            configFile: 'karma.conf.js'
        }))
        .on('error', function(err) {
            gutil.log.bind(gutil, 'Karma Error', err);
        });
});

gulp.task('verify', ['lint', 'test']);



var mainBundler = browserify(assign({}, watchify.args, {
    entries: './src/dolphin-polymer-api.js',
    standalone: 'dolphin',
    debug: true
}));

function rebundle(bundler) {
    return bundler
        .on('prebundle', function(bundle) {
            bundle.external('./polyfills.js');
        })
        .bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('dolphin-polymer.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(buffer())
        .pipe(rename({extname: '.min.js'}))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist'));
}

gulp.task('build', function() {
    return rebundle(mainBundler);
});



gulp.task('watch', function() {
    gulp.watch(['src/**', 'test/**'], ['build-test']);

    var watchedMainBundler = watchify(mainBundler);
    watchedMainBundler.on('update', function() {rebundle(watchedMainBundler)});

    var watchedTestBundler = watchify(testBundler);
    watchedTestBundler.on('update', function() {rebundle(watchedTestBundler)});
});

gulp.task('default', ['build-test', 'build', 'watch']);


function createSauceLabsTestPipe(customLaunchers) {
    // We cannot run too many instances at Sauce Labs in parallel, thus we need to run it several times
    // with only a few environments set
    var numSauceLabsVMs = 3;
    var allBrowsers = Object.keys(customLaunchers);
    var testPipe = gulp.src([]);
    while (allBrowsers.length > 0) {
        var browsers = [];
        for (var i=0; i<numSauceLabsVMs && allBrowsers.length > 0; i++) {
            browsers.push(allBrowsers.shift());
        }
        testPipe = testPipe
            .pipe(karma({
                configFile: 'karma.conf.js',
                customLaunchers: customLaunchers,
                browsers: browsers,
                reporters: ['saucelabs', 'teamcity']
            }))
    }

    return merge(
        gulp.src(['./src/**/*.js', '!./src/polyfills.js'])
            .pipe(jshint())
            .pipe(jshint.reporter('jshint-teamcity')),
        testPipe.on('error', function(err) {
            gutil.log.bind(gutil, 'Karma Error', err);
        })
    );
}

gulp.task('ci:nightly', ['build', 'build-test'], function() {
    var customLaunchers = require('./sauce.launchers.js').daily;
    return createSauceLabsTestPipe(customLaunchers);
});

gulp.task('ci:weekly', ['build', 'build-test'], function() {
    var customLaunchers = require('./sauce.launchers.js').weekly;
    return createSauceLabsTestPipe(customLaunchers);
});

gulp.task('ci:manual', ['build', 'build-test'], function() {
    var customLaunchers = require('./sauce.launchers.js').manual;
    return createSauceLabsTestPipe(customLaunchers);
});
