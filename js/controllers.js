angular.module('djBooth.controllers', [])
    // controller for handling the search function

    .filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      items.forEach(function(item) {
        var itemMatches = false;

        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  }
})
    .controller('searchController', function($scope, $window, searchSpotify) {

        // the results array that houses the songs currently in the queue
        $scope.playList = [];

        $scope.results =[]
        $scope.result =[]
        //this function adds whichever song is clicked in the search field to the playlist 
        $scope.getSongs = function(reqString) {
          searchSpotify.getData(reqString).then(function(data){
            $scope.results = data;
          })
          .catch(function(err){
            console.error(err)
          })

          }
          $scope.selectSong = function(data){
            data.votes = 0;
            data.id = Math.random()
            console.log(data)
            $scope.playList.push(data)
          }
            // searchSpotify.getData(data)


                // the data will also need to be added to the db
                // we should probably not even have a $scope.results but actually just post this to the db via the server
                // on success to posting to the db we should do a get request and update the users view
  

        $scope.upVote = function() {
          console.log('upvote')

        }
        $scope.downVote = function() {
          console.log('downvote')
        }

    })
    // this is where the search field updates with data from spotify as you type, obviously this is not implemented and 
    // is placeholder code

    // This controller manages the spotify player widget (playing next song in queue)
    .controller('playerController', function($scope, $window, databaseInteraction){
      // retrieve the queue, which will be an array of objects
      var queue = databaseInteraction.getQueue;

      var currentSongIdx = 0;
      // grab uri of first song in queue
      if (queue.length > 0){
        $scope.uri = queue[currentSongIdx]["uri"];
      } else {
        console.log("Empty Queue");
      }

      $scope.playNext = function(){
        currentSongIdx++;
        $scope.uri = queue[currentSongIdx]["uri"];
        $("#widget").contents().find("div.play-pause-btn").click();
      };


    })






