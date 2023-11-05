export {};

const filter = MetadataFilter.createFilter({
	track: MetadataFilter.fixTrackSuffix,
	album: MetadataFilter.fixTrackSuffix,
});

Connector.applyFilter(filter);

const artistSelector = '.kzpiRD p:nth-child(2) a';

Connector.playerSelector = '.hOOKvw';

Connector.trackSelector = '.kzpiRD .oKpSL';

Connector.albumSelector = '.kzpiRD p:nth-child(3) a';

Connector.playButtonSelector = '.pretzel-icon-player_play';

Connector.trackArtSelector = '.rwQJb img';

Connector.currentTimeSelector = '.hcriLb p:nth-child(1)';

Connector.durationSelector = '.hcriLb p:nth-child(3)';

Connector.getArtist = () => getArtistsFromElement(artistSelector);

function getArtistsFromElement(selector: string) {
	const artistElements = document.querySelectorAll(selector);
	return Util.joinArtists(Array.from(artistElements));
}
