export {};

Connector.playerSelector = '.player-module';

Connector.trackSelector = '#songName';

Connector.artistSelector = '.singerName.fl>a';

Connector.albumSelector = '.albumName>a';

Connector.trackArtSelector = '.albumImg img';

Connector.playButtonSelector = '.icon-playbar-play';

Connector.currentTimeSelector = '.change-time';

Connector.durationSelector = '.all-time';

Connector.getUniqueID = () => {
	const text = document.location.hash.slice(1);
	return text.split('&')[0].split('=').at(-1);
};
