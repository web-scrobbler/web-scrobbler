export {};

function isMainPlayer() {
	return document.querySelector('#__nuxt') !== null;
}

function isEmbedPlayer() {
	return document.querySelector('.dashboard') !== null;
}

function setupMainPlayer() {
	Util.debugLog('main');
	Connector.playerSelector = '#__nuxt';
	Connector.isPlaying = () =>
		!document.querySelector<HTMLVideoElement>('#media-player')?.paused;
	Util.debugLog(`isPlaying=${Connector.isPlaying()}`);
	Connector.artistTrackSelector =
		'.fixed.w-full.bottom-0 .font-medium.truncate.hyphens-auto';
}

function setupEmbedPlayer() {
	Util.debugLog('embeded');
	Connector.playerSelector = '.dashboard';
	Connector.isPlaying = () =>
		!document.querySelector<HTMLAudioElement>('#audioPlayer')?.paused;
	Util.debugLog(`isPlaying=${Connector.isPlaying()}`);
	Connector.artistTrackSelector = '.dashboard-box__playing-song';
}

if (isMainPlayer()) {
	setupMainPlayer();
} else if (isEmbedPlayer()) {
	setupEmbedPlayer();
}

// TODO add podcasts
