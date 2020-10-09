const Many = require('extends-classes');
const AppPageObject = require('../App.po.js');
const NotebooksPageObject = require('./categories/Notebooks.po.js');
const MonitorsPageObject = require('./categories/Monitors.po');
const ServersPageObject = require('./categories/Servers.po.js');
const VoipPageObject = require('./categories/Voip.po.js');
const UpsPageObject = require('./categories/Ups.po.js');
const {URLS, SELECTORS, CREDENTIALS} = require('./constants.js');

const Categories = Many(
    AppPageObject, 
    NotebooksPageObject, 
    MonitorsPageObject, 
    ServersPageObject,
    VoipPageObject,
    UpsPageObject
);

class SBPageObject extends Categories {

    constructor() {
        super();
    }

    async goToHome() {
        await this.goToUrl(URLS.home);
    }

    async getProductsLinks(amount) {
        amount = amount || 0;
        return await this.page.evaluate((SELECTORS, amount) => {
            const links = [];
            let buttons = document.querySelectorAll(SELECTORS.viewProductButton);
            buttons = amount ? 
                Array.prototype.slice.call(buttons).splice(0, amount) : Array.prototype.slice.call(buttons);
            buttons.forEach((button) => {
                links.push(button.href);
            })
            return links;
        }, SELECTORS, amount);
    }

    async getProductLinksFromFirstTwoPages() {
        let links = await this.getProductsLinks();
        await this.goToPage2();
        links = [...links, ...await this.getProductsLinks()];
        return links;
    }

    async goToPage2() {
        await this.page.click(SELECTORS.pagination2ndPageButton);
        await this.waitForAllAjax();
    }

    async getProductInfo(category) {
        return await this.page.evaluate((SELECTORS) => {
            const imageUrl = document.querySelector(SELECTORS.productImage).src;
            const title = document.querySelector(SELECTORS.productTitle).innerText;
            const brand = document.querySelector(SELECTORS.productBrand).innerText;
            const sku = document.querySelector(SELECTORS.productSku).innerText;
            const hasStock = document.querySelector(SELECTORS.productStock);
            const stock = hasStock ? document.querySelector(SELECTORS.productStock).innerText : 0;
            const description = document.querySelector(SELECTORS.productDescription).innerHTML;
            
            let price, iva, intTax;
            if(hasStock) {
                price = document.querySelector(SELECTORS.productPrice).innerText;
                iva = document.querySelector(SELECTORS.productIVA).innerText;
                const hasIntTax = document.querySelector(SELECTORS.productIntTax);
                intTax = hasIntTax ? document.querySelector(SELECTORS.productIntTax).innerText : '0';


                price = parseFloat(price.replace( /[^0-9.]/g, '' ));
                iva = parseFloat(iva.replace( /[^0-9.]/g, '' ));
                intTax = parseFloat(intTax.replace( /[^0-9.]/g, '' ));
                ivaPercent = parseFloat((iva * 100 / price).toFixed(2));       

                // TODO: generate our price here
                // XXX
                
            } else {
                price = 99999999;
                iva = 0;
                ivaPercent = 0;
                intTax = 0;
            }
            
            // data needed by our cart
            const id = '';
            const type = 'simple';
            const published = 1;
            const featured = 0;
            const visible = 'visible';
            const shortDescription = '';
            const taxStatus = 'taxable';
            const taxType = '';
            const offerStart = '';
            const offerEnd = '';
            const stockStatus = parseInt(stock) > 0 ? 1 : 'backorder';
            const underStockQty = '';
            const allowUnderStockReserve = 0;
            const soldIndividually = 0;
            const weight = '';
            const length = '';
            const width = '';
            const height = '';
            const allowReviewFromCustomer = 1;
            const purchaseNote = '';
            const discountPrice = '';
            const tags = '';
            const shipmentType = '';
            const downloadLimit = '';
            const downloadDueDays = '';
            const superior = '';
            const groupedProducts = '';
            const targetedSells = '';
            const crossedSells = '';
            const extUrl = '';
            const textButton = '';
            const position = '';
            debugger;
            return {
                id,
                type,
                sku, 
                title, 
                published,
                featured,
                visible,
                shortDescription,
                description,
                offerStart,
                offerEnd,
                taxStatus,
                taxType,
                stockStatus,
                stock,
                underStockQty,
                allowUnderStockReserve,
                soldIndividually,
                weight,
                length,
                width,
                height,
                allowReviewFromCustomer,
                purchaseNote,
                discountPrice,
                price,
                category,
                tags,
                shipmentType,
                imageUrl, 
                downloadLimit,
                downloadDueDays,
                superior,
                groupedProducts,
                targetedSells,
                crossedSells,
                extUrl,
                textButton,
                position,
                brand
            };
        }, SELECTORS, category);
    }

    async login() {
        await this.page.click(SELECTORS.usernameInput, {clickCount: 1});
        await this.page.type(SELECTORS.usernameInput, CREDENTIALS.username, {delay: 0});
        await this.page.click(SELECTORS.passwordInput, {clickCount: 1});
        await this.page.type(SELECTORS.passwordInput, CREDENTIALS.password, {delay: 0});
        await this.page.click(SELECTORS.loginButton);
        await this.page.waitForNavigation();
    }
}

module.exports = SBPageObject;