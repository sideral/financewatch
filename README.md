# Finance Watch API

This is a sample project that showcases Node.js both as a client of an external API as well as a REST API server. The 
task was to connect to an external API for Stock information, with the condition of not using any external library,
but only core Node libraries. It includes some basic integration tests run by a custom test runner (again, no libraries).  

### Requirements

Node 8.15+

### Running

1. Start the server with `npm start`.
2. Call the API by running `curl -X GET localhost:8000/stock/GOOG`.
3. You can change `GOOG` with any other Stock Ticker Symbol.
4. Requests will be logged in /app/tmp/api.log

### Testing

1. `npm test`

### License

MIT