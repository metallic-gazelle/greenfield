// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '1069113223099244', // your App ID
        'clientSecret'  : 'e260cca5173a2a1916d0b9443c2eea29', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback',
        'profileFields' : ['id', 'name', 'displayName', 'photos', 'email', 'hometown', 'profileUrl', 'friends']

    },
    'spotifyAuth' : {
        'clientID'      : 'cb17f20833404f5cbbb50eadb067eff0', // your App ID
        'clientSecret'  : 'febdb423c7284fbaa200683caed2f55c', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/spotify/callback'

    }

};