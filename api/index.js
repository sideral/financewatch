const StockService = require('../services/StockService');

module.exports = {
  stock: {
    /**
     * GET /stock/{symbol}
     * @param symbol Stock ticker symbol
     */
    get: (symbol) => {
      return new Promise((resolve, reject) => {
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
        .catch(reject);
      });
    }
  }
};