module.exports = {
  "suites": ['test/wct_runner.html'],
  "plugins": {
    sauce: {
      browsers:require('./sauce.launchers.js').mustHave
    }
  }
};
