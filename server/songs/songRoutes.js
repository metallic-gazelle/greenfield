'use strict';
var songController = require('./songController');

module.exports = function (app) {
  // app === songRouter injected from middlware.js

  app.post('/upvote', songController.upvote);
  app.post('/downvote', songController.downvote);
};
