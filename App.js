const puppeteer = require('puppeteer');
const SBPageObject = require('./po/SB/SB.po.js');
const {CATEGORIES, PRODUCT_HEADERS} = require('./po/SB/constants.js');

// they only have around 5 models in stock
const LIMIT_MONITORS = 5;

const sb = new SBPageObject();

(async () => {
    await sb.openBrowser();
    await sb.openNewTab();
    await sb.goToHome();
    await sb.login();
    
    let links = {};
    // notebooks links and filter by brand
    await sb.goToNotebooksAndFilter();
    category = CATEGORIES.notebooks;
    links[CATEGORIES.notebooks] = await sb.getProductLinksFromFirstTwoPages();
    
    // monitors links and only save first 5 resutls
    await sb.goToMonitors();
    links[CATEGORIES.monitors] = await sb.getProductsLinks(LIMIT_MONITORS);

    // servers links and filter by brand
    await sb.goToServersRackAndFilter();
    links[CATEGORIES.servers] = await sb.getProductsLinks();
    await sb.goToServersTowerAndFilter();
    links[CATEGORIES.servers] = [...links[CATEGORIES.servers], ...await sb.getProductsLinks()];
    
    // voip links and filter by brand
    await sb.goToVoipAndFilter();
    links[CATEGORIES.viopPhones] = await sb.getProductsLinks();

    // ups links (only targets apc)
    await sb.goToUps();
    links[CATEGORIES.ups] = await sb.getProductsLinks();

    // iterate links and get product info
    products = [PRODUCT_HEADERS];
    Object.keys(links).forEach((category) => {
        links[category].forEach(async (link) => {
            debugger;
            await sb.goToUrl(link);
            const info = await sb.getProductInfo(category);
            products.push(info);
        });
    });
    console.log(products);
})();