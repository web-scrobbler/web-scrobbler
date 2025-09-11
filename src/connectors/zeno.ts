// TODO add podcasts
export {};

function isMainPlayer() {
	return document.querySelector('#__nuxt') !== null;
}

function isEmbedPlayer() {
	return document.querySelector('.dashboard') !== null;
}

function setupMainPlayer() {
	Connector.playerSelector = '#__nuxt';
	Connector.isPlaying = () =>
		!document.querySelector<HTMLVideoElement>('#media-player')?.paused;
	Connector.artistTrackSelector =
		'.fixed.w-full.bottom-0 .font-medium.truncate.hyphens-auto';
	Util.debugLog(`Setup main player; isPlaying=${Connector.isPlaying()}`);
}

function setupEmbedPlayer() {
	Connector.playerSelector = '.dashboard';
	Connector.isPlaying = () =>
		!document.querySelector<HTMLAudioElement>('#audioPlayer')?.paused;
	Connector.artistTrackSelector = '.dashboard-box__playing-song';
	Util.debugLog(`Setup embedded player; isPlaying=${Connector.isPlaying()}`);
}

if (isMainPlayer()) {
	setupMainPlayer();
} else if (isEmbedPlayer()) {
	setupEmbedPlayer();
}
