'use strict';

const DNA_PREFIX = 'DNA Pizza Music Videos: ';

// The Artist+Track is displayed in the text of this Element
Connector.playerSelector = '#metadata';
Connector.artistTrack = '#metadata';

Connector.getArtistTrack = () => {
	let [artist, track] = $('#metadata').text().replace(DNA_PREFIX, '').split(' -- ');
	// dnalounge has optional (uncensored) text and the year in the track name.
	track = track.replace(' (uncensored)', '').replace(/ \([0-9]{4}\)[ ]*$/, '');
	return { artist, track };
};

Connector.isPlaying = () => {
	return ! $('.video_embed').hasClass('vjs-pause');
};
