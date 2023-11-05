export {};

const artistSelector = '.player__track-album [href*=artist]';
const timeInfoSelector = '.player__track-time-content';

Connector.playerSelector = '.player';

Connector.trackSelector = '.player__track-title';

Connector.albumSelector = '.player__track-album > a:nth-of-type(2)';

Connector.trackArtSelector = '.player__track-cover img';

Connector.playButtonSelector = '.pct-player-play';

Connector.getArtist = () => {
	const artists = document.querySelectorAll(artistSelector);
	return Util.joinArtists(Array.from(artists));
};

Connector.getTimeInfo = () => {
	const rawTimeInfo = Util.getTextFromSelectors(timeInfoSelector);
	return Util.splitTimeInfo(rawTimeInfo, '-');
};
