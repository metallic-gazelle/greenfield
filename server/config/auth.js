// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '1069113223099244', // your App ID
        'clientSecret'  : 'e260cca5173a2a1916d0b9443c2eea29', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback',
        'profileFields' : ['id', 'name', 'displayName', 'photos', 'email']

    },
    'rdioAuth' : {
        'consumerKey'      : '2dedtdnhuvds3lgoxraqsckege', // your App ID
        'consumerSecret'  : 'x6j5yXrpTt7SyhejdUai0A', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/rdio/callback'

    }

};
