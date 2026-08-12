export {};

const artistSelector = '.player__track-album [href*=artist]';
const timeInfoSelector = '.player__track-time-content';

Connector.playerSelector = '.ui-layout--root--panel-bottom';

Connector.trackSelector = '.player__track-overflow';

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
