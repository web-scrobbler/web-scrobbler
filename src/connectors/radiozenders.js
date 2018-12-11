'use strict';

Connector.playerSelector = '#jp_container_1';

Connector.getArtistTrack = function() {
	let artistTrack = $('#player-station-info').text();
	return Util.splitArtistTrack(artistTrack, [' - '], true);
};

Connector.isPlaying = () => $('.player-equalizer').is(':visible');
