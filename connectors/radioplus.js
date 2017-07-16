'use strict';

Connector.playerSelector = '.audio-controller';

Connector.artistSelector = '.info .artist';

Connector.trackSelector = '.info .song';

Connector.isPlaying = () => {
	return $('.audio-controller .any-surfer').text() === 'Stop de radiospeler';
};
