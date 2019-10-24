'use strict';

const filter = new MetadataFilter({
	artist: removeYearFromArtist
});

Connector.playerSelector = '.player';

Connector.artistSelector = '.playing-now .now-info-subtitle';

Connector.trackSelector = '.playing-now .now-info-title';

Connector.albumSelector = '.playing-now .now-info-details-value';

Connector.trackArtSelector = '.playing-now .playing-now-cover img';

Connector.isPlaying = () => {
	return $('.playing-now button.live-button').hasClass('pause');
};

Connector.applyFilter(filter);

function removeYearFromArtist(text) {
	let regexp = new RegExp(/\s+\(\d{4}\)(?=[^\s+(\d{4})]*$)/gm);
	return text.replace(regexp, '');
}
