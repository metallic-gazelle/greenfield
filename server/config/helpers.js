'use strict';
var jwt  = require('jwt-simple');

module.exports = {

  sendResponse: function(res, data, statusCode) {
    var headers = {
      'access-control-allow-orgin': '*',
      'access-control-allow-methods' : 'GET, POST, PUT, DELETE, OPTIONS',
      'access-control-allow-headers': 'content-type, accept',
      'Content-Type': 'text/html'
    };
    statusCode = statusCode || 200;
    res.writeHead(statusCode, headers);
    res.end(JSON.stringify(data));
  },

  errorLogger: function (error, req, res, next) {
    // log the error then send it to the next middleware in middleware.js
    console.error(error.stack);
    next(error);
  },
  errorHandler: function (error, req, res) {
    // send error message to client and message for gracefull error handling on app
    res.status(500).send({error: error.message});
  },

  decode: function (req, res, next) {
    var token = req.headers['x-access-token'];
    var user;

    if (!token) {
      return res.status(403); // send forbidden if a token is not provided
    }

    try {
      // decode token and attach user to the request
      // for use inside our controllers
      user = jwt.decode(token, 'secret');
      req.user = user;
      next();
    } catch(error) {
      return next(error);
    }

  }
};
