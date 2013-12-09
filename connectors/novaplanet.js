/*
 * Chrome-Last.fm-Scrobbler NovaPlanet.com
 *
 * Emmanuel Tabard 
 *  - http://www.webitup.fr 
 *  - http://www.lastfm.fr/user/Raildecom
 *  - https://github.com/etabard
 * 
 * Derived from Letournedisque.com  module
 */

/********* Configuration: ***********/

// changes to the DOM in this container will trigger an update.
watchedContainer = '.radio-radionova .ontheair';

// changes to the DOM in this container are due to play/pause/forward/back
playerMasterControl = '.radio-radionova .play_pause';

/**
 * Function that returns title and artist of current song.
 * Make best effort to get the full, untruncated values from the
 * main cloud player pane. But, the user may have navigated away
 * from that - if so, fall back to the (possibly truncated) values
 * in the bottom now playing pane.
 */
function titleAndArtist() {
  var currentSongArtist = $(watchedContainer).find('.ontheair-text .artist');
  var currentSongTrack = $(watchedContainer).find('.ontheair-text .title');
  return {
    title: currentSongTrack.text().trim(),
    artist: currentSongArtist.text().trim()
  }
}

/**
 * Takes raw string, checks that it is in the form "xx:xx", and
 * calculates and returns the number of seconds, otherwise returns
 * -1 indicating failure to parse.
 */
function parseTime (maybeTime) {
  if (typeof(maybeTime) == "string" && maybeTime.indexOf (":") > 0) {
    var timeArr = maybeTime.split(":");
    return parseInt(timeArr[0])*60 + parseInt(timeArr[1]);
  } else {
    return -1;
  }
}

function currentTimeAndTrackDuration () {
  // var currentSongTimes = $(watchedContainer).find('.duration').text().split('|');
  // return {
  //   currentTime: parseTime(currentSongTimes[0]),
  //   trackDuration: parseTime(currentSongTimes[1])
  // }
  return {
    currentTime: 5,
    trackDuration: 10
  }
}

function isPaused() {
  return $(playerMasterControl).find('.btn_play').is(":visible");
}

function isPlaying() {
  return $(playerMasterControl).find('.btn_pause').is(":visible");
}


/********* Connector: ***********/

var track = function(title, artist) {
  return title + " " + artist;
}

var songTrack = function (song) {
  return track(song.title, song.artist);
}

/**
 * Encapsulate some "private" state and functions,
 * present a "public" API.
 */
var module = function() {

  var resetState = function (track) {
    return {
      lastTrack : track,
      lock : false,
      scrobbled : false
    }
  }

  var initState = function() {
    return resetState ("");
  }

  var state = initState();

  var parseNewState = function() {
   var tAndA = titleAndArtist();
   var timeAndDuration = currentTimeAndTrackDuration();
    return {
      title: tAndA.title,
      artist: tAndA.artist,
      album: tAndA.album,
      currentTime: timeAndDuration.currentTime,
      duration: timeAndDuration.trackDuration,
      track: track(tAndA.title, tAndA.artist)
    }
  }

  var maybeScrobbled = function (scrobbledSong) {
    if (state.lastTrack == songTrack(scrobbledSong)) {
      state.scrobbled = true;
    } 
  }

  var update = function(newState) {
    console.log("submitting a now playing request. artist: " + newState.artist + ", title: " + newState.title + ", current time: " + newState.currentTime + ", duration: " + newState.duration);
    chrome.runtime.sendMessage({type: 'validate', artist: newState.artist, track: newState.title, album: newState.album}, function(response) {
      if (response != false) {
         chrome.runtime.sendMessage({type: 'nowPlaying', artist: newState.artist, track: newState.title, currentTime:newState.currentTime, duration: newState.duration, album: newState.album});
      } else { // on failure send nowPlaying 'unknown song'
         chrome.runtime.sendMessage({type: 'nowPlaying', duration: newState.duration});
      }
    });
    state = resetState(newState.track);
  }

  var isReadyToUpdate = function(newState) {
    return (isPlaying() && 
            newState.currentTime >= 0 && 
            newState.duration > 0 && 
            newState.track != "" && 
            newState.track != state.lastTrack);
  }

  var maybeUpdate = function() {
    var newState = parseNewState();
    if (isReadyToUpdate(newState)) {
      update(newState);
    } else {
      setTimeout(maybeUpdate, 1000);
    }
  }

  /**
   * Pause requests are ignored for a track that has already been
   * scrobbled. But a "reset" request forces a reset.
   */
  var cancelAndReset = function(force) {
    if (force || !(state.scrobbled)) {
      clearTimeout();
      state = initState();
      chrome.runtime.sendMessage({type: "reset"});
    }
  }

  var updateIfNotLocked = function() {
    if (!state.lock) {
      state.lock = true;
      setTimeout(maybeUpdate, 2000);
    }
  }

  /**
   * Here is the "public" API.
   */
  return {
    updateNowPlaying : function() {
      updateIfNotLocked();
    },
    pause : function() {
      cancelAndReset(false);
    },
    resume : function() {
      this.updateNowPlaying();
    },
    reset : function() {
      cancelAndReset(true);
    },
    /**
     * Handle confirmation of scrobble from main scrobbler.js
     */
    scrobbled : function (song) {
      maybeScrobbled(song);
    }
  }
}();

/**
 * Listen for requests from scrobbler.js
 */
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch(request.type) {
    case 'submitOK':
      // translate song from scrobbler.js to novaplanet.js - TODO Clean
      // this up re: "title" versus "track" confusion
      var novaplanetSong = {artist: request.song.artist, title: request.song.track};
      module.scrobbled(novaplanetSong);
      break;
    }
  }
);

/**
 * Run at startup
 */
$(function(){
  console.log("NovaPlanet module starting up");
  module.updateNowPlaying();
  
  $(watchedContainer).live('DOMSubtreeModified', function(e) {
    if ($(watchedContainer).length > 0) {
      module.updateNowPlaying();
      return;
    }
  });

  $(playerMasterControl).click( function(e) {
    if (isPaused()) {
      module.pause();
    } else if (isPlaying()) {
      module.resume();
    }
    return;
  });

  $(window).unload(function() {
    module.reset();
    return true;
  });
});
