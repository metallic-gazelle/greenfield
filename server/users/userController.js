var jwt = require('jwt-simple'),
User = require('./userModel');

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

  signup: function (req, res, next) {
    // Look for fbToken already on request body, store reference if
    // it exists and delete before passing request body to be saved to dB
    if (!!req.body.token){
      var fbToken = req.body.token;
      delete req.body.token;
    }
    // Define displayname and username for attaching to returned FB token obj
    var displayname = req.body.name['first'];
    var username = req.body.username;

    User.findOne({username: req.body.username})
    .exec(function (err, user) {
      if (!user) {
        var newUser = new User(req.body);
        newUser.save(function (err, newUser) {
          if (err) {
            next(err);
          } else {
              // ***Look for fbToken first, fall back to jwt if not found
              var token = fbToken || jwt.encode(newUser, 'argleDavidBargleRosson');
              if (!!fbToken){
                res.json({token: token, fb: true, username: username, displayname: displayname});
              } else {
                res.json({token: token});
              }
              console.log('Success: Account added to database.');
              res.status(201).end();
            }
          });
      } else {
        res.status(401).end("Error: Account already exists");
      }
    });
  },

  login: function (req, res, next) {
    console.log("--------> REQ BODY: \n", req.body);
   /* var username = req.body.username;
    var password = req.body.password;*/

    /*if (!!req.body.token){
      var fbToken = req.body.token;
      var displayname = req.body.name['first'];
      delete req.body.token;
    }

    // If FB token is present, don't try to validate password
    User.findOne({ username: username })
    .exec(function (err, user) {
      if (!user) {
        res.status(401).end("Username Not Found");
      } else if (!!fbToken) {
        res.json({token: fbToken, fb: true, username: username, displayname: displayname});
        console.log("Logged In With Facebook");
        res.status(201).end();
      } else {
        user.comparePassword(password, user.password, function (err, match) {
          if (match) {
            var token = jwt.encode(user, 'argleDavidBargleRosson');
            res.json({token: token});
            console.log('Success: Logged in');
            res.status(200).end();

          } else {
            res.status(401).end("Incorrect Password: Try Again");
          }
        });
      }
    });*/
  }

};
