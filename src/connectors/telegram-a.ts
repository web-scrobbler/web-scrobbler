export {};

Connector.playerSelector = '.header-tools';

Connector.playButtonSelector = '.player-button.play';

Connector.artistSelector = '.AudioPlayer-content .subtitle';

Connector.getArtistTrack = () => {
	const artist = Connector.getArtist();
	const track = Util.getTextFromSelectors('.AudioPlayer-content .title');
	if (!artist) {
		return Util.splitArtistTrack(track);
	}
	return { artist, track };
};

Connector.isStateChangeAllowed = () =>
	Connector.getArtist() !== 'Voice message';

const filter = MetadataFilter.createFilter({
	track: trimTrackSuffix,
});

Connector.applyFilter(filter);

function trimTrackSuffix(track: string): string {
	const index = track.lastIndexOf('.');
	if (index === -1) {
		return track;
	}
	return track.substring(0, index);
}
