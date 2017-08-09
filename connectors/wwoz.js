'use strict';

Connector.playerSelector = '#player';

Connector.artistSelector = '#player .artist';

Connector.trackSelector = '#player .title';

Connector.isPlaying = () => $('#oz-audio-container').hasClass('jp-state-playing');

Connector.filter = new MetadataFilter({
	track: cleanTrack,
	all: MetadataFilter.trim
});

function cleanTrack(track) {
	// stripping WWOZ's double quotes around name
	track = track.replace(/"(.+?)"/g, '$1');
	// [whatever]
	track = track.replace(/\s*\[[^\]]+\]$/, '');
	// (whatever version)
	track = track.replace(/\s*\([^)]*version\)$/i, '');

	return track;
}
