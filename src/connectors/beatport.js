'use strict';

const filter = new MetadataFilter({ track: removeOriginalMix });
const playerBar = '.Player__container';

Connector.playerSelector = playerBar;

Connector.artistSelector = `${playerBar} .track-artists`;

Connector.trackSelector = `${playerBar} .track-title__primary`;

Connector.playButtonSelector = `${playerBar} #Player__play-button`;

Connector.currentTimeSelector = '.Clock__played';

Connector.durationSelector = '.Clock__total';

Connector.trackArtSelector = '.Player__artwork-2';

Connector.getUniqueID = () => {
	const trackUrl = $(`${playerBar} .track-title a`).attr('href');
	return trackUrl.split('/').pop();
};

Connector.applyFilter(filter);

function removeOriginalMix(track) {
	const remixedBy = $(`${playerBar} .track-title__remixed`).text();
	if (remixedBy === 'Original Mix') {
		return track;
	}

	return `${track} (${remixedBy})`;
}
