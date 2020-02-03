'use strict';

function setupConnector() {
	setupCommonProperties();
}

function setupCommonProperties() {

	Connector.playButtonSelector = '.playpause i';

	Connector.currentTimeSelector = '.player div.timing:not(.duration) div:last-child';

	Connector.durationSelector = '.player div.timing.duration div:last-child';

	Connector.playerSelector = '.navigation > .player';

	Connector.trackSelector = '.player .content .info .song-title';

	// let artistAlbum = $('.player .content .info .band-title').text();
	// let breakLoc = artistAlbum.indexOf('–');
	// let artistName = artistAlbum.substring(0,breakLoc);
	// let albumName = artistAlbum.substring((breakLoc + 1), (artistAlbum.length));

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
}

setupConnector();

