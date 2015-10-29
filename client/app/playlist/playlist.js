angular.module('jibe.playlist', ['jibe.services'])

.config(['$sceDelegateProvider', function ($sceDelegateProvider) {
  // Whitelist YouTube uri's
  $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      'https://www.googleapis.com/youtube/v3/search?part=snippet&q=**',
      'http://www.youtube.com/embed/**',
  ]);
}])

.controller('PlaylistCtrl', function PlaylistCtrl($scope, $window, $location, searchYouTube, playlistDatabase, songDatabase) {

  // search functionality
  $scope.modalShown = false;
  $scope.toggleModal = function() {
    $scope.modalShown = !$scope.modalShown;
  };


  // the results array that houses the songs currently in the queue
  $scope.results = [];
  $scope.result = [];

  $scope.searchInput = "";

  $scope.getSongs = function(reqString) {
    searchYouTube.getData(reqString).then(function(data) {
      console.log(data);
      $scope.results = data;
    })
    .catch(function(err) {
      console.error(err);
    });
  };

  // the data will also need to be added to the db
  // we should probably not even have a $scope.results but actually just post this to the db via the server
  // on success to posting to the db we should do a get request and update the users view


  $scope.playList = [{
      title: "Katy Perry - Unconditionally (Official)",
      uri: "XjwZAa2EjKA",
      $$hashKey: "object:22",
      votes: 0,
      id: '12345'
  }];

  $scope.selectSong = function(song) {
    song.votes = 0;
    console.log(song);
    playlistDatabase.addSong(song, playListId).then(function() {
        $scope.playList = playlistDatabase.getQueue(playListId);

    });

    var iframe = document.getElementById('theIframe');
    iframe.src = 'http://www.youtube.com/embed/' + song.uri + '?autoplay=1';
    // playlistDatabase.addSong(song).then(function(data) {
    //         $scope.playList = playlistDatabase.getQueue();
    //     })
    //     .catch(function(err) {
    //         console.error(err)
    //     })
  };

  $scope.ended = function(){
    console.log('ended from controller');
  };


  $scope.upVote = function(song) {
    console.log('test');
    songDatabase.upVote(song).then(function(data) {
      console.log(data);
    });
  };

  // CONTROLLERS SHOULD POPULATE THE VIEW BASED ON THE FOLLOWING STRUCTURE

    $scope.playlistName = 'Metallic Gazelle';
    $scope.playlistLink = 'https://jibe.io/smitten-kitten';
    $scope.currentSong = {
        name: 'No Sleep',
        artist: 'Janet Jackson featuring Susan Sarandon',
        upvotes: 101,
        downvotes: 35,
        artwork: "assets/img/now-playing-img.jpg"
    };

    $scope.queue = [
        {
            name: "Haunted",
            artist: "Beyonce",
            upvotes: 14,
            downvotes: 80,
            artwork: "assets/img/now-playing-img.jpg",
            nominatedBy: "Susan Sarandon",
            isCollapsed: true,
            upvoters:[
                {
                    name: 'User1',
                    photo: 'assets/img/user1.jpg'
                },
                {
                    name: 'User2',
                    photo: 'assets/img/user2.jpg'
                },
                {
                    name: 'User3',
                    photo: 'assets/img/user3.jpg'
                },
                {
                    name: 'User4',
                    photo: 'assets/img/user4.jpg'
                },
                {
                    name: 'User5',
                    photo: 'assets/img/user5.jpg'
                },
                {
                    name: 'User6',
                    photo: 'assets/img/user6.jpg'
                }
            ],
            downvoters:[
                {
                    name: 'User7',
                    photo: 'assets/img/user7.jpg'
                },
                {
                    name: 'User8',
                    photo: 'assets/img/user8.jpg'
                },
                {
                    name: 'User9',
                    photo: 'assets/img/user9.jpg'
                },
                {
                    name: 'User10',
                    photo: 'assets/img/user10.jpg'
                },
                {
                    name: 'User11',
                    photo: 'assets/img/user11.jpg'
                },
                {
                    name: 'User12',
                    photo: 'assets/img/user12.jpg'
                }
            ]
        },
        {
            name: "Hang With Me",
            artist: "Robyn",
            upvotes: 20,
            downvotes: 300,
            artwork: "assets/img/expanded-artwork-img.jpg",
            nominatedBy: "Ben Biran",
            isCollapsed: true,
            upvoters:[],
            downvoters:[]
        }
    ];

  $scope.downVote = function(song) {
    console.log('test');
    songDatabase.upVote(song).then(function(data) {
        console.log(data);
    });
  };
})


.directive('modalDialog', function() {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true, // Replace with the template below
    transclude: true, // we want to insert custom content inside the directive
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      if (attrs.width)
        scope.dialogStyle.width = attrs.width;
      if (attrs.height)
        scope.dialogStyle.height = attrs.height;
      scope.hideModal = function() {
        scope.show = false;
      };
    },
    template: "<div class='ng-modal' ng-show='show'><div class='ng-modal-overlay' ng-click='hideModal()'></div><div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-close' ng-click='hideModal()'>X</div><div class='ng-modal-dialog-content' ng-transclude></div></div></div>"
  };
});
