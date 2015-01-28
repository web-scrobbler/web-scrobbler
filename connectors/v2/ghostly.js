Connector.playerSelector = '#result';

Connector.artistSelector = 'dd.artist';

Connector.trackSelector = 'dd.track';

Connector.albumSelector = 'dd.album';

Connector.getCurrentTime = function() {
	return $('#info_position').text().split('/')[0].trim();
}

Connector.isPlaying = function() {
	return $('#play').hasClass('pause');
};
