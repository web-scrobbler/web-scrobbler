'use strict';

const filter = new MetadataFilter({ artist: removeByPrefix });

Connector.playerSelector = 'body';

Connector.artistSelector = '.artist-name';

Connector.trackSelector = '.artist-track';

Connector.playButtonSelector = '.fa-play';

Connector.trackArtSelector = '.artist-image img';

Connector.applyFilter(filter);

function removeByPrefix(text) {
	return text.replace('by: ', '');
}
