const assert = require('assert').strict;

const StockService = require('../../../app/services/StockService');

module.exports = {
  'it should retrieve logo url': async function(){
    const client = new StockService('GOOG');
    const logoUrl = await client.fetchLogoUrl();
    assert.equal(logoUrl, 'https://storage.googleapis.com/iex/api/logos/GOOG.png');
  },

  'it should retrieve the latest news url': async function(){
    const client = new StockService('GOOG');
    const newsUrl = await client.fetchLatestNewsUrl();
    const newsRegex = /https:\/\/api\.iextrading\.com\/1\.0\/stock\/goog\/article\/[0-9]+/;
    assert.ok(newsRegex.test(newsUrl));
  },

  'it should retrieve the latest price': async function(){
    const client = new StockService('GOOG');
    const price = await client.fetchLatestPrice();
    const priceRegex = /[0-9]+(\.[0-9]{1,2})*/;
    assert.ok(priceRegex.test(price.toString()));
  },

  'it should return error on invalid symbol': async function(){
    const client = new StockService('INVALID');
    assert.rejects(async () => await client.fetchLatestPrice());
  }
};