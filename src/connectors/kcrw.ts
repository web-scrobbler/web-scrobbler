export {};

const filter = MetadataFilter.createFilter({
	artist: [removeShowName, replaceSmartQuotes],
	track: [
		removeSmartQuotes,
		replaceSmartQuotes,
		MetadataFilter.removeVersion,
		MetadataFilter.removeCleanExplicit,
	],
});

Connector.playerSelector = '.site-player'; // supports main and mini players

Connector.getTrackInfo = () => {
	const metaSelector = '.site-player .meta';
	const timeSelector = '.site-player .duration';
	const showNameText = Util.getTextFromSelectors(
		`${metaSelector} .show-name`,
	);
	const artistText = Util.getTextFromSelectors(
		`${metaSelector} .episode-name`,
	);
	const trackText = Util.getTextFromSelectors(`${metaSelector} .song-name`);

	if (
		Util.hasElementClass(metaSelector, 'music') &&
		trackText &&
		artistText !== '[BREAK]'
	) {
		return {
			artist: artistText,
			track: trackText,
		};
	}

	if (
		!Util.hasElementClass(metaSelector, 'music') &&
		artistText &&
		showNameText === "Today's Top Tune"
	) {
		const artistTrackSplit = artistText.split(/\s+[-\u2013]\s+/);
		return {
			artist: artistTrackSplit[0],
			track: artistTrackSplit[1],
			currentTime: Util.getSecondsFromSelectors(
				`${timeSelector} .progress`,
			),
			duration: Util.getSecondsFromSelectors(`${timeSelector} .total`),
		};
	}

	return null;
};

Connector.isPlaying = () => Util.hasElementClass('button.play', 'active');

Connector.applyFilter(filter);

function removeShowName(text: string) {
	// filter for Today's Top Tune
	return text.replace(/Today('|\u2019)s Top Tune:\s+/, '');
}

function removeSmartQuotes(text: string) {
	// filter for Today's Top Tune
	return text.replace(/^[\u2018\u201c](.+)[\u2019\u201d](?=\s\(|$)/, '$1');
}

function replaceSmartQuotes(text: string) {
	return text.replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"');
}
