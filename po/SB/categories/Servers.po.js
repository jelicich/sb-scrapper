const {URLS, SELECTORS} = require('../../../constants.js')

class ServersPageObject {
    page;

    constructor() {}

    async goToServersRack() {
        logger.log('info', 'ServersPageObject.goToServersRack');
        await this.goToUrl(URLS.serversRack);
    }

    async goToServersTower() {
        logger.log('info', 'ServersPageObject.goToServersTower');
        await this.goToUrl(URLS.serversTower);
    }

    async goToServersRackAndFilter() {
        logger.log('info', 'ServersPageObject.goToServersRackAndFilter');
        await this.goToServersRack();
        await this.filterServers()
    }

    async goToServersTowerAndFilter() {
        logger.log('info', 'ServersPageObject.goToServersTowerAndFilter');
        await this.goToServersTower();
        await this.filterServers()
    }

    async filterServers() {
        logger.log('info', 'ServersPageObject.filterServers');
        await this.page.click(SELECTORS.checkboxDellServers);
        await this.waitForAllAjax();
        await this.page.click(SELECTORS.checkboxHPServers);
        await this.waitForAllAjax();
    }
}

module.exports = ServersPageObject;