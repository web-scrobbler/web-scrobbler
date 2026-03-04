export {};

Connector.playerSelector = ['main+div>div+div', 'main>div>div:last-child'];

Connector.currentTimeSelector = Connector.playerSelector[0] + '>div>span';
Connector.remainingTimeSelector =
	Connector.playerSelector[0] + '>div>span:last-child';

Connector.trackSelector = Connector.playerSelector[1] + ' h2';

Connector.getArtistTrack = () => {
	const text = Util.getTextFromSelectors(Connector.trackSelector)?.replace(
		/ \[.*/,
		'',
	);
	return Util.splitArtistTrack(text);
};

Connector.pauseButtonSelector = Connector.playerSelector[0] + ' .lucide-pause';

Connector.getUniqueID = () => {
	const videoUrl = Util.getAttrFromSelectors('iframe', 'src');
	return Util.getYtVideoIdFromUrl(videoUrl);
};

Connector.applyFilter(MetadataFilter.createYouTubeFilter());
