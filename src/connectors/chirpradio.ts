export {};

Connector.playerSelector = '#jp_container_1';
Connector.trackSelector = 'span.song';
Connector.artistSelector = 'strong.artist';
Connector.albumSelector = 'em.album';
Connector.isPlaying = () =>
	Util.getCSSPropertyFromSelectors('.jp-play', 'display') === 'none';
