
Connector.playerSelector = '#playing';

Connector.artistSelector = '#playing h2';

Connector.trackSelector = '#playing h3';

Connector.isPlaying = function () {
	return !$('#controls a[title=Play] i').is(':visible');
};
