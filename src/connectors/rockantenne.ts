export {};

const connectorLabel = Connector.meta.label;
Connector.playerSelector = '[data-abywebplayer]';

Connector.getArtistTrack = () => {
	// not useMediaSessionApi cause we don't want the "Album"
	if (!navigator.mediaSession.metadata) {
		return {};
	}
	const { artist, title } = navigator.mediaSession.metadata;
	return { artist, track: title };
};

Connector.isPlaying = () => {
	return Util.hasElementClass('[data-abywebplayer-play]', 'is-playing');
};

Connector.scrobblingDisallowedReason = () => {
	// album is the station name
	if (navigator.mediaSession.metadata?.album) {
		let station = navigator.mediaSession.metadata.album;
		if (!station.includes(connectorLabel)) {
			station = `${connectorLabel} ${station}`;
		}
		Connector.meta.label = station;
	} else {
		Connector.meta.label = connectorLabel;
	}

	return navigator.mediaSession.metadata?.artist?.includes(connectorLabel)
		? 'FilteredTag'
		: null;
};

Connector.unloveButtonSelector =
	'[data-abywebplayer-favorite] svg use[href*=favorite_filled]';
Connector.loveButtonSelector =
	'[data-abywebplayer-favorite]:not([disabled="true"]) svg use[href*=favorite_outline]';
