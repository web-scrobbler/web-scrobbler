export {};

Connector.playerSelector = '.css-1r9ld1e';
Connector.trackSelector = '.css-172wbso';
Connector.artistSelector = '.css-dviazu a';
Connector.albumSelector = '.css-dsxfcy a';
Connector.trackArtSelector = '.css-8vylpa img';
Connector.isPlaying = () =>
	Util.getAttrFromSelectors('.css-147owcc button', 'aria-label') !== 'Play';
