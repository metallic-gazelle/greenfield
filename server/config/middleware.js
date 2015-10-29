var morgan        = require('morgan'), // used for logging incoming request
    bodyParser    = require('body-parser'),
    helpers       = require('./helpers'),
    cookieParser  = require('cookie-parser'),
    session       = require('express-session'),
    flash         = require('connect-flash'),
    passport      = require('passport');

module.exports = function (app, express) {
  // Express 4 allows us to use multiple routers with their own configurations
  var songRouter = express.Router();
  var userRouter = express.Router();
  var playlistRouter = express.Router();

  app.use(morgan('dev'));
  app.use(cookieParser()); // read cookies (needed for auth)
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  //app.set('view engine', 'ejs'); // set up ejs for templating
  app.use(session({ secret: 'ilovejibe' })); // session secret
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions
  app.use(flash()); // use connect-flash for flash messages stored in session

  app.use(express.static(__dirname + '/../../client'));

  app.use('/api/playlist', playlistRouter); // use playlist router for all playlist requests
  app.use('/api/users', userRouter); // use user router for all user requests
  app.use('/api/song', songRouter); // user link router for link request

  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  // inject our routers into their respective route files
  require('../songs/songRoutes')(songRouter);
  require('../playlists/playlistRoutes')(playlistRouter);
  require('../users/userRoutes')(userRouter);
  require('./auth-routes')(app, passport);
};
