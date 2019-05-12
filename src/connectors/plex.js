'use strict';

Connector.playerSelector = '[class^=ControlsContainer-controlsContainer]';

Connector.artistSelector = `${Connector.playerSelector} [class*=MetadataPosterTitle-title] > a:nth-child(1)`;

Connector.trackSelector = `${Connector.playerSelector} a[class*=MetadataPosterTitle-singleLineTitle]`;

// for watch-it-later videos
Connector.artistTrackSelector = `${Connector.playerSelector} [class*=MetadataPosterTitle-title]`;

Connector.applyFilter(MetadataFilter.getYoutubeFilter());

Connector.getTrack = () => {
	if (Connector.getArtist()) {
		return $(Connector.trackSelector).text();
	}
	return null;
};

Connector.albumSelector = `${Connector.playerSelector} [class*=MetadataPosterTitle-title] > a:nth-child(3)`;

Connector.trackArtSelector = `${Connector.playerSelector} [class^=PosterCardImg-imageContainer] div`;

Connector.playButtonSelector = `${Connector.playerSelector} [class^=plex-icon-player-play]`;

Connector.timeInfoSelector = `${Connector.playerSelector} [class^=DurationRemaining-container]`;

Connector.isPlaying = () => {
	return $(`${Connector.playerSelector} [data-qa-id="pauseButton"]`).length > 0;
};
