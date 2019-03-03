const StockService = require('../services/StockService');
const ApiError = require('../core/errors/ApiError');

module.exports = {
  /**
   * GET /stock/{symbol}
   * @param symbol Stock ticker symbol
   */
  get: (symbol) => {
    return new Promise((resolve, reject) => {
      if(symbol === undefined || symbol === ''){
        return reject(new ApiError('A ticker symbol is required.', 400));
      }

      const client = new StockService(symbol);
      Promise.all([
        client.fetchLatestPrice(),
        client.fetchLogoUrl(),
        client.fetchLatestNewsUrl()
      ])
      .then(results => {
        const [latestPrice, logoUrl, newsUrl] = results;
        resolve({latestPrice, logoUrl, newsUrl});
      })
      .catch((err) => {
        if(err.name === 'HttpError' && err.statusCode === 404){
          reject(new ApiError(`Ticker symbol '${symbol}' not recognized.`, 404, err));
        }
        else{
          reject(new ApiError('I was not possible to retrieve stock information.', 500, err));
        }
      });
    });
  }
};