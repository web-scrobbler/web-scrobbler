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

/*
 * Don't use `playerBarSelector` to get track art
 * in both normal and expanded players.
 */
Connector.trackArtSelector = '[class^=PosterCardImg-imageContainer] div';

Connector.timeInfoSelector = `${playerBarSelector} [class*=DurationRemaining-container]`;

Connector.getTrackArt = () => {
	let trackArtEl = $(`${playerBarSelector} [class^=PosterCardImg-imageContainer] div`);
	if (trackArtEl.length === 0) {
		trackArtEl = $('[class^=AudioVideoFullPlayer] [class^=PosterCardImg-imageContainer] div');
	}

	const elStyle = trackArtEl.css('background-image');
	return Util.extractUrlFromCssProperty(elStyle);
};

Connector.isPlaying = () => {
	return $(`${playerBarSelector} [data-qa-id="pauseButton"]`).length > 0;
};
