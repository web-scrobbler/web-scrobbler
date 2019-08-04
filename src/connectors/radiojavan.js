'use strict';

Connector.playerSelector = '.webPlayer';

Connector.artistSelector = () => {
	let artist = $('.mainPanel .artist').attr('data');
	return artist;
};

Connector.trackSelector = () => {
	let track = $('.mainPanel .song').attr('data');
	console.log('track is ' + track);
	return track;
};

Connector.artistTrackSelector = () => {
	let track = $('.mainPanel .song').attr('data');
	let artist = $('.mainPanel .artist').attr('data');
	console.log('track is ' + track);
	return { artist, track };
};

Connector.playButtonSelector = '#mp3_play';

Connector.currentTimeSelector = '#mp3_position';

Connector.durationSelector = '#mp3_duration';

//
/*Connector.trackArtSelector = () => {
	let trackArt = (($('.webPlayer').find('.mainPanel')[0]).find('.artwork')[0]).find('img')[0];
	return trackArt;
};*/
