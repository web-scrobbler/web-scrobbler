Connector.playerSelector = '#now-playing';

Connector.artistTrackSelector = '#now-playing > div.info-container > div.title-container > div';

Connector.currentTimeSelector = '#now-playing > div.info-container > div.timestamps > div.elapsed';

Connector.isPlaying = function() {
	return $('#now-playing > div.status').text() === 'now playing';
};
