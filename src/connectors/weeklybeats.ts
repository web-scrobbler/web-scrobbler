export {};

Connector.playerSelector = '#jplayer';

Connector.trackSelector = '#jplayer .jp-selected-title a';

Connector.pauseButtonSelector = '#jplayer .jp-pause';

Connector.currentTimeSelector = '#jplayer .jp-current-time';

Connector.durationSelector = '#jplayer .jp-duration';

// Artist is the first text node in the title, minus the ": " before the title.
Connector.getArtist = () => {
	const elements = Util.queryElements('#jplayer .jp-selected-title');
	if (!elements) {
		return null;
	}
	for (const element of elements) {
		for (const child of element.childNodes) {
			if (child.nodeType === Node.TEXT_NODE) {
				const match = (child as Text).wholeText.match(
					/^(?<artist>.+):\s*$/,
				);
				if (match?.groups?.artist) {
					return match.groups.artist;
				}
			}
		}
	}
	return null;
};

// Return the AWS file path.
Connector.getUniqueID = () => {
	const src = Util.getAttrFromSelectors('#jplayer audio', 'src');
	if (!src) {
		return null;
	}
	const match = src.match(
		/^https:\/\/weeklybeats\.s3\.amazonaws\.com\/music\/(?<year>\d+)\/(?<id>[^/]+)\.(?<ext>[^.]{2,4})$/,
	);
	if (!match?.groups?.id) {
		return null;
	}
	return match.groups.id;
};
