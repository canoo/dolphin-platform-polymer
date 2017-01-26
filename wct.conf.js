module.exports = {
    suites: ['test/wct_runner.html'],
    testTimeout: 5 * 60 * 1000,
    plugins: {
        local: {
            "browsers": ["chrome", "firefox"] //safari not working
        },
        sauce: {
            disabled: true,
            commandTimeout: 600,
            idleTimeout: 180,
            browsers: require('./sauce.launchers.js').browsers,
            testName: 'dolphin-platform-polymer Unit Tests',
            tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
            recordScreenshots: true,
            recordVideo: false,
            startConnect: false
        },
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
