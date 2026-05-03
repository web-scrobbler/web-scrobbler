export {};

const filter = MetadataFilter.createFilter({
	artist: [removeByPrefix, removeBuySuffix],
});

Connector.playerSelector = '[data-testid="player-container"]';

Connector.playButtonSelector = '[data-testid="player-play-button-Play"]';
Connector.pauseButtonSelector = '[data-testid="player-play-button-Pause"]';

const trackArtSelector = `${Connector.playerSelector} img`;

const trackSelector = '[data-testid="player-show-title"]';
const artistSelector = `${Connector.trackSelector}+*`;

const currentTimeSelector = '[data-testid="startTime"]';
const durationSelector = '[data-testid="endTime"]';

Connector.getTrackInfo = () => {
	let artistText = Util.getTextFromSelectors('[class*=styles__Artist-]');
	let trackText = Util.getTextFromSelectors('[class*=styles__Track-]');
	let trackArtUrl;
	let currentTimeValue;
	let durationValue;
	let podcastBoolean;

	if (artistText && trackText) {
		podcastBoolean = false;
	} else {
		artistText = Util.getTextFromSelectors(artistSelector);
		trackText = Util.getTextFromSelectors(trackSelector);
		trackArtUrl = Util.extractImageUrlFromSelectors(
			trackArtSelector,
		)?.replace(/\/\d+x\d+(?=\/)/g, ''); // larger image path
		currentTimeValue = Util.getSecondsFromSelectors(currentTimeSelector);
		durationValue = Util.getSecondsFromSelectors(durationSelector);
		podcastBoolean = true;
	}

	return {
		artist: artistText,
		track: trackText,
		trackArt: trackArtUrl,
		currentTime: currentTimeValue,
		duration: durationValue ?? 0,
		isPodcast: podcastBoolean,
	};
};

Connector.applyFilter(filter);

function removeByPrefix(text: string) {
	return text.replace(/^by\s/g, '');
}

function removeBuySuffix(text: string) {
	return text.replace(/[\u2014-]\sbuy$/gi, '');
}
