'use strict';

Connector.playerSelector = '#music-player';

Connector.artistSelector = '#ArtistNameArea';

Connector.trackSelector = '#SongTitleArea';

Connector.getAlbum = () => {
	return Util.getAttrFromSelectors('#AlbumImgArea > img', 'alt');
};

Connector.currentTimeSelector = 'span.fp-elapsed';

Connector.durationSelector = 'span.fp-remaining';

Connector.isPlaying = () => {
	// if text '일시정지' in button, it means 'pause' because music is playing.
	return Util.getTextFromSelectors('.fp-playbtn') === '일시정지';
};

Connector.trackArtSelector = '#AlbumImgArea img';
