'use strict';

const filter = new MetadataFilter({ artist: removeByPrefix });

Connector.playerSelector = '#root';

Connector.artistSelector = '._2H2od > div:nth-child(2)';

Connector.trackSelector = '._2H2od > div:nth-child(1)';

Connector.isPlaying = () => $('.icon-stop').length > 0;

Connector.applyFilter(filter);

function removeByPrefix(text) {
	return text.replace('By: ', '');
}
