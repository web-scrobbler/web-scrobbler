'use strict';

/* global Connector */

Connector.playerSelector = '.infoContainer';

Connector.trackArtImageSelector = '.imgEl';


Connector.getTrack = function() {
	var res = /.*\s-\s(.*)/.exec($('.currentSong').text());
	return  res[1];
};

Connector.getArtist = function () {
	var res = /(.*)\s-\s/.exec($('.currentSong').text());
	return res[1];
};

Connector.isPlaying = function () {
	return $('.progressBg').width();
};
