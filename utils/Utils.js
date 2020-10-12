const {PRICING} = require('../constants.js');

const Utils = {
    toCSV: function(json) {
        let csv = '';
        for(let i = 0; i < json.length; i++) {
            const row = json[i];
            for(const property in row) {
                csv += `"${row[property]}",`;
            }
            csv += '\n';
        }
        return csv;
    },

    getFinalPrice: function(price, iva, impInt, usdPrice, currency) {
        impInt = impInt || 0;
        const ivaCredito = price * iva / 100;
        const costoTotal = (((PRICING.IIBB + impInt) * price) / 100) + price;
        const costoTotalIva = costoTotal + ivaCredito;
        const impDebCred = costoTotalIva * PRICING.DDCC;

        const untaxedPrice = (costoTotal * PRICING.markup / 100) + costoTotal + impDebCred;
        const ivaDebito = untaxedPrice * iva / 100;

        let pvp = untaxedPrice + ivaDebito;

        if(currency == 'USD') {
            pvp = pvp * usdPrice;
        }

        return pvp;
    }
}

module.exports = Utils;