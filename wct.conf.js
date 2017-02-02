module.exports = {
    suites: ['test/wct_runner.html'],
    testTimeout: 5 * 60 * 1000,
    plugins: {
        local: {
            "browsers": ["chrome", "firefox"] //safari not working
        },
        sauce: {
            browsers: require('./sauce.launchers.js').browsers,
            testName: 'dolphin-platform-polymer Unit Tests'
        }
        ,
        istanbul: {
            dir: "./coverage",
            reporters: ["text-summary", "lcovonly"],
            include: [
                "./test/**/*.js"
            ],
            exclude: []
        }
    }
};
