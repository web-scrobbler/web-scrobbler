'use strict';

Connector.playerSelector = '.audio-player';

Connector.getTrack = () => {
	let text = $('#songdetails').text();
	return text ? text.replace(/(^Song Name : | - $)/g, '') : null;
};

Connector.getArtist = () => {
	let text = $('.music-title').contents().eq(2).text();
	return text ? text.replace(/^ Artist Name : /, '') : null;
};

Connector.timeInfoSelector = '.music-time';

Connector.playButtonSelector = '#play';
