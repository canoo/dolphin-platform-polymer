"use strict";

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var browserify = require('browserify');
var del = require('del');
var glob = require('glob');
var assign = require('lodash.assign');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var watchify = require('watchify');

// Load tasks for web-component-tester
// Adds tasks for `gulp test:local` and `gulp test:remote`
// require('web-component-tester').gulp.init(gulp, ['build-test']);
var test = require('web-component-tester').test;


gulp.task('clean', function() {
    del(['dist', 'test/build']);
});



gulp.task('lint', function() {
    return gulp.src(['./src/**/*.js'])
        .pipe($.jshint())
        .pipe($.jshint.reporter('default'))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('lint-tc', function() {
    return gulp.src(['./src/**/*.js', '!./src/polyfills.js'])
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-teamcity'));
});



var testBundler = browserify(assign({}, watchify.args, {
    entries: glob.sync('./test/src/**/test-*.js'),
    debug: true
}));

function rebundleTest(bundler) {
    return bundler
        .bundle()
        .on('error', $.util.log.bind($.util, 'Browserify Error'))
        .pipe(source('test-bundle.js'))
        .pipe(gulp.dest('./test/build'))
}

gulp.task('build-test', function() {
    return rebundleTest(testBundler);
});

// gulp.task('test', ['test:local']);

//add 'test' task when tests are fixed
gulp.task('verify', ['lint']);



var mainBundler = browserify(assign({}, watchify.args, {
    entries: './src/dolphin-polymer-api.js',
    debug: true
}));

function rebundle(bundler) {
    return bundler
        .on('prebundle', function(bundle) {
            bundle.external('./polyfills.js');
        })
        .bundle()
        .on('error', $.util.log.bind($.util, 'Browserify Error'))
        .pipe(source('dolphin-platform-polymer.js'))
        .pipe($.derequire())
        .pipe(gulp.dest('./dist'))
        .pipe(buffer())
        .pipe($.rename({extname: '.min.js'}))
        .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.uglify())
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest('./dist'));
}

gulp.task('build', function() {
    return rebundle(mainBundler);
});



//gulp.task('watch', function() {
//    gulp.watch(['src/**'], ['lint']);
//
//    var watchedMainBundler = watchify(mainBundler);
//    watchedMainBundler.on('update', function() {rebundle(watchedMainBundler)});
//
//    var watchedTestBundler = watchify(testBundler);
//    watchedTestBundler.on('update', function() {rebundle(watchedTestBundler)});
//});

gulp.task('default', ['verify', 'build']);



gulp.task('ci-common', ['build', 'build-test', 'lint-tc']);

gulp.task('ci', ['ci-common', 'test:local']);

function createSauceLabsTestStep(browsers, done) {
    return function(passedError) {
        test(
            { plugins: {
                local: false,
                sauce: { browsers: browsers }
            } },
            function(currentError) { done(passedError || currentError) }
        );
    }
}

function createSauceLabsTestPipe(allBrowsers, step) {
    // We cannot run too many instances at Sauce Labs in parallel, thus we need to run it several times
    // with only a few environments set
    var numSauceLabsVMs = 5;

    while (allBrowsers.length > 0) {
        var browsers = [];
        for (var i=0; i<numSauceLabsVMs && allBrowsers.length > 0; i++) {
            browsers.push(allBrowsers.shift());
        }

        step = createSauceLabsTestStep(browsers, step);
    }

    step();
}

gulp.task('testLocal', ['build-test'], function(done) {
    test({plugins: {local: {}, sauce: false}}, done);
});

gulp.task('saucelabs', function(done) {
    var browsers = require('./sauce.launchers.js').mustHave;
    return createSauceLabsTestPipe(browsers, done);
});