'use strict';

Connector.playerSelector = '#playerContents';

Connector.artistSelector = '#songartist';

Connector.trackSelector = '#songtitle';

Connector.albumSelector = '#songalbum';

Connector.getTrackArt = () => {
	let trackArtUrl = $('#albumArtImg').attr('src');
	return trackArtUrl !== null ? `http:${trackArtUrl}` : null;
};

Connector.isPlaying = () => $('#playerPauseButton').length > 0;
