const assert = require('assert').strict;

const stockApi = require('../../../app/api/stock');

module.exports = {
  'it should retrieve all info from valid symbol': async function(){
    const output = await stockApi.get('GOOG');
    const keys = Object.keys(output);
    ['latestPrice', 'logoUrl', 'newsUrl'].forEach(key => {
      assert.ok(keys.includes(key));
    });
  },

  'it should throw ApiError 404 for invalid symbol': async function(){
    try{
      await stockApi.get('INVALID');
      assert.ok(false); // It shouldn't get to this point.
    }
    catch(e){
      assert.equal(e.name, 'ApiError');
      assert.equal(e.statusCode, 404);
    }
  },

  'it should require ticker symbol': async function(){
    try{
      await stockApi.get();
      assert.ok(false); // It shouldn't get to this point.
    }
    catch(e){
      assert.equal(e.name, 'ApiError');
      assert.equal(e.statusCode, 400);
    }
  },
};