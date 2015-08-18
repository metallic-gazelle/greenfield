angular.module('jibe.services', [])

.factory('searchYouTube', function ($http) {
    // this is our factory function for getting data from spotify, this will be run when we type in the search field
    var getData = function(data) {

        // Take user submitted search string from input field, split
        // into separate words and rejoin w/ proper delimiter
        var searchTerms = data.split(" ");
        var searchQuery = searchTerms.join("+");

        // Base url plus search query start, search query will be added on to this
        var base_url = "https://api.spotify.com/v1/search?q=";
        // Since we will always be using the same type filter, market filter, and
        // search result limit, can combine all into one suffix url
        var url_suffix = "&type=track&market=US&limit=10";

        // Combine base, search, and suffix into complete search query url
        var uri = base_url + searchQuery + url_suffix;

        return $http({
                method: 'GET',
                url: 'https://www.googleapis.com/youtube/v3/search?part=id%2C+snippet&q=' + searchQuery + '&type=video' + '&videoEmbeddable=true' + '&videoCaption=closedCaption' + '&maxResults=20' +'&key=AIzaSyCozCGD6I5g-mOcT7xL8KCQ97GUlCIMj3w',

            })
            .then(function(resp) {
                console.log(resp);
                var searchResults = resp.data.items;

                // Limit = # of search results per page, returned from spotify
                // var limit = searchResults["tracks"]["limit"];
                // Array of track objects from search
                // var items = searchResults["tracks"]["items"];

                var results = [];

                // Iterate through search results,
                _.each(searchResults, function(item) {
                    var entry = {
                        "title": item.snippet.title,
                        "uri": item.id.videoId
                    };
                    _.each(item["artists"], function(artist) {
                        entry["artists"].push(artist["name"]);
                    });
                    // console.log(entry)
                    results.push(entry);
                });

                return results;
            });
    };

    return {
        getData: getData,
    };
})
.factory('playlistDatabase', function($http) {

    // this is our get request for our db for the current playlist in the room
    // this will be called when a user loads the room and whenever a succesful post request occurs to the db (so
    // the user can see the updated playlist when after they add somethng to it)
    var getQueue = function(playlistId) {
        return $http({
                method: 'GET',
                url: '/api/playlist/' + playlistId
            })
            .then(function(resp) {
                return resp.data.songs;
            });
    };

    var addSong = function(songData, playlistId) {
        return $http({
            method: 'POST',
            url: '/api/playlist/add/' + playlistId + '/' + songData.uri,
            data: songData
        });
    };

    var removeSong = function(songData, playlistId) {
        return $http({
            method: 'POST',
            url: '/api/playlist/remove/' + songData.playlistId + '/' + songData.songId,
        });
    };

    return {
        getQueue: getQueue,
        addSong: addSong,
        removeSong: removeSong
    };

})
// this is not needed due to the usage of facebook auth
// .factory('userDatabase', function($http) {
//     var signIn = function(userData) {
//         return $http({
//             method: 'POST',
//             url: '/api/user/signin',
//             data: userData
//         })
//     }
//     var signUp = function(userData) {
//         return $http({
//             method: 'POST',
//             url: '/api/user/signup',
//             data: userData
//         })
//     }
//     var signedIn = function() {
//         return $http({
//                 method: 'GET',
//                 url: 'api/user/signedin'
//             })
//             .then(function(resp) {
//                 return resp.data
//             })
//     }

//     return {
//         signIn: signIn,
//         signUp: signUp,
//         signedIn: signedIn
//     }


// })
.factory('songDatabase', function($http) {
    var upVote = function(songId) {
        return $http({
            method: 'POST',
            url: '/api/song/<upvote></upvote>',
            data: {
                songId: songId
            },
             accept: 'application/json'
        });
    };

    var downVote = function(songId) {
        console.log(songId);
        return $http({
            method: 'POST',
            url: '/api/song/downvote',
            data: {
                songId: songId
            },
            accept: 'application/json'
        });
    };

    return {
        downVote: downVote,
        upVote: upVote
    };
});
