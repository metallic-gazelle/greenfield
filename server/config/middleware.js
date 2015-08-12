var morgan        = require('morgan'), // used for logging incoming request
    bodyParser    = require('body-parser'),
    helpers       = require('./helpers'),
    cookieParser  = require('cookie-parser'),
    session       = require('express-session'),
    flash         = require('connect-flash'),
    passport      = require('passport');
// TODO: will need to change much of the authentication and helpers.decode which uses jwt

module.exports = function (app, express) {
  // Express 4 allows us to use multiple routers with their own configurations
  var userRouter = express.Router();
  var songRouter = express.Router();
  var playlistRouter = express.Router();

  app.use(morgan('dev'));
  app.use(cookieParser()); // read cookies (needed for auth)
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  app.set('view engine', 'ejs'); // set up ejs for templating
  app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions
  app.use(flash()); // use connect-flash for flash messages stored in session


  // TODO: CHANGE DIR TO SERVE UP PUBLIC FILES
  app.use(express.static(__dirname + '/../../client'));

  app.use('/api/user', userRouter); // use user router for all user requests

  app.use('/api/playlist', helpers.decode); // authentication middleware used to decode token
  app.use('/api/playlist', playlistRouter); // use playlist router for all playlist requests

  app.use('/api/song', helpers.decode);
  app.use('/api/song', songRouter); // user link router for link request

  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  // inject our routers into their respective route files
  require('../users/userRoutes')(userRouter);
  require('../songs/songRoutes')(songRouter);
  require('../playlists/playlistRoutes')(playlistRouter);
  require('./auth-routes')(app, passport);
};
