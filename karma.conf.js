// Karma configuration
// Generated on Wed May 27 2015 21:40:46 GMT+0200 (CEST)

module.exports = function (config) {

    // Use ENV vars on TeamCity and sauce.json locally to get credentials
    if (!process.env.SAUCE_USERNAME) {
        if (!fs.existsSync('sauce.json')) {
            console.log('Create a sauce.json with your credentials based on the sauce-sample.json file.');
            process.exit(1);
        } else {
            process.env.SAUCE_USERNAME = require('./sauce').username;
            process.env.SAUCE_ACCESS_KEY = require('./sauce').accessKey;
        }
    }



    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha'],


        // list of files / patterns to load in the browser
        files: [
            { pattern: './bower_components/dolphin-js/dist/dolphin.min.js' },
            { pattern: './bower_components/webcomponentsjs/webcomponents.min.js', watched: false },
            { pattern: './bower_components/polymer/polymer*.html', included: false, watched: false },
            { pattern: './test/build/test-bundle.js', included: false },
            'test/karma_runner.html'
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_DEBUG,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,


        // Sauce Labs configuration
        sauceLabs: {
            testName: 'dolphin-js_polymer Unit Tests',
            recordScreenshots: false,
            recordVideo: false
        },
        captureTimeout: 120000,
        browserDisconnectTimeout: 10 * 1000,
        browserDisconnectTolerance: 3,
        browserNoActivityTimeout: 20 * 1000
    });
};
