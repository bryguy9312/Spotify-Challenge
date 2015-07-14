var baseUrl = 'https://api.spotify.com/v1/';
var myApp = angular.module('myApp', []);
var my_client_id = '2f7669bd26b3464ab0dce79a233e1803';
var my_uri = "http://students.washington.edu/bwicker/info343/Spotify-Challenge/";

var myCtrl = myApp.controller('myCtrl', function($scope, $http) {
  $scope.name;
  //checks url for anything after a hash, hacky way of ensuring authorization is obtained
  if (document.location.hash == "") {
    window.location = 'https://accounts.spotify.com/authorize?client_id='+ my_client_id +'&redirect_uri=' + my_uri + '&response_type=token&state=123';
  }
  $scope.audioObject = {};
  $scope.artist = "Nirvana";
  $scope.getArtist = function() {
    $scope.albums = [];
    $scope.tracks = [];
    $scope.artists = [];
    $http.get(baseUrl + "search?type=artist&query=" + $scope.artist).success(function (response) {
      artists = response.artists.items;
      artists.forEach(function(d) {
        if (d.images[0] != null) {
          $scope.artists.push(d);
        };
      });
    });
  };
  $scope.getArtist();

  var getAlbumsHelper = function(page) {
    var albumData;
    $http.get(page.next).success(function(response) {
      albumData = response;
      albumData.items.forEach(function(d) {
        if (d.available_markets.indexOf("US") != -1) {
          $scope.albums.push(d);
        }
      });
      if (albumData.next != null) {
        getAlbumsHelper(albumData);
      }
    })
  };

  $scope.getAlbums = function(artist){
    var albumData;
    $scope.albums = [];
    $scope.tracks = [];
    $http.get(baseUrl + "artists/"+artist.id+"/albums?album_type=album").success(function(response) {
      albumData = response;
      if (response.items == null) {
        return;
      }
      albumData.items.forEach(function(d) {
        if (d.available_markets.indexOf("US") != -1) {
          $scope.albums.push(d);
        }
      });
      if(albumData.next != null) {
        getAlbumsHelper(albumData);
      }
    });
  };

  $scope.getTracks = function(albumLink) {
    console.log(albumLink);
    $http.get(albumLink).success(function(response) {
      $scope.tracks = response.tracks.items;
      console.log($scope.tracks);
    });
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

