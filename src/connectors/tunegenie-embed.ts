export {};

Connector.playerSelector = '#tgmp';
Connector.artistSelector = '.info .artist';
Connector.trackSelector = '.info .song';
Connector.trackArtSelector = '.cover img';

Connector.isPlaying = () => {
	return (
		Util.getAttrFromSelectors('.control a svg path', 'd') !==
		'M424.4 214.7c31.5 18.5 31.4 64.1 0 82.6l-352 208c-31.7 18.8-72.4-3.8-72.4-41.3v-416.1c0-41.8 43.8-58.2 72.4-41.3z'
	);
};
