export {};

Connector.playerSelector = '[class*="playBarContentWrapper"]';

Connector.playButtonSelector = `${Connector.playerSelector} [aria-label="play track"]`;

Connector.artistSelector = `${Connector.playerSelector} [class*="_artistName_"]`;

Connector.trackSelector = `${Connector.playerSelector} [class*="_trackTitle_"]`;

Connector.durationSelector = `${Connector.playerSelector} [class*="timestampEnd"]`;

Connector.currentTimeSelector = `${Connector.playerSelector} [class*="timestampStart"]`;

Connector.trackArtSelector =
	'[aria-label="View currently playing track"] div div:nth-child(2)';

const filter = MetadataFilter.createFilter({
	track: trimArtist,
});

Connector.applyFilter(filter);

function trimArtist(track: string): string {
	const separator = ' - ';
	const chunks = track.split(separator);
	const artist = Connector.getArtist();
	const trackArtist = chunks.shift();
	if (artist?.toLowerCase() === trackArtist?.toLowerCase()) {
		return chunks.join(separator);
	}
	return track;
}
