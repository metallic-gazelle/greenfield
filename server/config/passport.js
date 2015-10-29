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
      console.log("\n /////////////////////////////////////////////////// \n", user, "\n /////////////////////////////////////////////////// \n");
      done(null, user._id);

    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
      //done();
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
      console.log("RDIO REQUEST ---------> ", req);
      // asynchronous
      if (!req.user) {
        process.nextTick(function() {

          // find the user in the database based on their rdio id
          User.findOne({ 'rdio.id' : profile.id }, function(err, user) {
            console.log("----------> profile", profile);
              // if there is an error, stop everything and return that
              // ie an error connecting to the database
              if (err)
                return done(err);

              // if the user is found, then log them in
              if (user) {
                  return done(null, user); // user found, return that user
                } else {
                  // if there is no user found with that rdio id, create them
                  var newUser            = new User();

                  // set all of the rdio information in our user model
                  newUser.rdio.id    = profile.id; // set the users facebook id
                  newUser.rdio.token = token; // we will save the token that facebook provides to the user
                  newUser.rdio.name  = profile.displayName; // look at the passport user profile to see how names are returned
                  newUser.rdio.email = profile._json.email;
                  //newUser.rdio.photo = profile.photos[0];

                  // save our user to the database
                  newUser.save(function(err) {
                    if (err)
                      throw err;

                      // if successful, return the new user
                      return done(null, newUser);
                    });
                }

              });
        });

      } else {
        // user already exists and is logged in, we have to link accounts
        var user            = req.user; // pull the user out of the session

        // update the current users facebook credentials
        user.rdio.id    = profile.id;
        user.rdio.token = token;
        user.rdio.name  = profile.displayName;
        user.rdio.email = profile._json.email;
        //user.rdio.photo = profile.photos[0];

        // save the user
        user.save(function(err) {
          if (err)
            throw err;
          return done(null, user);
        });

      }
    }));

};
