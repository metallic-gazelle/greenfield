// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var RdioStrategy = require('passport-rdio-oauth2').Strategy;
var Q = require('q');
var jwt = require('jwt-simple');

// load up the user model
var User = require('../users/userModel');

// load the auth variables
var configAuth = require('./auth');

module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
      done(null, user._id);

    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });

    // =========================================================================
    // RDIO ====================================================================
    // =========================================================================

    passport.use(new RdioStrategy({
      // pull in our app id and secret from our auth.js file
      clientID        : configAuth.rdioAuth.consumerKey,
      clientSecret     : configAuth.rdioAuth.consumerSecret,
      callbackURL        : configAuth.rdioAuth.callbackURL,
      passReqToCallback  : true
    },

    // rdio will send back the token and profile
    function(req, token, refreshToken, profile, done) {
      // asynchronous

        process.nextTick(function() {

          var facebookId = req.query.state;

          User.findOne({ 'facebook.id': facebookId}, function(err, user){

            if (err) {
              return done(err);
            } else {
              // user found by facebook id, update the rdio info
              user.rdio.id = profile.id;
              user.rdio.token = token;
              user.rdio.name = profile.displayName;
              user.rdio.email = profile._json.email;

              user.save(function(err) {
                if (err)
                  throw err;
                return done(null, user);
              });
            }


          });

        });

    }));

};
