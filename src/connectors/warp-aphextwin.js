'use strict';

const filter = new MetadataFilter({ artist: removeHeadingDash });
const trackSelector = '.current-track .js-current-track-title';

Connector.playerSelector = '.player';

Connector.trackSelector = trackSelector;

Connector.artistSelector = '.current-track .js-current-track-artist';

Connector.durationSelector = '.current-track .js-current-track-duration';

Connector.currentTimeSelector = '.current-time.js-current-time';

Connector.playButtonSelector = '.track-controls .js-play-track';

Connector.getAlbum = () => {
	const releasePath = Util.getAttrFromSelectors(trackSelector, 'href');
	const releaseSelector = `.track-list .track-release a[href="${releasePath}"]`;

	return Util.getAttrFromSelectors(releaseSelector, 'title');
};

Connector.applyFilter(filter);

function removeHeadingDash(text) {
	return text.replace(/^\s-\s/, '');
}
