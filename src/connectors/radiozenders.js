'use strict';

let swapArtistTrack = false;
if ($('.player-station-title').text().includes('Qmusic')) {
	swapArtistTrack = true;
}

Connector.playerSelector = '#jp_container_1';

Connector.getArtistTrack = function() {
	let artistTrack = $('#player-station-info').text();
	return Util.splitArtistTrack(artistTrack, [' - '], {
		swap: swapArtistTrack
	});
};

Connector.isPlaying = () => {
	return $('#jp_container_1').hasClass('jp-state-playing');
};
