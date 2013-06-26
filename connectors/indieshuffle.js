/*
 * Chrome-Last.fm-Scrobbler indieshuffle.com Connector by tiii
 * v1.0, 09-05-2012
 */

var watchedContainer = "#now-playing";

var wait = false;
var song = {};

var extractDuration = function(context) {
  var duration = 0;

  var time = $('#time #jplayer_total_time').text().split(':');

  // if there are ever songs that take longer than
  // 1 day to play i'll be happy to update this line
  $.each(time, function(index) {
    var t = parseInt(time[index],10);
    if(index != time.length-1)
      duration += 60*t;
    else
      duration += t;
  });

  return duration;
};

var extractTitle = function(context) {
  var trackContainer = $('#now-playing-title a', context);
  
  var artist = $('strong',trackContainer).text();
  var track = trackContainer.text().substr(artist.length);

  return {
    artist: artist,
    track: track
  };
};

var updateNowPlaying = function() {
  var context = watchedContainer;

  var current = extractTitle(context);

  if((!song.artist && !song.track) ||
    song.artist !== current.artist ||
    song.track !== current.track) {
    song = current;
  }

  if(!song.duration || song.duration === 0) {
    song.duration = extractDuration(context);
  } else {
    if(!song.submitted) {
      song.submitted = true;

      chrome.extension.sendRequest({type: 'validate', artist: song.artist, track: song.track}, function(response) {
           
           if (response !== false) { // autocorrected song object
              chrome.extension.sendRequest({type: 'nowPlaying', artist: response.artist, track: response.track, duration: song.duration});
           } else {
              chrome.extension.sendRequest({type: 'nowPlaying', duration: song.duration});
           }

      });
    }
  }

  // reset wait
  wait = false;  
};

$(function(){
  
  $(watchedContainer).live('DOMSubtreeModified', function(e) {
    if(!wait) {
      wait = true;
      setTimeout(updateNowPlaying, 1000);
    }
  });

  $(window).unload(function() {      
    chrome.extension.sendRequest({type: 'reset'});
    return true;      
  });

});