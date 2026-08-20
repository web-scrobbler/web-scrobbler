export {};

const player = '#overlay-player';

Connector.playerSelector = player;

Connector.playButtonSelector = `${player} button .icon--play-wedge`;

Connector.getArtistTrack = () => {
	const artistTrack = Util.getTextFromSelectors(`${player} img + div > div`);

	return Util.splitArtistTrack(artistTrack, [' - '], true);
};

Connector.trackArtSelector = `${player} img`;

Connector.isTrackArtDefault = () =>
	Connector.getTrackArt()?.includes('blankart');

Connector.scrobblingDisallowedReason = () => {
	const artist = Connector.getArtistTrack()?.artist;
	const track = Connector.getArtistTrack()?.track;
	const station = Util.getTextFromSelectors(`${player} img + div > a`);

	if (artist?.includes('Live365') || track?.includes('Ad Break')) {
		return 'IsAd';
	}

	if (artist === station) {
		return 'FilteredTag';
	}

	return null;
};
