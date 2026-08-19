export {};

/**
 * We use .player-bar as the main container because it wraps
 * both the controls (Play/Stop) and the metadata (.current-song).
 */
Connector.playerSelector = '.player-bar';

Connector.trackSelector = '.current-song .md-font';
Connector.artistSelector = '.current-song .sm-font';

// The first image inside .current-song is the album art (the second is the equalizer GIF)
Connector.trackArtSelector = '.current-song a > img';

Connector.isPlaying = () => {
	// The button has the class "stop" and the icon "icon-stop" when the radio is active.
	// When paused, it usually switches to "play" / "icon-play".
	return Util.hasElementClass('.player-bar .play', 'stop');
};

Connector.applyFilter(
	MetadataFilter.createFilter({
		track: [
			// Removing "currently playing" in case the text grabber picks up the GIF's alt text
			(text) => text.replace(/^currently playing/i, '').trim(),
		],
		artist: [
			// Optional: Clean up generic artist names if you want
			(text) => (text === 'Anonymus' ? 'Anonymous' : text),
		],
	}),
);
