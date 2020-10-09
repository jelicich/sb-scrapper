const {URLS, SELECTORS} = require('../constants.js')

class NotebooksPageObject {
    constructor() {}

    async goToMonitors() {
        await this.goToUrl(URLS.notebooks);
    }
}

module.exports = NotebooksPageObject;