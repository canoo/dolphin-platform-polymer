module.exports = {
    "suites": ['test/wct_runner.html'],
    "testTimeout": 5 * 60 * 1000,
    "plugins": {
        "local": {
            "browsers": ["chrome", "firefox"]
        },
        "sauce": {
            disabled: true,
            browsers: require('./sauce.launchers.js').browsers
        }
    }
};
