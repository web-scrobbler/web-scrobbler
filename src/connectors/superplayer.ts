export {};

Connector.playerSelector = '#content';

Connector.artistSelector = '[data-value=artist]';

Connector.trackSelector = '[data-value=name]';

Connector.isPlaying = () =>
	!Util.hasElementClass('[data-action="pause"]', 'active');
