'use strict';

/* global Connector, MetadataFilter */

Connector.playerSelector = 'body';

Connector.artistTrackSelector = '.nav-wrapper span.title';

Connector.playButtonSelector = '.resume';

Connector.filter = new MetadataFilter({
	track: (text) => text.replace(/ \[.*/, '')
});
