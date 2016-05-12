module.exports = {
  "suites": ['test/wct_runner.html'],
  "plugins": {
    sauce: {
      disabled: true,
      browsers: [
        {
          platform: 'Windows 7',
          browserName: 'internet explorer',
          version: '10.0'
        },
        {
          platform: 'Windows 7',
          browserName: 'internet explorer',
          version: '11.0'
        },
        {
          platform: 'Windows 7',
          browserName: 'chrome'
        },
        {
          platform: 'Windows 7',
          browserName: 'firefox'
        },

        {
          platform: 'Windows 8',
          browserName: 'internet explorer',
          version: '10.0'
        },
        {
          platform: 'Windows 8',
          browserName: 'chrome'
        },
        {
          platform: 'Windows 8',
          browserName: 'firefox'
        },

        {
          platform: 'Windows 8.1',
          browserName: 'internet explorer',
          version: '11.0'
        },
        {
          platform: 'Windows 8.1',
          browserName: 'chrome'
        },
        {
          platform: 'Windows 8.1',
          browserName: 'firefox'
        },

        {
          platform: 'iOS',
          version: '8.4',
          device: 'iPad Simulator',
          browserName: 'Safari',
          deviceOrientation: 'landscape'
        }
      ]
    },
    'teamcity-reporter': true
  }
};
