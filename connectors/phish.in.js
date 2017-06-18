'use strict';

Connector.playerSelector = '#player_container';

Connector.playButtonSelector = '#control_playpause';

Connector.isPlaying = function () {
	return $('#control_playpause').hasClass('playing');
};

Connector.getArtist = function () {
  return "Phish";
};

Connector.getTrack = function () {
  return $('#player_title').text();
};

Connector.getAlbum = function () {
  return $('#player_detail').text();
};
