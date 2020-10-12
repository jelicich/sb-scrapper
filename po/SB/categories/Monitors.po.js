const {URLS, SELECTORS} = require('../../../constants.js')

class MonitorsPageObject {
    constructor() {}

    async goToMonitors() {
        logger.log('info', 'MonitorsPageObject.goToMonitors');
        await this.goToUrl(URLS.notebooks);
    }
}

module.exports = MonitorsPageObject;