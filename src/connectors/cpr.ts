export {};

const filter = MetadataFilter.createFilter({ album: removeAlbumPreface });

Connector.playerSelector = '[class*=audioPlayer__liveStream-]';

Connector.artistSelector = `${Connector.playerSelector} [class^=audioPlayerTitle__artist-]`;

Connector.trackSelector = `${Connector.playerSelector} [class^=liveStreamTitle__heading-]`;

Connector.getAlbum = () => {
	const albumText = Util.getTextFromSelectors(
		`${Connector.playerSelector?.toString()} [class^=liveStreamTitle__meta-]`,
	);

	if (
		albumText &&
		albumText.startsWith('Album:') &&
		!albumText.includes(': (Single)')
	) {
		return albumText;
	}

	return null;
};

Connector.pauseButtonSelector = `${Connector.playerSelector} [class^=playPauseButton__icon-][class*=playPauseButton__pause-]`;

Connector.scrobblingDisallowedReason = () =>
	Connector.getArtist() ? null : 'Other';

Connector.isStateChangeAllowed = () => Boolean(Connector.getTrack());

Connector.applyFilter(filter);

function removeAlbumPreface(text: string) {
	return text.replace(/^Album:\s/, '');
}
