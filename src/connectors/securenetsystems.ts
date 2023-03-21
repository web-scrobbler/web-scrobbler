export {};

const songOnNow = '.songLineOnNow';

Connector.playerSelector = ['.playlistSongArea', '#playerDiv'];

Connector.artistSelector = [
	`${songOnNow} .songDetail .songArtist`,
	'#now-playing-artist',
];

Connector.trackSelector = [
	`${songOnNow} .songDetail .songTitle`,
	'#now-playing-title',
];

Connector.albumSelector = `${songOnNow} .songDetail .songAlbum`;

Connector.trackArtSelector = [
	`${songOnNow} img.songCover`,
	'#now-playing-album-art',
];

Connector.durationSelector = `${songOnNow} .songDuration`;

Connector.currentTimeSelector = `${songOnNow} .progressTime`;

Connector.isTrackArtDefault = (url) =>
	Boolean(url?.match(/album-art(-default)?.png$/));

Connector.isPlaying = () =>
	Util.isElementVisible(['.songPlaying .pauseButton', '#transport-pause']);
