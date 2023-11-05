export {};

Connector.playerSelector = '#main';

Connector.artistSelector = 'p[class$=-player__artist]';

Connector.trackSelector = 'h3[class$=-player__song-name]';

Connector.trackArtSelector = 'img[class*=-player__album-cover]';

Connector.isTrackArtDefault = (url) =>
	Boolean(url?.includes('DefaultAlbumArt'));

Connector.isPlaying = () =>
	Util.getAttrFromSelectors(
		'div[class$=-stream-player] span[class$=-stream-player__play]',
		'title',
	) === 'Stop';
