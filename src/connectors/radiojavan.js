'use strict';

Connector.playerSelector = '.webPlayer';

Connector.artistSelector = () => {
	var artist = $('.mainPanel .artist').attr('data');
	return artist;
};

Connector.trackSelector = () => {
	var track = $('.mainPanel .song').attr('data');
	return track;
};

Connector.artistTrackSelector = () => {
	var track = $('.mainPanel .song').attr('data');
	var artist = $('.mainPanel .artist').attr('data');
	return { artist, track };
};

Connector.playButtonSelector = '#mp3_play';

Connector.currentTimeSelector = '#mp3_position';

Connector.durationSelector = '#mp3_duration';

Connector.trackArtSelector = () => {
	var trackArt = $('.mainPanel .artwork > img')[0];
	return trackArt;
};
