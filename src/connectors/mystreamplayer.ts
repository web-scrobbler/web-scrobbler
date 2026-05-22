export {};

const filter = MetadataFilter.createFilter({
	track: [
		MetadataFilter.removeCleanExplicit,
		MetadataFilter.removeRemastered,
		MetadataFilter.removeVersion,
		MetadataFilter.removeLive,
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
	if (
		Connector.getTrack() === 'THIS STATION WILL CONTINUE AFTER THIS BREAK'
	) {
		return 'IsAd';
	}

	return null;
};

Connector.applyFilter(filter);
