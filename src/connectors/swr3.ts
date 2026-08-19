export {};

Connector.playerSelector = '.audioplayer-ui';

Connector.artistSelector = [
	// SWR3
	'dl.audioplayer-title dd:nth-of-type(2)',
	// All other SWR Stations (hosted under swr.de)
	'dl.audioplayer-info dd:nth-of-type(2)',
];

Connector.trackSelector = [
	// Same as above
	'dl.audioplayer-title dd:nth-of-type(1)',
	'dl.audioplayer-info dd:nth-of-type(1)',
];

Connector.isPlaying = () =>
	Util.getAttrFromSelectors(
		'.audioplayer-control[data-action=play]',
		'aria-pressed',
	) === 'true';
