export {};

function isMainPlayer() {
	return document.querySelector('#__next') !== null;
}

function isEmbedPlayer() {
	return document.querySelector('.dashboard') !== null;
}

// TODO add podcasts

function setupMainPlayer() {
	Util.debugLog('main');
	Connector.playerSelector = '.sticky.bottom-0.z-50';
	Connector.isPlaying = () => {
		// There seems to be some kind of race condition here because we should expect the <audio>.paused state to be inverted.
		// But that's how it works now and the play/pause button toggles the states correctly.
		return !!(
			document.querySelector('#audioPlayer') &&
			document.querySelector<HTMLAudioElement>('#audioPlayer')?.paused
		);
	};
	Util.debugLog(`isPlaying=${Connector.isPlaying()}`);
	Connector.artistTrackSelector = '#__next .block.text-sm.truncate';
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
