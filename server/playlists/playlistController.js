var Playlist       = require('./playlistModel'),
    SongController = require('../songs/songController'),
    Q              = require('q'),
    sendResp       = require('../config/helpers').sendResponse;

module.exports = {

  getPlaylist: function(req, res, next) {
    req.playlist
      .populate('songs')
      .populate('playedSongs')
      .exec(function(err, results) {
        if (err) next(err);
        sendResp(res, {playlist: results}); // TODO: send the right data back; inspect these results
      });
  },

  createPlaylist: function(req, res, next) {
    var playlist = new Playlist({'_creator': req.body.userId});
    playlist.save(function(err, playlist) {
      if (err) {
        next(err);
      } else {
        sendResp(res, {'playlistId': playlist._id});
      }
    });
  },

  findPlaylist: function(req, res, next, playlistId) {

    var findOne = Q.nbind(Playlist.findOne, Playlist);
    var query = {"_id": playlistId};

    findOne(query)
      .then(function(playlist) {
        if (playlist === null) {
          next(new Error('Playlist Error: playlist not found in database.'));
        } else {
          req.playlist = playlist;
          next();
        }
      })
      .fail(function (error) {
        next(error);
      });
  },

  hasSong: function(req, res, next, songId) {
    // call hasSong method on PlaylistSchema which return a promise
    req.playlist.hasSong(songId).then(function(isInPlaylist) {
      req.hasSong = isInPlaylist;
      req.songId = songId;
      next();
    }, function(err) {
      next(err);
    });
  },

  addSong: function(req, res, next) {
    if (req.hasSong) {
      throw new Error('Playlist Error: song already in playlist.');
    } else {
      var song = new Song(req.body);
      song.save(function(err, song) {
        if (err) {
          next(err);
        } else {
          console.log('SUCCESS: song added to playlist.');
          req.playlist.songs.push();
          sendResp(res, song);
        }
      });
    }
  },

  hasPlayed: function(req, res, next) {
    // call hasPlayed method on PlaylistSchema which return a promise
    if (req.hasSong) {
      req.playlist.hasPlayed(req.songId).then(function(played) {
        req.hasPlayed = played;
        next();
      }, function(err) {
        next(err);
      });
    } else throw new Error('Playlist Error on hasPlayed: song not in playlist.');
  },

  removeSong: function(req, res, next) {
    if (req.body.played) {
      req.playlist.playedSongs.push({_id: req.body._id});
    }
    req.playlist.songs.pull({_id: req.body._id});
    sendResp(res, {_id: req.body._id});
  }
};