const {URLS, SELECTORS} = require('../constants.js')

class ServersPageObject {
    page;

    constructor() {}

    async goToServersRack() {
        await this.goToUrl(URLS.serversRack);
    }

    async goToServersTower() {
        await this.goToUrl(URLS.serversTower);
    }

    async goToServersRackAndFilter() {
        await this.goToServersRack();
        await this.filterServers()
    }

    async goToServersTowerAndFilter() {
        await this.goToServersTower();
        await this.filterServers()
    }

    async filterServers() {
        await this.page.click(SELECTORS.checkboxDellServers);
        await this.waitForAllAjax();
        await this.page.click(SELECTORS.checkboxHPServers);
        await this.waitForAllAjax();
    }
}

module.exports = ServersPageObject;