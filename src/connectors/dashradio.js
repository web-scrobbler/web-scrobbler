'use strict';

Connector.playerSelector = '#music-dataview-container';

Connector.getArtist = () => {
	return Util.getTextFromSelectors('#artist-text').substring(3);
};

Connector.trackSelector = '#title-text';
