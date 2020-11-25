'use strict';

const filter = MetadataFilter.createFilter({
	artist: [removeByPrefix, removeBuySuffix],
});

Connector.playerSelector = '[class*=playerQueue__PlayerWrapper]';

Connector.artistSelector = '[class*=PlayerSliderComponent__Artist]';

Connector.trackSelector = '[class*=PlayerSliderComponent__Track]';

Connector.playButtonSelector = '[aria-label=Play]';

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
	return text.replace(/[\u2014-]\sbuy$/gi, '');
}
