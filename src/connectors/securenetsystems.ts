export {};

const songOnNow = '.songDetails';

Connector.playerSelector = ['.playlistSongArea', '#playerDiv'];

Connector.artistSelector = [
	`${songOnNow} .songInfo .songArtist`,
];

Connector.trackSelector = [
	`${songOnNow} .songInfo .songTitle`,
];

Connector.albumSelector = `${songOnNow} .songInfo .songAlbum`;

Connector.trackArtSelector = [
	`${songOnNow} img.songCover`
];

Connector.getDuration = () => {
	const durationInSeconds = Util.getCSSPropertyFromSelectors('.progressBar', 'transition-duration')
	
	return Util.stringToSeconds(durationInSeconds);
};

Connector.currentTimeSelector = `.songTime .currentSec`;

Connector.isTrackArtDefault = (url) =>
	Boolean(url?.match(/album-art(-default)?.png$/));

Connector.isPlaying = () =>
	Util.isElementVisible(['.songPlaying .pauseButton']);
