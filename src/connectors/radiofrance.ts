export {};

const SEPARATOR = ' \u2022 ';

Connector.playerSelector = '#player';

Connector.isPlaying = () => {
	const text = Util.getTextFromSelectors('[data-testid="mainButton"]') ?? '';
	return ['STOP', 'PAUSE'].includes(text);
};

Connector.getArtistTrack = () => {
	const artist = Util.getTextFromSelectors('.Metadata .firstline');
	const track = Util.getTextFromSelectors('.Metadata .secondline');
	if (!hasSeparator(artist) && !hasSeparator(track)) {
		return { artist, track };
	}
	if (hasSeparator(track)) {
		return Util.splitArtistTrack(track, [SEPARATOR]);
	}
	const [trackAsArtist] = Util.splitString(artist, [SEPARATOR], true);
	return { artist: track, track: trackAsArtist };
};

Connector.getTrackArt = () =>
	Util.getAttrFromSelectors('.Cover picture source', 'srcset');

Connector.currentTimeSelector = '.time span:nth-child(1)';

Connector.durationSelector = '.time span:nth-child(3)';

const filter = MetadataFilter.createFilter({
	artist: trimPrefix,
});

Connector.applyFilter(filter);

function trimPrefix(artist: string): string {
	const chunks = artist.split(' \u2022 ');
	return chunks[chunks.length - 1];
}

function hasSeparator(text: string | null): boolean {
	return Boolean(text?.includes(SEPARATOR));
}
