'use strict';

const trackRegEx = new RegExp(String.fromCharCode(160), 'g');

Connector.playerSelector = '.m-playbar';

Connector.getTrackArt = () => {
	let src = $('.head.j-flag img').attr('src');
	return src.split('?').shift();
};

Connector.getTrack = () => {
	let track = $('.fc1').text();
	return track.replace(trackRegEx, ' ');
};

Connector.getArtist = () => $('.by span').attr('title');

Connector.playButtonSelector = '.btns .ply';

Connector.timeInfoSelector = '.j-flag.time';

Connector.isPlaying = () => $('.btns .ply').hasClass('pas');

Connector.getUniqueID = () => $('.fc1').attr('href').substr(9);
