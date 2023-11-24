export {};

interface Property {
	[key: string]: [
		string,
		(
			selectors: string | string[],
		) => (string | null) | (number | undefined),
	];
}

const props: Property = {
	getTrack: ['.radio-current-track', Util.getTextFromSelectors],
	getArtist: ['.radio-current-artist', Util.getTextFromSelectors],
	getDuration: ['.track-time-duration', Util.getSecondsFromSelectors],
	getCurrentTime: ['.track-time-position', Util.getSecondsFromSelectors],
	getTrackArt: ['.radio-current-cover', Util.extractImageUrlFromSelectors],
};

Connector.playerSelector = '.app-player';

for (const prop in props) {
	const [selector, fn] = props[prop];
	Object.defineProperty(Connector, prop, {
		value: () => fn(`${getCurrentContext()} ${selector}`),
	});
}

Connector.isPlaying = () =>
	Util.getDataFromSelectors('.app-player', 'status') === 'play';

Connector.isStateChangeAllowed = () => {
	const artist = Connector.getArtist();
	return artist !== null && artist !== 'Реклама';
};

function getCurrentContext(): string {
	const single = Util.hasElementClass(
		Connector.playerSelector,
		'single-player',
	);
	return single ? '.app-player-panel' : '#broadcast-panel';
}
