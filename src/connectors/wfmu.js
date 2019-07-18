'use strict';

function setupAudioPlayer() {
	const filter = new MetadataFilter({
		track: cleanupTrack,
		artist: cleanupArtist
	});

	Connector.playerSelector = '.audioplayer';

	Connector.artistSelector = '#current-title';

	Connector.trackSelector = '#current-title';

	Connector.isPlaying = () => $('.mejs-playpause-button').hasClass('mejs-pause');

	Connector.applyFilter(filter);
}

function setupArchivePlayer() {
	const filter = new MetadataFilter({
		track: cleanupTrack
	});

	Connector.playerSelector = '.archiveplayer';

	Connector.artistSelector = '#np-artist';

	Connector.trackSelector = '#np-song';

	Connector.isPlaying = () => $('.mejs-playpause-button').hasClass('mejs-pause');

	Connector.applyFilter(filter);
}



function cleanupTrack(track) {
	// extract track from a "track" by artist
	track = track.replace(/(")(.*)(")( by )(.*)/g, '$2');

	return track;
}

function cleanupArtist(artist) {
	// extract artist from a "track" by artist
	artist = artist.replace(/(")(.*)(")( by )(.*)/g, '$5');

	return artist;
}



function isAudioPlayer() {
	return $('body').hasClass('audioplayer');
}

function isArchivePlayer() {
	return $('body').hasClass('archiveplayer');
}

function setupConnector() {
	if (isArchivePlayer()) {
		setupArchivePlayer();
	} else if (isAudioPlayer()) {
		setupAudioPlayer();
	} else {
		Util.debugLog('WFMU connector: unknown player', 'warn');
	}
}

setupConnector();
