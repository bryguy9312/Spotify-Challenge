var data;
var baseUrl = 'https://api.spotify.com/v1/';
var myApp = angular.module('myApp', []);
var my_client_id = '2f7669bd26b3464ab0dce79a233e1803';
var my_uri = "http://localhost:63342/Spotify-Challenge/index.html";


var myCtrl = myApp.controller('myCtrl', function($scope, $http) {
  //checks url for anything after a hash, hacky way of ensuring authorization is obtained
  if (document.location.hash == "") {
    window.location = 'https://accounts.spotify.com/authorize?client_id='+ my_client_id +'&redirect_uri=' + my_uri + '&response_type=token&state=123';
  }
  $scope.audioObject = {};
  $scope.getArtist = function() {
    $http.get(baseUrl + "search?type=artist&query=" + $scope.artist).success(function (response) {
      $scope.artists = response.artists.items;
    });
  };

  $scope.getTracks= function(artist){
    $http.get(baseUrl + "search?type=track&q= " + "+artist:" + artist).success(function(response) {
      $scope.tracks = response.tracks.items;
      console.log(response);
    });
    $scope.artist = artist;
  };

  $scope.checkArtist = function() {
    var filteredTracks = [];
    if ($scope.tracks == undefined)
      return [];
    console.log("track array inside function" + $scope.tracks.length);
    /*$.each($scope.tracks, function(singleTrack) {
      $.each(singleTrack.artists, function(d) {
        if ($scope.artist.toLowerCase() == d.toLowerCase())
          filteredTracks.add(d);
      });
    });*/

    for(i=0; i < $scope.tracks.length; i++) {
      var singleTrack = $scope.tracks[i];
      for (j=0; j < singleTrack.artists.length; j++) {
        console.log("user inputted artists: " +$scope.artist + " track artist: " + singleTrack.artists[j].name);
        if ($scope.artist.toLowerCase() == singleTrack.artists[j].name.toLowerCase()) {
          filteredTracks.push(singleTrack);
        }
      }
    }


    console.log(filteredTracks);
    return filteredTracks;
  };


  $scope.play = function(song) {
    if($scope.currentSong == song) {
      $scope.audioObject.pause();
      $scope.currentSong = false;
      return;
    }
    else {
      if($scope.audioObject.pause != undefined) $scope.audioObject.pause();
      $scope.audioObject = new Audio(song);
      $scope.audioObject.play();
      $scope.currentSong = song;
    }
  }
});

// Add tool tips to anything with a title property
$('body').tooltip({
    selector: '[title]'
});

