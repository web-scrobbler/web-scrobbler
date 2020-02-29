'use strict';

const filter = new MetadataFilter({
	artist: [removeByPrefix, removeBuySuffix]
});

const trackIconSelector = '[class*=RebrandPlayerSliderComponent__TrackIcon]';
const trackIconPausedClass = 'dvjoTG';

Connector.playerSelector = '[class*=playerQueue__PlayerWrapper]';

Connector.artistSelector = '[class*=RebrandPlayerSliderComponent__Artist]';

Connector.trackSelector = '[class*=RebrandPlayerSliderComponent__Track]';

Connector.isPlaying = () => {
	const trackIcon = $(trackIconSelector);
	return !trackIcon.hasClass(trackIconPausedClass);
};

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
