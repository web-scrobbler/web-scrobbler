'use strict';

/* global Connector */

Connector.delayLoadPlayerSelector = 1000;

Connector.playerSelector = '#d-now-playing';

var isPlayingLiveRadio = function() {
  if($('#d-secondary-control-left .disabled').size() == 1 && $('#d-secondary-control-right .disabled').size() == 1) {
    return 'true';
  } else {
    return 'false';
  }
}

Connector.getArtist = function() {
  if(isPlayingLiveRadio() === 'true') {
    var songTitle =  $('.d-queue-info .song-title').text();
    if(songTitle.indexOf("-") == -1) {
      //Maybe ad or program, so ignore
      return null;
    }
    var results = songTitle.split("-");
    return results[0].trim();
  }else {
    return $('#d-info-text .d-sub-text-1').text();
  }
};

Connector.getTrack = function() {
  if(isPlayingLiveRadio() === 'true') {
    var songTitle =  $('.d-queue-info .song-title').text();
    if(songTitle.indexOf("-") == -1) {
      //Maybe ad or program, so ignore
      return null;
    }
    var results = songTitle.split("-");
    return results[1].trim();
  }else {
    return $('#d-info-text .d-main-text').text();
  }
}

Connector.playButtonSelector = '#d-primary-control .play';
