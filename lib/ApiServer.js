const http = require('http');
const url = require('url');

class ApiServer {
  /**
   * @param api An object with this structure {resourceName1: {get(id): function, post(data): function}}
   * @param logger An instance of Logger
   */
  constructor(api, logger) {
    this.api = api;
    this.logger = logger;
  }

  /**
   * Starts the server listening in the given port
   * @param port
   */
  start(port) {
    if (this.server) {
      throw new Error('Server already started.');
    }

    this.server = http.createServer(this.handleRequest.bind(this));

    this.server.on('clientError', (err, socket) => {
      socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    });

    this.server.listen(port);
  }

  async handleRequest(req, res) {
    const path = url.parse(req.url).pathname;
    const method = req.method.toLowerCase();
    let output, json = '', status = 200;

    try {
      output = await this.callEndpoint(path, method);
      if(output === null){
        status = 404;
      }
      json = JSON.stringify(output);
      this.logger.log(path, status);
    }
    catch (e) {
      status = e.statusCode === 404 ? 404 : 500;
      this.logger.log(path, status, e.message);
    }

    res.writeHead(status);
    res.write(json + '\n');
    res.end();
  }

  /**
   * Calls the actual endpoint and gets its result asynchronously.
   *
   * @param path A path of the form /resource/id
   * @param method Lower-cased HTTP method to use for calling the endpoint
   * @returns {Promise<null>}
   */
  async callEndpoint(path, method) {
    //It is assumed that path always has the form /resource/id, everything else is ignored.
    const [name, id] = path.split('/').slice(1);
    const endpoint = this.api[name];
    return endpoint && typeof endpoint[method] === 'function' ? endpoint[method](id) : null;
  }
}

module.exports = ApiServer;