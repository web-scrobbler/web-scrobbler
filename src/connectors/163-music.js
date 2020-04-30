'use strict';

const trackSelector = '.fc1';

Connector.playerSelector = '.m-playbar';

Connector.getTrackArt = () => {
	const src = Util.extractImageUrlFromSelectors('.head.j-flag img');
	return src && src.split('?').shift();
};

Connector.trackSelector = trackSelector;

Connector.getArtist = () => Util.getAttrFromSelectors('.by span', 'title');

Connector.playButtonSelector = '[data-action="play"]';

Connector.timeInfoSelector = '.time';

Connector.getUniqueID = () => {
	const trackUrl = Util.getAttrFromSelectors(trackSelector, 'href');
	return trackUrl && trackUrl.split('id=').pop();
};
