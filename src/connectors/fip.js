'use strict';

const filter = new MetadataFilter({ album: removeYear });

Connector.playerSelector = '#player-playing';

Connector.artistSelector = '#player-playing .author .name';

Connector.trackSelector = '#player-playing div.playing-info > div.infos > div.rows-container > div.title';

Connector.albumSelector = '#player-playing div.playing-info > div.infos > div.rows-container > div.album > span.name';

Connector.trackArtSelector = '#player-playing .player_img';

Connector.isPlaying = () => {
	return $('#player-playing .play-stop button').hasClass('stop');
};

Connector.applyFilter(filter);

/**
 * Remove year from album title.
 * @param  {String} text Album title
 * @return {String} Modified album title
 */
function removeYear(text) {
	return text.replace(/\(\d+\)$/g, '');
}
