'use strict';

const playerBar = '.player';
const artistAlbumSep = '-';

Connector.playerSelector = '.listen-body';

Connector.trackSelector = '.player-title';

Connector.artistSelector = '.player-artist';

Connector.getAlbum = () => {
	const artistAlbumStr = $(Connector.trackArtSelector).attr('title');
	const [, album] = Util.splitString(artistAlbumStr, artistAlbumSep);

	return album;
};

Connector.trackArtSelector = '.listen-album img';

Connector.isTrackArtDefault = (url) => url.includes('default');

Connector.isPlaying = () => $(playerBar).hasClass('is-playing');
