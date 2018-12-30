'use strict';

var reverse = false;
if ($('.player-station-title').text().includes('Qmusic')) {
	reverse = true;
}

Connector.playerSelector = '#jp_container_1';

Connector.getArtistTrack = function() {
	let artistTrack = $('#player-station-info').text();
	return Util.splitArtistTrack(artistTrack, [' - '], reverse);
};

Connector.playButtonSelector = '.player-equalizer';
