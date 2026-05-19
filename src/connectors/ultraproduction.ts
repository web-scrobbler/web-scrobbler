export {};

/*
 * This connector covers radio stations from ULTRA Production, currently
 * Radio ULTRA, Наше Радио, RockFM and Radio JAZZ, which have the same player.
 */

Connector.playerSelector = '.player__container';

Connector.trackArtSelector = '.player__play';

Connector.artistSelector = '.player__current .player__artist';
Connector.trackSelector = '.player__current .player__song';

Connector.pauseButtonSelector = '.player__play.player__play_pause';

Connector.scrobblingDisallowedReason = () => {
	// not using Util.getTextFromSelectors here so that the station name
	// doesn't get uppercase'd (innerText vs textContent)
	const station = document.querySelector(
		'.player__current .player__radio',
	)?.textContent;

	if (station) {
		Connector.meta.label = station;
	}
	if (
		station?.toLowerCase().trim() ===
		Connector.getTrack()?.toLowerCase().trim()
	) {
		return 'FilteredTag';
	}

	return null;
};
