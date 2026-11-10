export {};

Connector.playerSelector = '#live';

Connector.trackSelector = '#title';

Connector.artistSelector = '#composer';

Connector.playButtonSelector = '#live-play';

Connector.scrobblingDisallowedReason = () =>
	Util.isElementVisible('#song-info') ? null : 'Other';
