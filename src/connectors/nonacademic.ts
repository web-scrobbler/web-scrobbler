export {};

Connector.playerSelector = '.audio-player-master-container';

Connector.getArtist = () => {
	return '𝙻ΛƬΣX 4000';
};

Connector.getTrack = () => {
	return Util.getAttrFromSelectors(
		'.js-audio-player[data-audio-active="true"]',
		'data-audio-title',
	);
};

Connector.getAlbum = () => {
	return Util.getAttrFromSelectors(
		'.js-audio-player[data-audio-active="true"]',
		'data-audio-album',
	);
};

Connector.getTrackArt = () => {
	const baseURL = Util.getAttrFromSelectors(
		'.js-audio-player[data-audio-active="true"]',
		'data-audio-cover',
	);
	if (baseURL) {
		return `https://nonacademic.net${baseURL}`;
	}
	return baseURL;
};

Connector.getUniqueID = () => {
	return Util.getAttrFromSelectors(
		'.js-audio-player[data-audio-active="true"]',
		'data-audio-src',
	);
};

Connector.getDuration = () => {
	return parseFloat(
		Util.getAttrFromSelectors(
			'.js-audio-player[data-audio-active="true"]',
			'data-audio-duration',
			'0',
		)!,
	);
};

Connector.getCurrentTime = () => {
	return parseFloat(
		Util.getAttrFromSelectors(
			'.js-audio-player[data-audio-active="true"]',
			'data-audio-current-time',
			'0',
		)!,
	);
};

Connector.isPlaying = () => {
	return (
		Util.getTextFromSelectors(
			'.js-audio-player[data-audio-active="true"] .audio-player-play',
		) === '||'
	);
};
