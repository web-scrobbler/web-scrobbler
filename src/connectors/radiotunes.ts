
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
	var ta = Util.getTextFromSelectors(artistSelector);
	var tt = Util.getTextFromSelectors(trackSelector);
	const pta = Util.getTextFromSelectors('.now-playing-component__artist');
	const ptt = Util.getTextFromSelectors('.now-playing-component__title');
	if (ta != null) {
		ta = ta.trim();
		if (ta.endsWith(' -')) {
			ta = ta.substring(0, ta.length-2);
		}
	}
	// 	compare with player to make sure we are still on the page where the track originates
	if (ta == pta && tt == ptt){
		const url = new URL(document.location.href);
		return url.origin + Util.getAttrFromSelectors('.now-playing-component__title', 'href');
	};
	return document.location.href;
	// + ta + tt + (ta == pta && tt == ptt) + pta + ptt;
};
