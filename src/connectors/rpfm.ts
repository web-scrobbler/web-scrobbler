export {};

interface TrackInfo {
	[key: string]: string | number | null | undefined;
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
	track: ['.radio-current-track', Util.getTextFromSelectors],
	artist: ['.radio-current-artist', Util.getTextFromSelectors],
	duration: ['.track-time-duration', Util.getSecondsFromSelectors],
	currentTime: ['.track-time-position', Util.getSecondsFromSelectors],
	trackArt: ['.radio-current-cover', Util.extractImageUrlFromSelectors],
};

Connector.playerSelector = '.app-player';

Connector.getTrackInfo = () => {
	const data: TrackInfo = {};
	const context = getCurrentContext();
	for (const field in fields) {
		const [selector, fn] = fields[field];
		data[field] = fn(`${context} ${selector}`);
	}
	return data;
};

Connector.isPlaying = () =>
	Util.getDataFromSelectors('.app-player', 'status') === 'play';

function getCurrentContext(): string {
	const single = Util.hasElementClass(
		Connector.playerSelector,
		'single-player',
	);
	return single ? '.app-player-panel' : '#broadcast-panel';
}
