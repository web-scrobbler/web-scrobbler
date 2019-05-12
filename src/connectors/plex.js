'use strict';

const playerBarSelector = '[class^=ControlsContainer-controlsContainer]';

Connector.playerSelector = '[class^=AudioVideoPlayerView-container]';

Connector.artistSelector = `${playerBarSelector} [class*=MetadataPosterTitle-title] > a:nth-child(1)`;

Connector.trackSelector = `${playerBarSelector} a[class*=MetadataPosterTitle-singleLineTitle]`;

// for watch-it-later videos
Connector.artistTrackSelector = `${playerBarSelector} [class*=MetadataPosterTitle-title]`;

Connector.applyFilter(MetadataFilter.getYoutubeFilter());

Connector.getTrack = () => {
	if (Connector.getArtist()) {
		return $(Connector.trackSelector).text();
	}
	return null;
};

Connector.albumSelector = `${playerBarSelector} [class*=MetadataPosterTitle-title] > a:nth-child(3)`;

Connector.trackArtSelector = `${playerBarSelector} [class^=PosterCardImg-imageContainer] div`;

Connector.timeInfoSelector = `${playerBarSelector} [class*=DurationRemaining-container]`;

Connector.isPlaying = () => {
	return $(`${playerBarSelector} [data-qa-id="pauseButton"]`).length > 0;
};
