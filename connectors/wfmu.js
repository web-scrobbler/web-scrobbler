'use strict';

Connector.playerSelector = '#mep_0';

Connector.artistSelector = '#current-title';

Connector.trackSelector = '#current-title';

Connector.isPlaying = () => $('.mejs-playpause-button').hasClass('mejs-pause');

Connector.filter = new MetadataFilter({
	track: cleanupTrack,
	artist: cleanupArtist,
	all: MetadataFilter.trim
});

function cleanupTrack(track) {
	// extract track from a "track" by artist
	track = track.replace(/(\")(.*)(\")( by )(.*)/g, '$2');

	return track;
}

function cleanupArtist(artist) {
	// extract artist from a "track" by artist
	artist = artist.replace(/(\")(.*)(\")( by )(.*)/g, '$5');

	return artist;
}
