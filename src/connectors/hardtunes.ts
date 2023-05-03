export {};

const trackSelector = '#jp_audio_0';

Connector.playerSelector = '.player-bar';

Connector.playButtonSelector = '#jplayer-play';

Connector.trackArtSelector = '#jp_poster_0';

Connector.getUniqueID = () => {
	const src = Util.getAttrFromSelectors(trackSelector, 'src');
	return src?.split('/').at(-1)?.split('.')[0];
};

Connector.getArtistTrack = () => {
	const title = Util.getAttrFromSelectors(trackSelector, 'title');
	return Util.splitArtistTrack(title, ['<br/>'], true);
};
