export {};

// theres no set selector to use here unfortunately.
Connector.playerSelector = 'body';

/**
 * @returns the wrapper of the player of the currently playing song.
 */
function getCurrentlyPlayingWrapper() {
	return document.querySelector('.active-player')?.closest('.project-player');
}

Connector.pauseButtonSelector = '.playing.active-player .btn-pause';
Connector.getTrack = () =>
	(getCurrentlyPlayingWrapper()?.querySelector('.name') as HTMLElement)
		?.innerText;

Connector.getArtist = () =>
	(getCurrentlyPlayingWrapper()?.querySelector('.artist-list') as HTMLElement)
		?.innerText;

Connector.getTrackArt = () =>
	getCurrentlyPlayingWrapper()
		?.querySelector('.cover-art')
		?.getAttribute('src');

Connector.getCurrentTime = () =>
	Util.stringToSeconds(
		(
			getCurrentlyPlayingWrapper()?.querySelector(
				'.current-time',
			) as HTMLElement
		)?.innerText,
	);

Connector.getDuration = () =>
	Util.stringToSeconds(
		(
			getCurrentlyPlayingWrapper()?.querySelector(
				'.duration',
			) as HTMLElement
		)?.innerText,
	);

Connector.isPlaying = () =>
	document.querySelector('.active-player')?.classList.contains('playing');
