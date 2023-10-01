export {};

Connector.playerSelector = '#main-content';

Connector.artistSelector = [
	'.playingNow div[class*="songArtist"]',
	'.view-liveMusicNow .artist',
];

Connector.trackSelector = ['.playingNow h3', '.view-liveMusicNow .title'];

Connector.albumSelector = [
	'.playingNow div[class*="songRelease"]',
	'.view-liveMusicNow .release',
];

Connector.isPlaying = () =>
	Util.hasElementClass(
		['#jwplayerDiv', '#radio-player4-player'],
		'jw-state-playing',
	);
