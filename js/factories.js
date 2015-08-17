angular.module('djBooth.factories', [])
.factory('searchSpotify', function ($http){
  // this is our factory function for getting data from spotify, this will be run when we type in the search field
  var getData = function(data){

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
      url: uri,
      Accept: "application/json"
    })
    .then(function(resp){
      var searchResults = resp.data;
    
      // Limit = # of search results per page, returned from spotify
      var limit = searchResults["tracks"]["limit"];
      // Array of track objects from search
      var items = searchResults["tracks"]["items"];

      var results = [];

      // Iterate through search results, 
      _.each(items, function(item){
        var entry = {
          "song_name": item["name"],
          "artists": [],
          "album_name": item["album"]["name"],
          "image": item["album"]["images"][2]["url"],
          "duration_ms": item["duration_ms"],
          "popularity": item["popularity"],
          "preview_url": item["preview_url"],
          "spotifyId": item["uri"]
        };
        _.each(item["artists"], function(artist){
          entry["artists"].push(artist["name"]);
        });
        console.log(entry)
        results.push(entry);
      });

      return results;
    })
  };

  return {
    getData: getData,
  }
})
.factory('databaseInteraction', function($http){

  // this is our get request to our db for the event's playlist
  var getPlaylist = function(playlistId){
    var uri = '/' + playlistId;
    return $http({
      method: 'GET',
      url: uri
    })
    .then(function(resp){
      console.log("Got playlist data: ", resp.data);
      return resp.data.songs;
    })
  };

  // this is the post request for adding songs to our db
  var addSong = function(playlistId, song){
    var uri = '/add/' + playlistId + '/' + song.uri;
    return $http({
      method: 'POST',
      url: uri,
      data: song
    })
  };

  // this function retrieve the next song in the db and
  // then removes from songs --> sends to played
  var getNext = function(playlistId){
    var songs = getPlaylist(playlistId);
    var nextUri = songs[0].uri;
    var uri = '/remove/' + playlistId + '/' + nextUri;
    return $http({
      method: 'POST',
      url: uri
    })
    .then(function(resp){
      $('#player').attr('src', 'http://www.youtube.com/embed/' + resp.data.uri);
      return resp.data;
    })
  };


  return {
    getPlaylist: getPlaylist,
    addSong: addSong,
    getNext: getNext
  }

})
