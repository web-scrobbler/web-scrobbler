export {};

const playerSelector = '[data-testid=player-container]';
const artistSelector = '[class*=styles__Artist-]';
const trackSelector = '[class*=styles__Track-]';
const filter = MetadataFilter.createFilter({
	artist: [removeByPrefix, removeBuySuffix],
});

Connector.playerSelector = playerSelector;

Connector.pauseButtonSelector = '[data-testid=player-play-button-Pause]';

Connector.isPodcast = () =>
	Boolean(!Util.isElementVisible([artistSelector, trackSelector]));

Connector.getTrackInfo = () => {
	const showSelector = '[data-testid=player-show-title]';
	const trackArtSelector = `${playerSelector} img`;
	const currentTimeSelector = '[data-testid=startTime]';
	const durationSelector = '[data-testid=endTime]';
	let artist = Util.getTextFromSelectors(artistSelector);
	let track = Util.getTextFromSelectors(trackSelector);
	let trackArt;
	let currentTime;
	let duration;

	if (Connector.isPodcast()) {
		artist = Util.getTextFromSelectors(`${playerSelector} p span`);
		track = Util.getTextFromSelectors(showSelector);
		trackArt = Util.extractImageUrlFromSelectors(trackArtSelector)?.replace(
			/(?<=\/)\d+x\d+(?=\/)/,
			'580x580', // larger image
		);
		currentTime = Util.getSecondsFromSelectors(currentTimeSelector);
		duration = Util.getSecondsFromSelectors(durationSelector);
	}

	return { artist, track, trackArt, currentTime, duration };
};

Connector.applyFilter(filter);

function removeByPrefix(text: string) {
	return text.replace(/^by\s/, '');
}

function removeBuySuffix(text: string) {
	return text.replace(/[\u2014-]\sbuy$/i, '');
}
