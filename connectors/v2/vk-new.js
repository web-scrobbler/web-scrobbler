'use strict';

/* global Connector */

Connector.playerSelector = '#top_audio_player';

Connector.getArtist = function() {
  return $('[data-is-current="1"]').data('performer');
};

Connector.getTrack = function() {
  return $('[data-is-current="1"]').data('title');
};

Connector.getDuration = function() {
  return $('[data-is-current="1"]').data('duration');
};

Connector.isPlaying = function() {
  return $('#top_audio_player').hasClass('top_audio_player_playing');
};
