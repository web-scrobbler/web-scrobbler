export {};

let currentArtist;
let currentTrack;

Connector.playerSelector = [
	'#react-content:not(.react-content--player-margin)',
];

Connector.getArtist = () => {
	// Check if svg g#Layer_2 exists
	const hasLayer2 = !!document.querySelector('svg path#Layer_2');

	if (hasLayer2) {
		currentArtist = document.querySelector(
			'.live-tracks-list .live-track:first-child h2.live-track__artist-title',
		);
	} else {
		currentArtist = document.querySelector(
			'.episode-player-tracklist__track--is-playing div .episode-player-tracklist__artist',
		);
	}

	if (currentArtist) {
		return currentArtist.textContent.trim();
	}
};

Connector.getTrack = () => {
	// Check if svg g#Layer_2 exists
	const hasLayer2 = !!document.querySelector('svg path#Layer_2');

	if (hasLayer2) {
		currentTrack = document.querySelector(
			'.live-tracks-list .live-track:first-child span.live-track__song-title',
		);
	} else {
		currentTrack = document.querySelector(
			'.episode-player-tracklist__track--is-playing div .episode-player-tracklist__title',
		);
	}

	if (currentTrack) {
		return currentTrack.textContent.trim();
	}
};

Connector.isPlaying = () => {
	// Try multiple selectors for the play/stop button
	const playStopButton = document.querySelector(
		'button.live-channel--playing svg[class*="-icon"] title',
	);

	if (playStopButton) {
		const buttonState = playStopButton.textContent.trim();
		if (buttonState === 'Stop' || !buttonState) {
			return true; // Return true if not 'Play', false otherwise
		}
	}
};

Connector.scrobbleInfoLocationSelector = 'header.header';
Connector.scrobbleInfoStyle = {
	...Connector.scrobbleInfoStyle,
	fontSize: '0.8rem',
	marginTop: '0.25rem',
	width: '100%',
	maxWidth: '260px',
	fontFamily: 'Univers-Condensed,Arial,sans-serif',
	overflow: 'hidden',
	textAlign: 'right',
	display: 'inline-block',
	'box-orient': 'vertical',
	'-webkit-line-clamp': '2',
	'text-wrap': 'balance',
};
