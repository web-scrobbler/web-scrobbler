'use strict';

Connector.trackSelector = '.ciUSSE .gPGDMR';

Connector.playerSelector = '.ciUSSE';

Connector.getArtist = () => {
	let { artist } = getArtistAlbum();
	return artist;
};

Connector.getAlbum = () => {
	let { album } = getArtistAlbum();
	return album;
};

Connector.isPlaying = () => {
	return $('.ciUSSE .play').attr('title') === 'Пауза';
};

function getArtistAlbum() {
	let artistAlbumStr = $('.ciUSSE .kQZVFY').text();
	let [artist, album] = artistAlbumStr.split('•');

	return { artist, album };
}
