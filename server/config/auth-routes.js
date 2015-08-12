module.exports = function(app, passport) {

    // route for home page
    app.get('/', function(req, res) {
        res.render('../views/index.ejs'); // load the index.ejs file
    });

    // route for login form
    // route for processing the login form
    // route for signup form
    // route for processing the signup form

    // route for showing the profile page
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('../views/profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));


    // =====================================
    // SPOTIFY ROUTES =====================
    // =====================================
    // route for spotify authentication and login
    app.get('/auth/spotify', passport.authenticate('spotify', {scope: ['user-read-email', 'user-read-private'] }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/spotify/callback',
        passport.authenticate('spotify', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));


    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =============================================================================
    // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
    // =============================================================================

    // send to facebook to do the authentication
    app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

    // handle the callback after facebook has authorized the user
    app.get('/connect/facebook/callback',
        passport.authorize('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    // send to facebook to do the authentication
    app.get('/connect/spotify', passport.authorize('spotify', { scope : ['user-read-email', 'user-read-private'] }));

    // handle the callback after facebook has authorized the user
    app.get('/connect/spotify/callback',
        passport.authorize('spotify', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    // =============================================================================
    // UNLINK ACCOUNTS =============================================================
    // =============================================================================
    // used to unlink accounts. for social accounts, just remove the token
    // for local account, remove email and password
    // user account will stay active in case they want to reconnect in the future

        // facebook -------------------------------
        app.get('/unlink/facebook', function(req, res) {
            var user            = req.user;
            user.facebook = undefined;
            user.save(function(err) {
                res.redirect('/profile');
            });
        });

        // spotify -------------------------------
        app.get('/unlink/spotify', function(req, res) {
            var user            = req.user;
            user.spotify = undefined;
            user.save(function(err) {
                res.redirect('/profile');
            });
        });



};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}