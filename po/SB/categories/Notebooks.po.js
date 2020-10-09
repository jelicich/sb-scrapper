const {URLS, SELECTORS} = require('../constants.js')

class NotebooksPageObject {
    page;

    constructor() {}

    async goToNotebooks() {
        await this.goToUrl(URLS.notebooks);
    }

    async goToNotebooksAndFilter() {
        await this.goToNotebooks();
        await this.page.click(SELECTORS.checkboxDellNotebooks);
        await this.waitForAllAjax();
        await this.page.click(SELECTORS.checkboxHPNotebooks);
        await this.waitForAllAjax();
    }
}

module.exports = NotebooksPageObject;