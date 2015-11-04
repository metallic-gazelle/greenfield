'use strict';

var jwt = require('jwt-simple');
var Rdio = require('rdio');
var User = require('./userModel');

module.exports = {
  findAllUsers: function(req, res) {
    User.find({}, function(err, docs) {
      if (!err) {
        res.json(docs);
      } else {
        console.error(err);
      }
    });
  },

  login: function (req, res) {
    var displayName, fbToken;
    if (!!req.body.token){
      fbToken = req.body.token;
      displayName = req.body.name;
      delete req.body.token;
    }

    // If FB token is present, don't try to validate password
    User.findOne({ 'facebook.id': req.body.id })
    .exec(function (err, user) {
      // if the user doesn't exist in the database, create a document for them
      if (!user) {
        var newUser = new User({
          facebook: {
            id: req.body.id,
            name: req.body.name,
            token: fbToken,
            photo: req.body.photo,
            email: req.body.email
          },
          rdio: {
            id: null,
            token: null,
            refreshToken: null,
            name: null,
            email: null
          }
        });

        newUser.save(function(err, user) {
          if (err) {
            res.status(401).end('Unable to save user');
          } else {
            res.json(201, {
              token: user.facebook.token,
              fb: true,
              id: user.facebook.id,
              displayName: user.facebook.name
            });
          }
        });

      } else {
        // the user exists in the database, we just need to update the token
        user.facebook.token = fbToken;
        res.json(201, {
          token: fbToken,
          fb: true,
          id: req.body.id,
          displayName: req.body.name
        });
      }
    });
  },

  getRdioTokens: function(req, res, next){

    var facebookId = req.params.facebookId;

    User.findOne({'facebook.id': facebookId})
    .exec(function(err, user){
      if (err) { throw err;}
      else {
        res.json(200, {
          accessToken: user.rdio.token,
          refreshToken: user.rdio.refreshToken
        });
      }
    })
  },

  getQueryResults: function(req, res, next){

    var facebookId = req.params.facebookId;
    var queryString = req.params.queryString;

    User.findOne({'facebook.id': facebookId})
    .exec(function(err, user){
      if (err) { throw err;}
      else {

        var credentials = {
          accessToken: user.rdio.token,
          refreshToken: user.rdio.refreshToken
        };
        console.log("CREDENTIALS -------> ", credentials);
        res.json(200, credentials);

        /*var rdio = new Rdio(
          {
            urls: {
              auth: 'https://www.rdio.com/oauth2/authorize',
              token: 'https://services.rdio.com/oauth2/token',
              resource: 'https://services.rdio.com/api/1/'
            },
            rdio: {
              clientId: "2dedtdnhuvds3lgoxraqsckege",
              clientSecret: "x6j5yXrpTt7SyhejdUai0A"
            }
          });

        console.log

        rdio.request({
          method: 'search',
          query: 'diplo',
          start: 0,
          count: 20,
          types: 'Track'
        }, function(err, response) {
          if (err) {
            res.json(404, "Problem!")
          }

          res.json(200, response);

        });*/

      }
    })
  }

};
