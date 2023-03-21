export {};

Connector.playerSelector = '#app-root';

Connector.applyFilter(MetadataFilter.getYoutubeFilter());

Connector.getArtistTrack = () => {
	const text = Util.getAttrFromSelectors(
		'meta[name="twitter:title"]',
		'content'
	);
	return Util.processYtVideoTitle(text);
};

Connector.pauseButtonSelector = 'button:contains(Pause Video)';
