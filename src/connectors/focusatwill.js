'use strict';

Connector.playerSelector = '#root';

Connector.artistSelector = '._2H2od > div:nth-child(2)';

Connector.trackSelector = '._2H2od > div:nth-child(1)';

Connector.isPlaying = () => $('.icon-stop').length > 0;

Connector.filter = new MetadataFilter({
	all: MetadataFilter.trim,
	artist: removeByPrefix
});

function removeByPrefix(text) {
	return text.replace('By: ', '');
}
