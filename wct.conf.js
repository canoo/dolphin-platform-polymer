module.exports = {
    suites: ['test/wct_runner.html'],
    testTimeout: 5 * 60 * 1000,
    plugins: {
        local: {
            //Travis does not support safari - Safari currently requires manual steps to enable automation
            //To run locally add "safari" and run the test with gulp wct:local
            "browsers": ["chrome", "firefox"]
        },
        sauce: {
            browsers: require('./sauce.launchers.js').browsers,
            testName: 'dolphin-platform-polymer Unit Tests'
        }
        ,
        istanbul: {
            dir: "./coverage",
            reporters: ["text-summary", "lcov"],
            include: [
                '/test/**/*.js'
            ],
            exclude: []
        }
    }
};
