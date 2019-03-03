const config = require('./config');

const ApiServer = require('./core/ApiServer');
const Logger = require('./utils/Logger');

const api = require('./api');

const logger = new Logger(config.logPath);
const server = new ApiServer(api, logger);

server.start(config.serverPort);