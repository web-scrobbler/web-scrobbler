export {};

Connector.playerSelector = '#game-area';

Connector.artistSelector = '#lyrics-info h2';

Connector.trackSelector = '#lyrics-info h1';

Connector.playButtonSelector = '#pause-menu';

Connector.getUniqueID = () => {
	const videoUrl = Util.getAttrFromSelectors('#video-player', 'src');
	return Util.getYtVideoIdFromUrl(videoUrl);
};
