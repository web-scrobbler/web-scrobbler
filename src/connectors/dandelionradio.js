'use strict';

const filter = new MetadataFilter({ artist: removeNowPlaying });

Connector.playerSelector = 'body';

Connector.artistTrackSelector = '#nowplaying > table > tbody > tr > td > table:nth-child(1) > tbody > tr:nth-child(3) > td';

Connector.trackArtSelector = '#bio img';

Connector.isPlaying = () => {
	return Util.hasElementClass('#jp_container_1', 'jp-state-playing');
};

Connector.applyFilter(filter);

function removeNowPlaying(text) {
	return text.replace('Now Playing:', '');
}
