export {};

const titleContainer = '[class*=PlayerControlsMetadata]';

const plexFilter = MetadataFilter.createFilter({
	album: removeUnknownAlbum,
});

Connector.useMediaSessionApi();

Connector.playerSelector = [
	'[class^=PlayerContainer-container]',
    '[class^=Player-miniPlayerContainer]',
];

Connector.trackSelector = `${titleContainer} a[class*=MetadataPosterTitle]`;

Connector.albumSelector = `${titleContainer} [class*=MetadataPosterTitle-title] > a:nth-child(3)`;

Connector.artistSelector = `${titleContainer} [class*=MetadataPosterTitle-title] > a:nth-child(1)`;

Connector.timeInfoSelector = `${Connector.playerSelector} [class*=DurationRemaining-container]`;

Connector.trackArtSelector = [
	`${Connector.playerSelector} [class^=PosterCardImg-imageContainer] div`,
	'[class^=AudioVideoFullPlayer] [class^=PosterCardImg-imageContainer] div',
];

Connector.pauseButtonSelector = [
	`${Connector.playerSelector} [data-testid="pauseButton"]`,
	`${Connector.playerSelector} [class^=plex-icon-player-pause]`,
];

// For watch-it-later videos
Connector.artistTrackSelector = `${Connector.playerSelector} [class*=MetadataPosterTitle-title]`;

Connector.applyFilter(MetadataFilter.createYouTubeFilter().extend(plexFilter));

Connector.getTrack = () => {
	if (Connector.getArtist()) {
		return Util.getTextFromSelectors(Connector.trackSelector);
	}
	return null;
};

function removeUnknownAlbum(text: string) {
	return text.replace('[Unknown Album]', '');
}
