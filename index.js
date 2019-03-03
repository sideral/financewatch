const config = require('./config');

const ApiServer = require('./lib/ApiServer');
const Logger = require('./lib/Logger');

const api = require('./api');

const logger = new Logger(config.logPath);
const server = new ApiServer(api, logger);

server.start(config.serverPort);