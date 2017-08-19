'use strict';

Connector.playerSelector = 'body';

Connector.artistSelector = '.artist-name';

Connector.trackSelector = '.artist-track';

Connector.playButtonSelector = '.fa-play';

Connector.trackArtSelector = '.artist-image img';

Connector.filter = MetadataFilter.getTrimFilter().append({
	artist: removeByPrefix
});

function removeByPrefix(text) {
	return text.replace('by: ', '');
}
