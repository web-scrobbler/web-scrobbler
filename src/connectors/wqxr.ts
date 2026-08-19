export {};

// target the footer, all info is in there
Connector.playerSelector = '.nypr-player.is-audiostream';

Connector.playButtonSelector =
	'.nypr-player-controls [data-test-selector="listen-button"]';
Connector.isPlaying = () =>
	Util.hasElementClass(Connector.playButtonSelector, 'is-playing');

Connector.artistTrackSelector = '.nypr-player-track-info .text-crawl-scroll';

// on desktop: <a>SHOW</a> - ARTIST, TRACK...
// on mobile: ARTIST, TRACK... - <a>SHOW</a>
// during intermission: <a>SHOW</a>
Connector.getArtistTrack = () => {
	const artistTrackAndShow = Util.getTextFromSelectors(
		Connector.artistTrackSelector,
	);
	if (!artistTrackAndShow) {
		return;
	}

	const show = Util.getTextFromSelectors(
		`${Connector.artistTrackSelector} .nypr-player-link`,
	);
	if (!show) {
		return;
	}

	const [left, right] = artistTrackAndShow.split(' - ', 2);
	let artistTrack;
	if (left.trim() === show.trim()) {
		artistTrack = right;
	} else if (right.trim() === show.trim()) {
		artistTrack = left;
	}
	if (artistTrack) {
		return Util.splitArtistTrack(artistTrack, [', ']);
	}
};

// as of merging this code they haven't put the audio element back into the DOM tree
// with that this method call currently does nothing at time of writing.
Util.bindListeners(
	['audio'],
	['playing', 'pause', 'timeupdate'],
	Connector.onStateChanged,
);
