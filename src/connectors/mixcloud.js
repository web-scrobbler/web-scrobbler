'use strict';

const filter = new MetadataFilter({
	artist: [removeByPrefix, removeBuySuffix]
});

Connector.playerSelector = '.player-wrapper';

Connector.artistSelector = '.current-artist';

Connector.trackSelector = '.current-track';

Connector.isPlaying = () => $('.player-control').hasClass('pause-state');

Connector.isStateChangeAllowed = () => {
	/*
	 * Mixcloud player hides artist and track elements while seeking the stream,
	 * and we should not update state in such case.
	 */
	return Connector.getArtist() || Connector.getTrack();
};

Connector.applyFilter(filter);

function removeByPrefix(text) {
	return text.replace('by ', '');
}

function removeBuySuffix(text) {
	return text.replace(/[\u2014\u002d]\sbuy$/gi, '');
}
