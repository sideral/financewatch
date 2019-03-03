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
    //Extra parameters are ignored.
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
    let status = 500, errorMessage = e.message, internalMessage = e.message;

    switch (e.name) {
      case 'ApiError':
        status = e.statusCode;
        internalMessage = e.internalMessage;
        break;
      case 'HttpError':
        status = e.statusCode;
        break;
      default:
        errorMessage = 'Internal server error.';
    }

    return {
      status: status,
      json: JSON.stringify({ error: errorMessage }),
      message: internalMessage
    };
  }
}

module.exports = ApiServer;