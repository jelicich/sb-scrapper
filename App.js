const puppeteer = require('puppeteer');
const SBPageObject = require('./po/SB/SB.po.js');
const {CATEGORIES, PRODUCT_HEADERS, DOLAR_API} = require('./constants.js');
const util = require('./utils/Utils.js');
const fs = require('fs');
const axios = require('axios');
const Logger = require('./services/Logger.js');
const SHMPageObject = require('./po/SHM/SHM.po.js');
global.logger = Logger.init();

// they only have around 5 models in stock
const LIMIT_MONITORS = 5;

const sb = new SBPageObject();
const shm = new SHMPageObject();

(async () => {
    logger.log('info', 'Start App');

    // get dolar price.
    logger.log('info', 'Get dolar price');
    let usd
    await axios.get(DOLAR_API.url)
        .then(response => {
            logger.log('info', 'API dolar price response successful');
            response.data.forEach((dolar)=> {
                if(dolar.casa.nombre == DOLAR_API.bankName) {
                    usd = Number(dolar.casa.venta.replace(',','.'));
                }
            })   
        })
        .catch(error => {
            logger.log('error', 'Failed to get Dolar Price');
            process.exit();
        });
    
    // if we don't have dolar price we cancel the process
    if(!usd) {
        logger.log('error', 'Dolar API response format error?');
        process.exit();
    }

    // start scrapping sb
    await sb.openBrowser();
    await sb.openNewTab();
    await sb.goToHome();
    await sb.login();
    
    let links = {};
    // notebooks links and filter by brand
    // await sb.goToNotebooksAndFilter();
    // category = CATEGORIES.notebooks;
    // links[CATEGORIES.notebooks] = await sb.getProductLinksFromFirstTwoPages();
    
    // monitors links and only save first 5 resutls
    await sb.goToMonitors();
    links[CATEGORIES.monitors] = await sb.getProductsLinks(LIMIT_MONITORS);

    // servers links and filter by brand
    // await sb.goToServersRackAndFilter();
    // links[CATEGORIES.servers] = await sb.getProductsLinks();
    // await sb.goToServersTowerAndFilter();
    // links[CATEGORIES.servers] = [...links[CATEGORIES.servers], ...await sb.getProductsLinks()];
    
    // voip links and filter by brand
    // await sb.goToVoipAndFilter();
    // links[CATEGORIES.viopPhones] = await sb.getProductsLinks();

    // ups links (only targets apc)
    // await sb.goToUps();
    // links[CATEGORIES.ups] = await sb.getProductsLinks();

    let products = [PRODUCT_HEADERS];
    // iterate links and get product info
    for(const category in links) {
        for(let i = 0; i < links[category].length; i++) {
            const link = links[category][i];
            await sb.goToUrl(link);
            const info = await sb.getProductInfo(category, usd);
            products.push(info);
        }
    }
    
    // create and save csv file
    const csvProducts = util.toCSV(products);
    const dateString = new Date().toISOString();
    const fileName = `${dateString}-products.csv`;
    const path = './results/';
    fs.writeFile(path + fileName, csvProducts, 'utf8', function (err) {
        if (err) {
            console.log('Save file error: ', err);
        }
    });
     
    await sb.closeBrowser();

    // start upload process
    await shm.openBrowser();
    await shm.openNewTab();
    await shm.goToAuthPage();
    await shm.login();
    await shm.goToImporter();

})();