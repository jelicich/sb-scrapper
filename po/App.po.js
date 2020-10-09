const puppeteer = require('puppeteer');
const { PendingXHR } = require('pending-xhr-puppeteer');


const CREDENTIALS = {
    user: 'flodetti@shmit.com.ar',
    password: 'beta2231'
}

class AppPageObject {
    browser;
    page;
    pendingXHR;

    constructor() {};

    async openBrowser(options) {
        options = options || {};

        const defaults = {
            headless: false,
            slowMo: 30,
            devtools: true,
            defaultViewport: null,
            args: [
                '--window-size=1920,1040',
                '--no-sandbox'
            ]
        }

        const config = {...defaults, ...options}
        this.browser = await puppeteer.launch(config);
    }

    async openNewTab() {
        this.page = await this.browser.newPage();
        this.page.setDefaultTimeout(5 * 60 * 1000); // wait for slow network
        this.pendingXHR = new PendingXHR(this.page);
    }

    async goToUrl(url) {
        await this.page.goto(url, {waitUntil: 'networkidle2'});
    }

    async waitForAllAjax() {
        await this.pendingXHR.waitForAllXhrFinished();
    }
}

module.exports = AppPageObject;