export {};

Connector.playerSelector = 'body';

Connector.getTrackInfo = () => {
	const artistTrackElement = document.querySelector(
		'#nowplaying > table table tbody > tr:nth-of-type(3) font'
	);

	if (artistTrackElement && artistTrackElement.childNodes.length > 2) {
		return {
			artist: artistTrackElement.childNodes[1].textContent,
			track: artistTrackElement.childNodes[2].textContent?.substring(3), // omit dash and spaces
		};
	}

	return null;
};

Connector.trackArtSelector = '#bio .img-left-text img';

Connector.isPlaying = () =>
	Util.hasElementClass('#jp_container_1', 'jp-state-playing');

Connector.isScrobblingAllowed = () => Boolean(Connector.getTrackInfo());
