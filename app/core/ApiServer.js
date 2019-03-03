const http = require('http');
const url = require('url');

const config = require('../config');
const HttpError = require('./errors/HttpError');
const Logger = require('../utils/Logger');

class ApiServer {
  /**
   * @param endpoints An object with this structure {resourceName: {get(id): function, post(data): function}}
   */
  constructor(endpoints) {
    this.endpoints = endpoints;
    this.logger = new Logger(config.logPath);
  }

  start() {
    this.server = http.createServer(this.handleRequest.bind(this));
    this.server.listen(config.serverPort);
  }

  async handleRequest(req, res) {
    const path = url.parse(req.url).pathname;
    const method = req.method.toLowerCase();

    let result;
    try {
      result = await this.callEndpoint(path, method);
    }
    catch (e) {
      result = this.handleError(e);
    }

    this.logger.log(path, result.status, result.message);

    res.setHeader('Content-Type', 'application/json');
    res.writeHead(result.status);
    res.write(result.json + '\n');
    res.end();
  }

  async callEndpoint(path, method) {
    const [name, id] = path.split('/').slice(1);
    const endpoint = this.endpoints[name];

    if (!endpoint || typeof endpoint[method] !== 'function') {
      throw new HttpError('Invalid endpoint.', 400);
    }

    const output = await endpoint[method](id);
    return {
      status: 200,
      json: JSON.stringify(output),
      message: ''
    };
  }

  handleError(e) {
    if (e.name === 'ApiError') {
      return {
        status: e.statusCode,
        json: JSON.stringify({ error: e.message }),
        message: e.internalMessage
      };
    }

    return {
      status: 500,
      json: JSON.stringify({ error: 'Internal server error.' }),
      message: e.message
    };
  }
}

module.exports = ApiServer;