export {};

interface Property {
	[key: string]: string;
}

const props: Property = {
	trackSelector: '.radio-current-track',
	artistSelector: '.radio-current-artist',
	trackArtSelector: '.radio-current-cover',
	durationSelector: '.track-time-duration',
	currentTimeSelector: '.track-time-position',
};

Connector.playerSelector = '.app-player';

for (const prop in props) {
	const selector = props[prop];
	Object.defineProperty(Connector, prop, {
		get: () => `${getCurrentContext()} ${selector}`,
	});
}

Connector.isTrackArtDefault = (url) => url?.includes('no-cover');

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
