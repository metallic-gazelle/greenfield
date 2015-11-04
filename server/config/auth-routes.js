
var PlaylistCtrl = require('../playlists/playlistController');
var helpers = require('./helpers');

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = function(app, passport) {

    app.get('/host', isLoggedIn, PlaylistCtrl.createPlaylist, function(req, res) {
        res.redirect(301, '/#/host/' + req.playlistId);
    });


    // =====================================
    // RDIO ROUTES==== =====================
    // =====================================
    app.param('id', function(req, res, next, id){
        req.id = id;
        next();
    });

    // route for rdio authentication and login
    app.get('/auth/rdio/:id', function(req, res) {
        passport.authenticate('rdio', { state: req.id})(req, res);
    });

    // handle the callback after facebook has authenticated the user
    app.get('/auth/rdiocallback',
        passport.authenticate('rdio', {
            successRedirect : '/host',
            failureRedirect : '/'
        }));

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


    // =============================================================================
    // UNLINK ACCOUNTS =============================================================
    // =============================================================================
    // used to unlink accounts. for social accounts, just remove the token
    // for local account, remove email and password
    // user account will stay active in case they want to reconnect in the future

    // rdio -------------------------------
    app.get('/unlink/rdio', function(req, res) {
        var user = req.user;
        user.rdio = undefined;
        user.save(function(err) {
            if (err) {
                helpers.errorHandler(err);
            }
            res.redirect('/profile');
        });
    });
};
