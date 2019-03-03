const http = require('http');
const url = require('url');

class ApiServer {
  constructor(api) {
    this.api = api;
  }

  start(port) {
    if (this.server) {
      throw new Error('Server already started.');
    }

    this.server = http.createServer(this.handleRequest);

    this.server.on('clientError', (err, socket) => {
      socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    });

    this.server.listen(port);
  }

  async handleRequest(req, res) {
    const path = url.parse(req.url).pathname;
    const method = req.method.toLowerCase();
    let output, json, status = 200;

    try {
      output = await this.callEndpoint(path, method);
      if(output === null){
        status = 404;
      }
      json = JSON.stringify(output);
    }
    catch (e) {
      status = 500;
      json = JSON.stringify({errorMessage: e.message})
    }

    res.writeHead(status);
    res.write(json);
    res.end();
  }

  async callEndpoint(path, method) {
    //It is assumed that path always has the form /resource/id, everything else is ignored.
    const [name, id] = path.split('/').slice(1);
    const endpoint = this.api[name];
    return endpoint && typeof endpoint[method] === 'function' ? endpoint[method](id) : null;
  }
}
