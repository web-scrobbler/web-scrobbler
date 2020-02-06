'use strict';

Connector.currentTimeSelector = '.player div.timing:not(.duration) div:last-child';

Connector.durationSelector = '.player div.timing.duration div:last-child';

Connector.playerSelector = '.navigation > .player';

Connector.trackSelector = '.player .content .info .song-title';

Connector.getAlbum = () => {
	const artistAlbum = $('.player .content .info .band-title').text();
	const albumName = artistAlbum.substring(artistAlbum.indexOf('–') + 1, artistAlbum.length);
	return albumName;
};

Connector.getArtist = () => {
	const artistAlbum = $('.player .content .info .band-title').text();
	const artistName = artistAlbum.substring(0, artistAlbum.indexOf('–'));
	return artistName;
};
Connector.isPlaying = () => {
	return $('.playpause .fas.fa-pause').length;
};
