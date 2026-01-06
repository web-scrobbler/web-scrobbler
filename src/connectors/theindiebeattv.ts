export {};

Connector.playerSelector = '#player';

Connector.pauseButtonSelector = '#player button.vjs-playing';

Connector.artistSelector = '#nowplaying .song-artist';

Connector.trackSelector = '#nowplaying .song-title';

// Duration is available in a `data-duration` attribute on #nowplaying.
Connector.getDuration = () => {
	const elements = Util.queryElements('#nowplaying');
	if (!elements) {
		return null;
	}
	for (const element of elements) {
		if (element.dataset.duration) {
			try {
				return parseFloat(element.dataset.duration);
			} catch {
				// Ignore, try next element, though there probably isn't one.
			}
		}
	}
	return null;
};
