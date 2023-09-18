export {};

Connector.playerSelector = '#tgmp';
Connector.artistSelector = '.info .artist';
Connector.trackSelector = '.info .song';
Connector.trackArtSelector = '.cover img';

Connector.isPlaying = () => {
	return (
		Util.getAttrFromSelectors('.control a svg path', 'd') ===
		'M400 32c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48h-352c-26.5 0-48-21.5-48-48v-352c0-26.5 21.5-48 48-48h352z'
	);
};
