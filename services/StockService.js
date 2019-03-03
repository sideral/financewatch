var https = require('https');

const SERVICE_URL = 'https://api.iextrading.com/1.0/stock';

class StockService {
  constructor(symbol) {
    this.resourceUrl = `${SERVICE_URL}/${symbol}/`;
  }

  async fetchLogoUrl() {
    const logo = await this.fetch('logo');
    return logo.url;
  }

  async fetchLatestNewsUrl() {
    const news = await this.fetch('news/last/1');
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

        let buffer = '';
        res.on('data', (chunk) => {
          buffer += chunk;
        });

        res.on('end', () => {
          try {
            resolve(JSON.parse(buffer));
          }
          catch (e) {
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

module.exports = StockService;