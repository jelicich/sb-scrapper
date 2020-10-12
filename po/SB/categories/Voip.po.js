const {URLS, SELECTORS} = require('../../../constants.js')

class VoipPageObject {
    page;

    constructor() {}

    async goToVoip() {
        logger.log('info', 'VoipPageObject.goToVoip');
        await this.goToUrl(URLS.voip);
    }

    async goToVoipAndFilter() {
        logger.log('info', 'VoipPageObject.goToVoipAndFilter');
        await this.goToVoip();
        await this.filterVoip();
    }

    async filterVoip() {
        logger.log('info', 'VoipPageObject.filterVoip');
        await this.page.click(SELECTORS.checkboxGrandstreamVoIP);
        await this.waitForAllAjax();
        await this.page.click(SELECTORS.checkboxCiscoSMBVoIP);
        await this.waitForAllAjax();
    }
}

module.exports = VoipPageObject;