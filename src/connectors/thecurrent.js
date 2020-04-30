'use strict';

const playerBar = '.player';
const trackArtSelector = '.listen-album img';
const artistAlbumSep = '-';

Connector.playerSelector = '.listen-body';

Connector.trackSelector = '.player-title';

Connector.artistSelector = '.player-artist';

Connector.getAlbum = () => {
	const artistAlbumStr = Util.getAttrFromSelectors(trackArtSelector, 'title');
	const [, album] = Util.splitString(artistAlbumStr, artistAlbumSep);

	return album;
};

Connector.trackArtSelector = trackArtSelector;

Connector.isTrackArtDefault = (url) => url.includes('default');

Connector.isPlaying = () => Util.hasElementClass(playerBar, 'is-playing');
