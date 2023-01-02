'use strict';

Connector.playerSelector = '#player';

Connector.trackSelector = [
	'#player > div > div > div.playerInfo > div > div > h5 > a',
	'#player > div > div > div.playerInfo > div:nth-child(2) > h3 > a.title',
];

Connector.artistSelector = [
	'#player > div > div > div.playerInfo > div > div > h3 > a',
	'#player > div > div > div.playerInfo > div:nth-child(2) > h3 > a.name',
];

Connector.trackArtSelector = '#player > div > div > img';

Connector.isPlaying = () =>
	Util.hasElementClass(
		'#player > div > div > div.control-btns > mat-icon',
		'playing'
	) ||
	Util.getAttrFromSelectors(
		'#player > div > div > div.control-btns.extras > mat-icon.mat-icon.notranslate.playerControls.mat-icon-no-color',
		'data-mat-icon-name'
	) === 'pause';
