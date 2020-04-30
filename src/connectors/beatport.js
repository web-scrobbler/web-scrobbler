'use strict';

const filter = new MetadataFilter({ track: removeOriginalMix });
const playerBar = '.Player__container';
const remixedBySelector = `${playerBar} .track-title__remixed`;

Connector.playerSelector = playerBar;

Connector.artistSelector = `${playerBar} .track-artists`;

Connector.trackSelector = `${playerBar} .track-title__primary`;

Connector.playButtonSelector = `${playerBar} #Player__play-button`;

Connector.currentTimeSelector = '.Clock__played';

Connector.durationSelector = '.Clock__total';

Connector.trackArtSelector = '.Player__artwork-2';

Connector.getUniqueID = () => {
	const trackUrl = Util.getAttrFromSelectors(`${playerBar} .track-title a`, 'href');
	return trackUrl.split('/').pop();
};

Connector.applyFilter(filter);

function removeOriginalMix(track) {
	const remixedBy = Util.getTextFromSelectors(remixedBySelector);
	if (remixedBy === 'Original Mix') {
		return track;
	}

	return `${track} (${remixedBy})`;
}
