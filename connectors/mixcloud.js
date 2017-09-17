'use strict';

Connector.playerSelector = '.player-wrapper';

Connector.artistSelector = '.current-artist';

Connector.trackSelector = '.current-track';

Connector.isPlaying = () => $('.player-control').hasClass('pause-state');

Connector.isStateChangeAllowed = () => {
	// Mixcloud player hides artist and track elements while seeking the stream,
	// and we should not update state in such case.
	return Connector.getArtist() || Connector.getTrack();
};

Connector.filter = MetadataFilter.getTrimFilter().append({
	artist: [removeByPrefix, removeBuySuffix]
});

function removeByPrefix(text) {
	return text.replace('by ', '');
}

function removeBuySuffix(text) {
	return text.replace('  — Buy', '');
}
