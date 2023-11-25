export {};

interface TrackInfo {
	[key: string]: string | null | number | undefined;
}

interface Field {
	[key: string]: [
		string,
		(
			selectors: string | string[],
		) => (string | null) | (number | undefined),
	];
}

const fields: Field = {
	artist: ['span', Util.getTextFromSelectors],
	track: ['strong', Util.getTextFromSelectors],
	trackArt: ['img', Util.extractImageUrlFromSelectors],
};

Connector.playerSelector = '#playbar';

Connector.getTrackInfo = () => {
	const context: string = getCurrentContext();
	const trackInfo: TrackInfo = {};
	for (const field in fields) {
		const [selector, fn] = fields[field];
		trackInfo[field] = fn(`${context} ${selector}`);
	}
	return trackInfo;
};

Connector.isPlaying = () => {
	const href =
		Util.getAttrFromSelectors(
			'[data-player-target="playButtonIcon"]',
			'href',
		) ?? '';
	return ['#icon-pause', '#icon-stop'].includes(href);
};

Connector.isPodcast = () => Util.isElementVisible('[role="navigation"]');

function getCurrentContext() {
	const isVisible = Util.isElementVisible(
		'[data-player-target="playBarSecondaryContainer"]',
	);
	const kind = isVisible ? 'secondary' : 'primary';
	return `.c-playbar__${kind}`;
}
