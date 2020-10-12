const AppPageObject = require('../App.po.js');
const {URLS, SELECTORS, CREDENTIALS} = require('../../constants.js');


class SHMPageObject extends AppPageObject{
    constructor() {
        super();
    }

    async goToAuthPage() {
        logger.log('info', 'SHMPageObject.goToAuthPage');
        await this.goToUrl(URLS.shm);
    }

    async login() {
        try {
            logger.log('info', 'SHMPageObject.login');
            await this.page.click(SELECTORS.SHM.usernameInput, {clickCount: 1});
            await this.page.type(SELECTORS.SHM.usernameInput, CREDENTIALS.SHM.username, {delay: 0});
            await this.page.click(SELECTORS.SHM.passwordInput, {clickCount: 1});
            await this.page.type(SELECTORS.SHM.passwordInput, CREDENTIALS.SHM.password, {delay: 0});
            await this.page.click(SELECTORS.SHM.loginButton);
            await this.page.waitForNavigation();
        } catch (error) {
            logger.log('error', 'SHMPageObject.login : ' + error);
            process.exit();
        }
    }

    async goToImporter() {
        logger.log('info', 'SHMPageObject.goToImporter');
        await this.goToUrl(URLS.importer);
    }

    async importNewProducts(filename) {
        const inputFile = await this.page.$(SELECTORS.SHM.inputFile);
        inputFile.uploadFile(fileToUpload);
        await this.page.click(SELECTORS.SHM.submitUploadFormButton);
        await this.waitForNavigation();   
        await this.page.click(SELECTORS.SHM.submitUploadFormButton);

        // TODO: 
        // see how to handle the upload process regarding the ajax calls and navigation
    }
}

module.exports = SHMPageObject;