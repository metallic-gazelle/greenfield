// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var SpotifyStrategy = require('passport-spotify').Strategy;

// load up the user model
var User       = require('../users/userModel');

// load the auth variables
var configAuth = require('./auth');

module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
    // code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields   : configAuth.facebookAuth.profileFields,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },

    // facebook will send back the token and profile
    function(req, token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            if (!req.user) {
                // find the user in the database based on their facebook id
                User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                    console.log("----------> profile", profile);
                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found, then log them in
                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user found with that facebook id, create them
                        var newUser            = new User();

                        // set all of the facebook information in our user model
                        newUser.facebook.id    = profile.id; // set the users facebook id                   
                        newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                        newUser.facebook.name  = profile.name.givenName + " " + profile.name.familyName; // look at the passport user profile to see how names are returned
                        newUser.facebook.email = profile.emails[0].value;
                        newUser.facebook.photo = profile.photos[0].value // facebook can return multiple emails so we'll take the first

                        // save our user to the database
                        newUser.save(function(err) {
                            if (err)
                                throw err;

                            // if successful, return the new user
                            return done(null, newUser);
                        });
                    }

                });
            } else {
                // user already exists and is logged in, we have to link accounts
                var user            = req.user; // pull the user out of the session

                // update the current users facebook credentials
                user.facebook.id    = profile.id;
                user.facebook.token = token;
                user.facebook.name  = profile.name.givenName + " " + profile.name.familyName;
                user.facebook.email = profile.emails[0].value;
                user.facebook.photo = profile.photos[0].value;

                // save the user
                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });

            }

            
        });

    }));

    // =========================================================================
    // SPOTIFY ================================================================
    // =========================================================================
    passport.use(new SpotifyStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.spotifyAuth.clientID,
        clientSecret    : configAuth.spotifyAuth.clientSecret,
        callbackURL     : configAuth.spotifyAuth.callbackURL,
        passReqToCallback : true 
    },

    // spotify will send back the token and profile
    function(req, token, refreshToken, profile, done) {

        // asynchronous
        if (!req.user) {
            process.nextTick(function() {

                // find the user in the database based on their spotify id
                User.findOne({ 'spotify.id' : profile.id }, function(err, user) {
                    console.log("----------> profile", profile);
                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found, then log them in
                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user found with that facebook id, create them
                        var newUser            = new User();

                        // set all of the facebook information in our user model
                        newUser.spotify.id    = profile.id; // set the users facebook id                   
                        newUser.spotify.token = token; // we will save the token that facebook provides to the user                    
                        newUser.spotify.name  = profile.displayName; // look at the passport user profile to see how names are returned
                        newUser.spotify.email = profile._json.email;
                        newUser.spotify.photo = profile.photos[0];

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
                user.spotify.id    = profile.id;
                user.spotify.token = token;
                user.spotify.name  = profile.displayName; 
                user.spotify.email = profile._json.email;
                user.spotify.photo = profile.photos[0];

                // save the user
                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });

            }
        

    }));

};