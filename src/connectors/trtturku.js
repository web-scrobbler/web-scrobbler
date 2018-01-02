'use strict';

// Author: Oğuzhan TÜRK
// Scrobbling for: http://www.trtturku.net/

function toTitleCase(str) {
	let tempArray = str.toLowerCase().split(' ');
	let realArray = [];
	let i = 0;

	for (i = 0; i < tempArray.length; ++i) {
		let innerTempArray = tempArray[i].split('-');

		for (let j = 0; ;) {
			realArray.push(innerTempArray[j]);

			if (++j >= innerTempArray.length) {
				break;
			}

			realArray.push('-');
		}
	}

	for (i = 0; i < realArray.length; ++i) {
		realArray[i] = realArray[i].split('');
		realArray[i][0] = realArray[i][0] === 'i' ? 'İ' : realArray[i][0].toUpperCase();
		realArray[i] = realArray[i].join('');
	}

	return realArray.join(' ');
}

Connector.playerSelector = '.jwplayer';

Connector.isPlaying = () => $('.jwplay.jwtoggle').length === 1;

Connector.durationSelector = '.jwduration';

Connector.currentTimeSelector = '.jwelapsed';

Connector.filter = new MetadataFilter({
	all: [MetadataFilter.trim, toTitleCase]
});

function setupRadioPlayer() {
	Connector.artistSelector = '#besa_mp3_play_area tr:nth-child(2) > td:nth-child(2)';
	Connector.trackSelector = '#besa_mp3_play_area tr:nth-child(3) > td:nth-child(2)';
}

function setupPlaylistPlayer() {
	Connector.artistTrackSelector = '.jwitem.active .jwtitle';
}

function isRadioPlayer() {
	return $('#besa_mp3_play_area').length === 1;
}

function isPlaylistPlayer() {
	return $('.jwitem.active .jwtitle').length === 1;
}

function setupConnector() {
	if (isRadioPlayer()) {
		setupRadioPlayer();
	} else if (isPlaylistPlayer()) {
		setupPlaylistPlayer();
	}
}

setupConnector();
