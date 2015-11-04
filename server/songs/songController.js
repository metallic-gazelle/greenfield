'use strict';
var Song     = require('./songModel'),
    Q        = require('q'),
    sendResp = require('../config/helpers').sendResponse;

module.exports = {

  // SONG ADDED TO DB USING PLAYLIST CONTROLLER
  // add: function(req, res, next) {
  //   var song = new Song(req.body);
  //   song.save(function(err, song) {
  //     if (err) {
  //       next(err);
  //     } else {
  //       res.json(song);
  //     }
  //   });
  // },

  remove: function(req, res, next) {
    Song.findByIdAndRemove(req.params.id, function (err, song) {
      if (err) {
        next(err);
      } else {
        sendResp(res, song);
      }
    });
  },

  upvote: function(req, res, next) {
    var songId = req.body.songId;
    var userId = req.body.userId;

    var findOne = Q.nbind(Song.findOne, Song);

    var query = {'_id': songId};

    findOne(query)
      .then(function(song) {
        if (song === null) {
          next(new Error('Upvote error: song not found.'));

        } else if (song && song.meta.upvoteUsers.indexOf(userId) !== -1) {
          next(new Error('Upvote error: user already upvoted this song.'));

        } else {
          song.meta.upvoteUsers.push(userId);
          song.upvote().then(function (song) {
            sendResp(res, {upvotes: song.meta.upvotes});
          }, function() {
            next(new Error('Upvote error: upvoted song was not saved.'));
          });
        }
      })
      .fail(function (error) {
        next(error);
      });
  },

  downvote: function(req, res, next) {
    var songId = req.body.songId;
    var userId = req.body.userId;

    var findOne = Q.nbind(Song.findOne, Song);

    var query = {'_id': songId};

    findOne(query)
      .then(function(song) {
        if (song === null) {
          next(new Error('Downvote error: song not found.'));

        } else if (song && song.meta.downvoteUsers.indexOf(userId) !== -1) {
          next(new Error('Downvote error: user already upvoted this song.'));

        } else {
          song.meta.downvoteUsers.push(userId);
          song.downvote().then(function (song) {
            sendResp(res, {downvotes: song.meta.downvotes});
          }, function() {
            next(new Error('Downvote error: upvoted song was not saved.'));
          });
        }
      })
      .fail(function (error) {
        next(error);
      });
  }
};
