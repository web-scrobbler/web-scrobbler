'use strict';

const titleContainer = '[class*=PlayerControlsMetadata]';

Connector.playerSelector = '[class^=AudioVideoPlayerView-container]';

Connector.trackSelector = `${titleContainer} a[class*=MetadataPosterTitle]`;

Connector.albumSelector = `${titleContainer} [class*=MetadataPosterTitle-title] > a:nth-child(3)`;

Connector.artistSelector = `${titleContainer} [class*=MetadataPosterTitle-title] > a:nth-child(1)`;

Connector.timeInfoSelector = `${Connector.playerSelector} [class*=DurationRemaining-container]`;

// @ifndef FIREFOX
// NOTE: Blob URLs used in Plex aren't supported by Firefox 67 and older.
Connector.getTrackArt = () => {
	let trackArtEl = $(`${Connector.playerSelector} [class^=PosterCardImg-imageContainer] div`);
	if (trackArtEl.length === 0) {
		trackArtEl = $('[class^=AudioVideoFullPlayer] [class^=PosterCardImg-imageContainer] div');
	}

	const elStyle = trackArtEl.css('background-image');
	return Util.extractUrlFromCssProperty(elStyle);
};
// @endif

Connector.isPlaying = () => {
	return $(`${Connector.playerSelector} [data-qa-id="pauseButton"]`).length > 0
		|| $(`${Connector.playerSelector} [class^=plex-icon-player-pause]`).length > 0;
};

// For watch-it-later videos
Connector.artistTrackSelector = `${Connector.playerSelector} [class*=MetadataPosterTitle-title]`;

Connector.applyFilter(MetadataFilter.getYoutubeFilter());

Connector.getTrack = () => {
	if (Connector.getArtist()) {
		return $(Connector.trackSelector).text();
	}
	return null;
};
