export {};

Connector.playerSelector = '.mod-player';

Connector.trackSelector = '.song a';

Connector.artistSelector = '.singer a';

Connector.albumSelector = '.album a';

Connector.playButtonSelector = '.cf-player-play';

Connector.timeInfoSelector = '.current-time';

Connector.trackArtSelector = '.song-cover img';

Connector.isTrackArtDefault = (trackArtUrl) => {
	return Boolean(trackArtUrl?.includes('data:image/jpeg;base64'));
};

Connector.getUniqueID = () => {
	return Util.getAttrFromSelectors('.J_OrderLink', 'data-id');
};
