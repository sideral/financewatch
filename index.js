
//const config = requir)
const ApiServer = require('./lib/ApiServer');
const Api = require('./Api');

var server = new ApiServer(Api);
server.start(8000);