export {};

const topPlayerTrackSelector = '#top_player_track';
const trackHistorySelector = '.station-onair';

// Need to select also .station to cover popup where #top_player_track is outside of .player.
Connector.playerSelector = ['.player', 'body > .station'];

Connector.artistTrackSelector = topPlayerTrackSelector;

Connector.playButtonSelector = '.player .b-play';

const getArtistTrackFromTitle = Connector.getArtistTrack;

Connector.getArtistTrack = () => {
	const currentTrackUrl = document
		.querySelector(`${topPlayerTrackSelector} a`)
		?.getAttribute('href');
	const historyTrack = Array.from(
		document.querySelectorAll<HTMLAnchorElement>(
			`${trackHistorySelector} .track_history_item a`,
		),
	).find((link) => link.getAttribute('href') === currentTrackUrl);
	const artist = historyTrack?.querySelector('b')?.textContent?.trim();

	if (!historyTrack || !artist) {
		return getArtistTrackFromTitle();
	}

	const trackWithoutArtist = historyTrack.cloneNode(true) as HTMLElement;
	trackWithoutArtist.querySelector('b')?.remove();
	const track = trackWithoutArtist.textContent?.trim();

	return track ? { artist, track } : getArtistTrackFromTitle();
};

const trackHistory = document.querySelector(trackHistorySelector);
if (trackHistory) {
	new MutationObserver(Connector.onStateChanged).observe(trackHistory, {
		childList: true,
		subtree: true,
	});
}
