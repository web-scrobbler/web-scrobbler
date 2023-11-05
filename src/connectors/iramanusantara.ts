export {};

Connector.playerSelector = '#seek';

Connector.artistSelector = '#player-music > div > span:nth-child(2)';

Connector.trackSelector = '#player-music > div > span:nth-child(1)';

// Album title is only available when track is played through the album page
Connector.albumSelector = 'h1:first-of-type';

Connector.trackArtSelector = '#player-music > span > img';

Connector.isPlaying = () => {
	return (
		Util.getAttrFromSelectors('#player-control button svg path', 'd') ===
		'M9 8v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z'
	);
};

Connector.currentTimeSelector = '#seek time:nth-of-type(1)';
Connector.durationSelector = '#seek time:nth-of-type(2)';
