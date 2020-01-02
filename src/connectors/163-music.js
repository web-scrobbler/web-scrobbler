'use strict';

const trackRegEx = new RegExp(String.fromCharCode(160), 'g');

Connector.playerSelector = '.m-playbar';

Connector.getTrackArt = () => {
	const src = $('.head.j-flag img').attr('src');
	return src.split('?').shift();
};

Connector.getTrack = () => {
	const track = $('.fc1').text();
	return track.replace(trackRegEx, ' ');
};

Connector.getArtist = () => $('.by span').attr('title');

Connector.playButtonSelector = '[data-action="play"]';

Connector.timeInfoSelector = '.time';

Connector.getUniqueID = () => $('.fc1').attr('href').split('id=').pop();
