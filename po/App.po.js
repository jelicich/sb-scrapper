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
        logger.log('info', 'AppPageObject.openBrowser');
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
        logger.log('info', 'AppPageObject.openNewTab');
        this.page = await this.browser.newPage();
        this.page.setDefaultTimeout(5 * 60 * 1000); // wait for slow network
        this.pendingXHR = new PendingXHR(this.page);
        logger.log('info', 'Opened tab');
    }

    async goToUrl(url) {
        logger.log('info', 'AppPageObject.goToUrl ' + url);
        await this.page.goto(url, {waitUntil: 'networkidle2'});
    }

    async waitForAllAjax() {
        logger.log('info', 'AppPageObject.waitForallAjax');
        await this.pendingXHR.waitForAllXhrFinished();
    }

    closeBrowser() {
        logger.log('info', 'AppPageObject.closeBrowser');
        return this.browser.close();
    }
}

module.exports = AppPageObject;