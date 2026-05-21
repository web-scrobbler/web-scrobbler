export {};

const filter = MetadataFilter.createFilter({
	track: [
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

Connector.isPlaying = () => Util.hasElementClass('#playbtn', 'jp-stopx');

Connector.applyFilter(filter);
