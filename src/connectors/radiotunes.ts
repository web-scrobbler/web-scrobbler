export {};

const playerBar = '#webplayer-region';
const trackArtSelectors = [
	// Radiotunes
	'#art',
	// DI
	'.track-region .artwork img',
];

const filter = MetadataFilter.createFilter({ artist: removeTrailingDash });

Connector.playerSelector = playerBar;

const artistSelector = '.artist-name';
Connector.artistSelector = artistSelector;

const trackSelector = '.track-name';
Connector.trackSelector = trackSelector;

Connector.playButtonSelector = '.icon-play';

Connector.currentTimeSelector = '.timeinfo .time';

Connector.durationSelector = '.timeinfo .total';

Connector.getTrackArt = () => {
	const trackArtUrl = Util.extractImageUrlFromSelectors(trackArtSelectors);
	if (trackArtUrl) {
		// Remove 'size' param
		return trackArtUrl.split('?')[0];
	}
	return null;
};

Connector.isPlaying = () => {
	return (
		Util.getAttrFromSelectors('#webplayer-region', 'data-state') ===
		'playing'
	);
};

Connector.applyFilter(filter);

function removeTrailingDash(text: string) {
	return text.replace(/\s-\s$/, '');
}

Connector.getOriginUrl = () => {
	let playerArtist = Util.getTextFromSelectors(artistSelector);
	const playerTitle = Util.getTextFromSelectors(trackSelector);
	// track info from page area
	const pageArtist = Util.getTextFromSelectors(
		'.now-playing-component__artist',
	);
	const pageTitle = Util.getTextFromSelectors(
		'.now-playing-component__title',
	);
	if (playerArtist !== null) {
		playerArtist = playerArtist.trim();
		if (playerArtist.endsWith(' -')) {
			playerArtist = playerArtist.substring(0, playerArtist.length - 2);
		}
	}
	// 	compare with player to make sure we are still on the page where the track originates
	if (playerArtist === pageArtist && playerTitle === pageTitle) {
		const url = new URL(document.location.href);
		return (
			url.origin +
			Util.getAttrFromSelectors('.now-playing-component__title', 'href')
		);
	}
	return document.location.href;
	// for testing:
	// + playerArtist + playerTitle + (playerArtist === pageArtist && playerTitle === pageTitle) + pageArtist + pageTitle;
};
