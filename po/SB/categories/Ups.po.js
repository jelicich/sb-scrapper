const {URLS, SELECTORS} = require('../../../constants.js')

class UpsPageObject {
    page;

    constructor() {}

    async goToUps() {
        logger.log('info', 'UpsPageObject.goToUps');
        await this.goToUrl(URLS.ups);
    }
}

module.exports = UpsPageObject;