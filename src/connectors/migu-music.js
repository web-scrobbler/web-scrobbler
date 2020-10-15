'use strict';

Connector.playerSelector = '.mod-player';

Connector.trackSelector = '.song a';

Connector.artistSelector = '.singer a';

Connector.albumSelector = '.album a';

Connector.playButtonSelector = '.cf-player-play';

Connector.timeInfoSelector = '.current-time';

Connector.trackArtSelector = '.song-cover img';

Connector.getTrackArt = () => {
	const element = Util.queryElements(Connector.trackArtSelector);
	if (!element) {
		return null;
	}

	const trackArtUrl = element.attr('src');
	return Util.normalizeUrl(trackArtUrl);
};

Connector.isTrackArtDefault = (trackArtUrl) => {
	return trackArtUrl.includes('data:image/jpeg;base64');
};

Connector.getUniqueID = () => {
	return Util.getAttrFromSelectors('.J_OrderLink', 'data-id');
};
