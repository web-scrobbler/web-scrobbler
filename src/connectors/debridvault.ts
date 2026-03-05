export {};

function playingAudioPlayer() {
	const audioPlayers = document.querySelectorAll('audio');

	for (const audioPlayer of audioPlayers) {
		if (!audioPlayer.paused) {
			return audioPlayer;
		}
	}

	return null;
}

Connector.useMediaSessionApi();
Connector.playerSelector = '.mini-player-padding';

Util.bindListeners(
	['audio'],
	['playing', 'pause', 'timeupdate'],
	Connector.onStateChanged,
);

Connector.getTimeInfo = () => {
	const audioPlayer = playingAudioPlayer();
	if (!audioPlayer) {
		return { duration: 0, currentTime: 0 };
	}

	return {
		duration: audioPlayer.duration,
		currentTime: audioPlayer.currentTime,
	};
};

Connector.trackArtSelector = 'img.object-cover';

Connector.isPlaying = () => {
	const audioPlayer = playingAudioPlayer();
	if (!audioPlayer) {
		return false;
	}

	return !audioPlayer.paused;
};
