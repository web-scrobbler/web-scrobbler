'use strict';

const filter = new MetadataFilter({ artist: removeByPrefix });

Connector.playerSelector = '#root';

Connector.artistSelector = '.buIGi > div:nth-child(2)';

Connector.trackSelector = '.buIGi > div:nth-child(1)';

Connector.isPlaying = () => $('.icon-stop').length > 0;

Connector.applyFilter(filter);

function removeByPrefix(text) {
	return text.replace('By: ', '');
}
