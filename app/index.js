const ApiServer = require('./core/ApiServer');
const endpoints = require('./api');
const server = new ApiServer(endpoints);

server.start();