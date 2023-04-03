export {};

const player = '.wyep-player';

Connector.playerSelector = player;

Connector.trackSelector = `${player} .wyep-player__title`;

Connector.pauseButtonSelector = `${player}.is-playing`;

Connector.getTrackInfo = () => {
	const artistAlbum = Util.getTextFromSelectors(
		`${player} .wyep-player__description`
	);
	return Util.splitArtistAlbum(artistAlbum, ['·']);
};
