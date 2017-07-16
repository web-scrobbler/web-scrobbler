'use strict';

Connector.playerSelector = '.player-wrapper';

Connector.trackArtSelector = '.playing-cover img';

Connector.getTrack = () => {
	return $('.player-wrapper .middle>div:nth-child(2) a').first().text();
};

Connector.getArtist = () => {
	return $('.player-wrapper .link.artist-name').first().text();
};

Connector.getDuration = () => {
	let text = $('.time').text();
	return Util.stringToSeconds(text.substring(1));
};

Connector.isPlaying = () => {
	return $('.player-wrapper .buttons .icon-pause').length > 0;
};
