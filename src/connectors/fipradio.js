'use strict';

const filter = new MetadataFilter({ album: removeYear });

Connector.playerSelector = '#player-top';

Connector.artistSelector = '.playing-info .infos .author .name';

Connector.trackSelector = '.playing-info .infos .title';

Connector.albumSelector = '.playing-info .infos .album .name';

Connector.trackArtSelector = '.playing-info .cover .player_img';

Connector.isPlaying = () => {
	return $('#player-controls .play-stop button').hasClass('stop');
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
