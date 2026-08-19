export {};

const filter = MetadataFilter.createFilter({
	track: [
		MetadataFilter.removeCleanExplicit,
		MetadataFilter.removeRemastered,
		MetadataFilter.removeVersion,
		MetadataFilter.removeLive,
		removeHotNewPrefix,
	],
});

Connector.playerSelector = '.jp-jplayer ~ .player';

Connector.trackSelector = '#song';

Connector.getArtist = () => {
	const artistElement = document.querySelector('#artist');

	if (artistElement) {
		return artistElement.firstChild?.textContent;
	}

	return null;
};

Connector.isPlaying = () =>
	Boolean(
		Util.getTextFromSelectors('#current-time')?.match(/\d+:\d+/) &&
			Util.hasElementClass('#playbtn', 'jp-stopx'),
	);

Connector.scrobblingDisallowedReason = () => {
	if (Connector.getTrack()?.match(/After This (Break|Message)/i)) {
		return 'IsAd';
	}

	return null;
};

Connector.applyFilter(filter);

function removeHotNewPrefix(track: string) {
	return track.replace(/^(Hot|new)-/, '');
}
