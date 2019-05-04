'use strict';

Connector.playerSelector = '.ludo-controller';

Connector.getArtistTrack = () => {
	const artistTrackWithTimecode = $('.pi-infobox__list-item.current').first();
	return Util.splitArtistTrack(artistTrackWithTimecode.text());
};

Connector.isPlaying = () => {
	return $('.ludo-bar__button--pause').length > 0;
};

Connector.applyFilter(new MetadataFilter({
	artist: removePrefix
}));

/**
 * Remove "♪ 15:31" from artist name.
 * @param  {String} text Input text
 * @return {String} Modified text
 */
function removePrefix(text) {
	return text.replace(/♪\s\d{1,2}:\d{1,2}/, '');
}
