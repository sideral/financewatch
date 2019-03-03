var https = require('https');

class StockApiClient {
  constructor(symbol) {
    this.resourceUrl = `https://api.iextrading.com/1.0/stock/${symbol}/`;
  }

  async fetchLogoUrl() {
    const logo = await this.fetch('logo');
    return logo.url;
  }

  async fetchLatestNewsUrl() {
    const news = await this.fetch('news');
    return news.length > 0 ? news[0].url : '';
  }

  async fetchLatestPrice() {
    const quote = await this.fetch('quote');
    return quote.latestPrice;
  }

  fetch(path) {
    return new Promise((resolve, reject) => {
      https.get(this.resourceUrl + path, (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          const error = new Error(`Invalid status code: ${res.statusCode}`);
          error.statusCode = res.statusCode;
          reject(error);
          return;
        }

        res.setEncoding('utf8');
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(e.message));
          }
        });
      })
      .on('error', (e) => {
        reject(new Error(e.message));
      });
    });
  }
}

module.exports = StockApiClient;