export {};

Connector.playerSelector = '#music-player';

Connector.artistSelector = '#ArtistNameArea';

Connector.trackSelector = '#SongTitleArea';

Connector.getAlbum = () => {
	return Util.getAttrFromSelectors('#AlbumImgArea > img', 'alt');
};

Connector.currentTimeSelector = 'span.fp-elapsed';

Connector.durationSelector = 'span.fp-remaining';

Connector.isPlaying = () => {
	const btn = document.querySelector('.fp-playbtn');
	return btn?.innerHTML === '일시정지'; // if text '일시정지' in button, it means 'pause' because music is playing.
};

Connector.trackArtSelector = '#AlbumImgArea img';
