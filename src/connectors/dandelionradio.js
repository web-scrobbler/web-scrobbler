'use strict';

Connector.playerSelector = 'body';

Connector.getArtistTrack = () => {
	let artistTrack = $('#nowplaying > table > tbody > tr > td > table:nth-child(1) > tbody > tr:nth-child(3) > td').text();
	artistTrack = artistTrack.replace('Now Playing:', '');

	return Util.splitArtistTrack(artistTrack);
};

Connector.trackArtSelector = '#bio img';

Connector.isPlaying = () => $('#jp_container_1').hasClass('jp-state-playing');

Connector.isScrobblingAllowed = () => {
	let artistTrack = Connector.getArtistTrack();

	return artistTrack !== 'Dandelion Radio - next show on the hour';
};
