'use strict';

Connector.playerSelector = '#music-player';

Connector.artistSelector = '#ArtistNameArea';

Connector.trackSelector = '#SongTitleArea';

Connector.getAlbum = () => {
	return $('#AlbumImgArea > img').attr('alt');
};

Connector.currentTimeSelector = 'span.fp-elapsed';

Connector.durationSelector = 'span.fp-remaining';

Connector.isPlaying = () => {
	let btn = $('.fp-playbtn').first();
	return btn.html() === '일시정지'; // if text '일시정지' in button, it means 'pause' because music is playing.
};

Connector.getTrackArt = () => {
	return `http:${$('#AlbumImgArea').find('img').attr('src')}`;
};
