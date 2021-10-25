'use strict';

const filter = new MetadataFilter({
	track: cleanupTrack,
	artist: cleanupArtist,
});

Connector.playerSelector = 'aside.player';
Connector.trackSelector = 'aside.player .player_subhead';
Connector.artistSelector = 'aside.player .player_subhead';
Connector.isPlaying = () => {
	return $('button.playPauseButton span.player-pause').hasClass('false');
};

Connector.onReady = Connector.onStateChanged;

Connector.applyFilter(filter);

function cleanupTrack(track) {
	// Extract a track title from a `Track by Artist` string.
	return track.replace(/^(.*?)\s(by)\s(.*?)$/s, '$1');
}

function cleanupArtist(artist) {
	// Extract the artist from a `Track by Artist` string.
	return artist.replace(/^(.*?)\s(by)\s(.*?)$/s, '$3');
}
