export {};

Connector.playerSelector = '.music-box';

Connector.trackSelector = '.raga-name';

Connector.artistSelector = '.artist-name';

Connector.albumSelector = '.album-name';

Connector.currentTimeSelector = '.timer .clr-primary';

Connector.durationSelector = '.timer .clr-white';

Connector.isPlaying = () =>
	Util.getAttrFromSelectors('.play-btn-logo', 'src') ===
	'assets/images/pause.svg';
