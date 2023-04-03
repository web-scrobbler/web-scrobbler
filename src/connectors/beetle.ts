export {};

Connector.playerSelector = '#player';

Connector.trackSelector = '.current .title a';

Connector.artistSelector = '.current .artist a';

Connector.getAlbum = () =>
	Util.getAttrFromSelectors('.current .album a', 'title');

Connector.trackArtSelector = '.current .album img';

Connector.playButtonSelector = '.control .play';

Connector.isPlaying = () => {
	return Util.getTextFromSelectors('.control .play title') === 'pause';
};

Connector.getUniqueID = () => {
	return Util.getAttrFromSelectors('.current .title a', 'href');
};

Connector.durationSelector = '.current .duration';
