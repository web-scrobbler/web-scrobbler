'use strict';

Connector.playerSelector = '#playPanel > .panel-inner';

Connector.artistSelector = '.artist';

Connector.trackSelector = '.songname';

Connector.getUniqueID = () => {
	let text = $('.songname').attr('href');
	return text.split('/').pop().split('?').shift();
};

Connector.getAlbum = () => {
	let album = $('.album-name a').text();
	return album.substr(1, album.length - 2);
};

Connector.trackArtSelector = '.album-wrapper img';

Connector.currentTimeSelector = '.curTime';

Connector.durationSelector = '.totalTime';

Connector.isPlaying = () => !$('.play').hasClass('stop');
