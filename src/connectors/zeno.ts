export {};

function isMainPlayer() {
	return document.querySelector('.player-sticky') !== null;
}

function isEmbedPlayer() {
	return document.querySelector('#audioPlayer') !== null;
}

// TODO add podcasts

function setupMainPlayer() {
	Connector.playerSelector = '.radio-main';
	Connector.playButtonSelector =
		'.radio-audio-control [\\[hidden\\]="radioPlayer.playing"]';
	Connector.trackSelector = '.radio-main .radio-song';
	Connector.artistSelector = '.radio-main .radio-artist';
}

function setupEmbedPlayer() {
	Connector.playerSelector = '.dashboard';
	Connector.isPlaying = () => !document.querySelector('audio')?.paused;
	Connector.trackSelector = '.dashboard-box__playing-song';
	Connector.artistSelector = '.dashboard-box__playing-artist';
}

if (isMainPlayer()) {
	setupMainPlayer();
} else if (isEmbedPlayer()) {
	setupEmbedPlayer();
}
