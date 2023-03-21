export {};

const filter = MetadataFilter.createFilter({
	artist: [removeByPrefix, removeBuySuffix],
});

Connector.playerSelector = '[class^=playerQueue__PlayerWrapper-]';

const trackInfoSelector = '[class^=PlayerSliderComponent__PlayerTrackInfo-]';

Connector.getTrackInfo = () => {
	const artistTrackElement = document.querySelector(trackInfoSelector);
	let artistText;
	let trackText;
	let trackArtUrl;
	let currentTimeValue;
	let remainingTimeValue;
	let podcastBoolean;

	if (artistTrackElement && artistTrackElement.hasChildNodes()) {
		artistText = Util.getTextFromSelectors(
			'[class*=PlayerSliderComponent__Artist-]'
		);
		trackText = Util.getTextFromSelectors(
			'[class*=PlayerSliderComponent__Track-]'
		);
		podcastBoolean = false;
	} else if (artistTrackElement && !artistTrackElement.hasChildNodes()) {
		artistText = Util.getTextFromSelectors(
			'[class^=PlayerControls__ShowOwnerName-]'
		);
		trackText = Util.getTextFromSelectors(
			'[class*=PlayerControls__ShowTitle-]'
		);
		trackArtUrl = Util.extractImageUrlFromSelectors(
			'[class^=PlayerControls__ShowPicture-] > img'
		)?.replace(/(?<=\/)\d+x\d+(?=\/)/g, '300x300'); // larger image path
		currentTimeValue = Util.getSecondsFromSelectors(
			'[class^=PlayerSliderComponent__StartTime-]'
		);
		remainingTimeValue = Util.getSecondsFromSelectors(
			'[class^=PlayerSliderComponent__EndTime-]'
		);
		podcastBoolean = true;
	}

	return {
		artist: artistText,
		track: trackText,
		trackArt: trackArtUrl,
		currentTime: currentTimeValue,
		duration: (currentTimeValue ?? 0) - (remainingTimeValue ?? 0),
		isPodcast: podcastBoolean,
	};
};

Connector.isPlaying = () =>
	Util.getAttrFromSelectors(
		'[class^=PlayButton__PlayerControl-]',
		'aria-label'
	) === 'Pause';

Connector.isStateChangeAllowed = () => {
	/*
	 * Mixcloud player hides artist and track elements while seeking the stream,
	 * and we should not update state in such case.
	 */
	return Boolean(
		Connector.getTrackInfo() && Util.isElementVisible(trackInfoSelector)
	);
};

Connector.isScrobblingAllowed = () => Connector.isStateChangeAllowed();

Connector.applyFilter(filter);

function removeByPrefix(text: string) {
	return text.replace(/^by\s/g, '');
}

function removeBuySuffix(text: string) {
	return text.replace(/[\u2014-]\sbuy$/gi, '');
}
