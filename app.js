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
      data = response.tracks;
      $scope.tracks = data.items;
      console.log("response 1: " + response);
      console.log("data: " + data);
      $scope.artist = artist;
    });
  };

  $scope.getAlbums = function(artist) {
    var albumData;
    $scope.albums = [];
    $http.get(baseUrl + "artists/"+artist.id+"/albums?album_type=album").success(function(response) {
      albumData = response;
      console.log("Initial get: " + albumData);
      while(albumData.next != null) {
        $scope.albums.push(albumData.items);
        console.log($scope.albums);
        $http.get(albumData.next).success(function(response) {
          albumData = response;
          console.log("Nested get: " + albumData);
        });
      };
    });
    console.log($scope.albums);
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

