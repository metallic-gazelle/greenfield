'use strict';
var playlistController = require('./playlistController');

module.exports = function (app) {
  // app === playlistRouter injected from middlware.js

  app.param('playlistId', playlistController.findPlaylist);
  // app.param('songId', playlistController.hasSong);

  app.get('/:playlist', playlistController.getPlaylist);
  app.get('/:playlist', playlistController.getPlaylist);

  app.post('/create', playlistController.createPlaylist);

  app.post('/add/:playlistId/:songId', playlistController.addSong);

  app.post('/remove/:playlistId/:songId', playlistController.hasPlayed);
  app.post('/remove/:playlistId/:songId', playlistController.removeSong);
};
