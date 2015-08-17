var spotify = require('spotify-node-applescript');

module.exports = function(){
  var currentTrack;
  spotify.getTrack(function(err, track){
    currentTrack = track;
    console.log(currentTrack);
  });
  return currentTrack;
};