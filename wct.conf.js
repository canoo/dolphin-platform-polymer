module.exports = {
    "suites": ['test/wct_runner.html'],
    "plugins": {
        "local": {
            "browsers": ["chrome", "firefox"]
        },
        "sauce": {
            browsers: require('./sauce.launchers.js').mustHave
        }
    }
};
