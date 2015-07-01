// Browsers to run on Sauce Labs

var daily = {
    sl_win7_ie9: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 7',
        version: '9.0'
    },
    sl_win7_ie10: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 7',
        version: '10.0'
    },
    sl_win7_ie11: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 7',
        version: '11.0'
    },
    sl_win8_0_ie10: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 8',
        version: '10.0'
    },
    sl_win8_1_ie11: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 8.1',
        version: '11.0'
    },
    sl_ipad_8_2: {
        base: 'SauceLabs',
        browserName: 'Safari',
        appiumVersion: '1.4.3',
        deviceName: 'iPad Simulator',
        deviceOrientation: 'portrait',
        platformName: 'iOS',
        platformVersion: '8.2'
    }
};

var weekly = {
    sl_winXP_chrome: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'Windows XP',
        version: '43.0'
    },
    sl_winXP_firefox: {
        base: 'SauceLabs',
        browserName: 'firefox',
        platform: 'Windows XP',
        version: '38.0'
    },

    sl_win7_chrome: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'Windows 7',
        version: '43.0'
    },
    sl_win7_firefox: {
        base: 'SauceLabs',
        browserName: 'firefox',
        platform: 'Windows 7',
        version: '38.0'
    },

    sl_win8_0_chrome: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'Windows 8',
        version: '43.0'
    },
    sl_win8_0_firefox: {
        base: 'SauceLabs',
        browserName: 'firefox',
        platform: 'Windows 8',
        version: '38.0'
    },

    sl_win8_1_chrome: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'Windows 8.1',
        version: '43.0'
    },
    sl_win8_1_firefox: {
        base: 'SauceLabs',
        browserName: 'firefox',
        platform: 'Windows 8.1',
        version: '38.0'
    },

    sl_mac10_chrome: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'OSX 10.10',
        version: '43.0'
    },
    sl_mac10_firefox: {
        base: 'SauceLabs',
        browserName: 'firefox',
        platform: 'OSX 10.10',
        version: '38.0'
    },
    sl_mac10_safari: {
        base: 'SauceLabs',
        browserName: 'safari',
        platform: 'OS X 10.10',
        version: '8.0'
    },

    sl_linux_chrome: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'Linux',
        version: '43.0'
    },
    sl_linux_firefox: {
        base: 'SauceLabs',
        browserName: 'firefox',
        platform: 'Linux',
        version: '38.0'
    },
    sl_linux_opera: {
        base: 'SauceLabs',
        browserName: 'opera',
        platform: 'Linux',
        version: '12.15'
    },

    sl_ipad_8_1: {
        base: 'SauceLabs',
        browserName: 'Safari',
        appiumVersion: '1.4.3',
        deviceName: 'iPad Simulator',
        deviceOrientation: 'portrait',
        platformName: 'iOS',
        platformVersion: '8.1'
    },
    sl_ipad_8_0: {
        base: 'SauceLabs',
        browserName: 'Safari',
        appiumVersion: '1.4.3',
        deviceName: 'iPad Simulator',
        deviceOrientation: 'portrait',
        platformName: 'iOS',
        platformVersion: '8.0'
    },

    sl_android_5_1: {
        base: 'SauceLabs',
        browserName: 'Android',
        platform: 'Linux',
        version: '5.1',
        deviceName: 'Android Emulator',
        deviceOrientation: 'portrait'
    }
};



var manual = {
    sl_mac9_chrome: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'OSX 10.9',
        version: '43.0'
    },
    sl_mac9_firefox: {
        base: 'SauceLabs',
        browserName: 'firefox',
        platform: 'OSX 10.9',
        version: '38.0'
    },
    sl_mac9_safari: {
        base: 'SauceLabs',
        browserName: 'safari',
        platform: 'OS X 10.9',
        version: '7.0'
    },

    sl_ipad_7_1: {
        base: 'SauceLabs',
        browserName: 'Safari',
        appiumVersion: '1.4.3',
        deviceName: 'iPad Simulator',
        deviceOrientation: 'portrait',
        platformName: 'iOS',
        platformVersion: '7.1'
    },
    sl_ipad_7_0: {
        base: 'SauceLabs',
        browserName: 'Safari',
        appiumVersion: '1.4.3',
        deviceName: 'iPad Simulator',
        deviceOrientation: 'portrait',
        platformName: 'iOS',
        platformVersion: '7.0'
    },

    sl_android_5_0: {
        base: 'SauceLabs',
        browserName: 'Android',
        platform: 'Linux',
        version: '5.0',
        deviceName: 'Android Emulator',
        deviceOrientation: 'portrait'
    },
    sl_android_4_4: {
        base: 'SauceLabs',
        browserName: 'Android',
        platform: 'Linux',
        version: '4.4',
        deviceName: 'Android Emulator',
        deviceOrientation: 'portrait'
    }
};



exports.daily = daily;
exports.weekly = weekly;
exports.manual = manual;