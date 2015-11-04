'use strict';
var userCtrl = require('./userController'),
  helpers = require('../config/helpers');

module.exports = function (app) {
  // app is the userRouter injected from middleware.js

  app.post('/login', userCtrl.login);
  app.get('/rdiotokens/:facebookId', userCtrl.getRdioTokens);
  app.get('/rdioquery/:facebookId/:queryString', userCtrl.getQueryResults);


  app.use('/table', helpers.decode);

  app.use('/tabs', helpers.decode);
  app.get('/tabs', userCtrl.findAllUsers);
};
