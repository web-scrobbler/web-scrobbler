export {};

Connector.playerSelector = '.pure-u-1';

Connector.artistSelector = `${Connector.playerSelector} h3`;

Connector.trackSelector = `${Connector.playerSelector} h2`;

Connector.trackArtSelector = `${Connector.playerSelector} .fullart`;

Connector.playButtonSelector = '#playpausebutton_playicon';

Connector.currentTimeSelector = '#timeelapsed';

Connector.remainingTimeSelector = '#timeremaining';

Connector.isPodcast = () => true;

const filter = MetadataFilter.createFilter({
	track: trimPodcaster,
});

Connector.applyFilter(filter);

function trimPodcaster(track: string) {
	const separator = ': ';
	const chunks = track.split(separator);
	const artist = Connector.getArtist();
	const trackArtist = chunks.shift();
	if (artist?.toLowerCase() === trackArtist?.toLowerCase()) {
		return chunks.join(separator);
	}
	return track;
}
