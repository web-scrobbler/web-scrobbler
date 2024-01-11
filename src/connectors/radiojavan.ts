export {};

const PLAY_ICON =
	'M28.228 18.327L12.205 27.31c-.99.555-2.205-.17-2.205-1.318V8.008c0-1.146 1.215-1.873 2.205-1.317l16.023 8.982c1.029.577 1.029 2.077 0 2.654z';

Connector.playerSelector = 'main';

Connector.artistSelector =
	'.items-start.truncate > div > div:nth-child(2) > p > span > a';

Connector.trackSelector =
	'.items-start.truncate > div > div:nth-child(1) > div > p > a';

Connector.currentTimeSelector = 'div.pr-2.-mb-1 > p';

Connector.trackArtSelector = 'div.w-16.h-16 > a > div > div > img';

Connector.isPlaying = () =>
	Util.getAttrFromSelectors(
		'.items-center > button:nth-child(3) > svg > path',
		'd',
	) !== PLAY_ICON;
