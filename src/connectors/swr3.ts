export {};

Connector.playerSelector = '.audioplayer-ui';

Connector.artistSelector = 'dl.audioplayer-title dd:nth-of-type(2)';

Connector.trackSelector = 'dl.audioplayer-title dd:nth-of-type(1)';

Connector.isPlaying = () =>
	Util.getAttrFromSelectors(
		'.audioplayer-control[data-action=play]',
		'aria-pressed'
	) === 'true';
