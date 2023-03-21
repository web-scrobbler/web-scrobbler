export {};

function setupConnector() {
	if (isDefaultPlayer()) {
		setupDefaultPlayer();
	} else if (isH5Player()) {
		setupH5Player();
	} else {
		setupDayPlayer();
	}
}

function isDefaultPlayer() {
	return document.getElementsByClassName('playact').length > 0;
}

function isH5Player() {
	return Boolean(document.getElementById('bd-player'));
}

function setupDefaultPlayer() {
	Connector.playerSelector = '.playact';

	Connector.getUniqueID = () => Util.getValueFromSelectors('.playing input');

	Connector.trackSelector = '#songinfo .songtitle>a';

	Connector.artistSelector = '#songinfo .singer>a';

	Connector.albumSelector = '.album>a';

	Connector.trackArtSelector = '.albumpic img';

	Connector.playButtonSelector = '.pause';

	Connector.currentTimeSelector = '.playedtime';

	Connector.durationSelector = '.totaltime';
}

function setupDayPlayer() {
	Connector.playerSelector = '.player';

	Connector.trackSelector = 'dd>strong>a';

	Connector.artistSelector = 'dd>span:nth-child(3)>a';

	Connector.albumSelector = 'dd>span:nth-child(2)>a';

	Connector.trackArtSelector = '.album-pic img';

	Connector.playButtonSelector = '.status-pause';

	Connector.currentTimeSelector = '#time';

	Connector.durationSelector = '#duration';
}

function setupH5Player() {
	Connector.playerSelector = '#nowplaying';
	Connector.getUniqueID = () => Util.getDataFromSelectors('a.current', 'id');

	Connector.trackSelector = '#song-name';

	Connector.artistSelector = '#nowplay-singer';

	Connector.trackArtSelector = '#album-cover>img';

	Connector.playButtonSelector = '.song-play-status-play';

	Connector.currentTimeSelector = '#stime';

	Connector.durationSelector = '#etime';
}

setupConnector();
