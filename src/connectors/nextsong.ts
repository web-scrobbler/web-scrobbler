export {};

/**
 * NEXT fills the Media Session API with title, artist, album and artwork,
 * so track info comes from there.
 *
 * Duration and position are read from the page's <audio> element instead:
 * Media Session position state has no getter, and without a duration every
 * track would scrobble after 30 seconds. The player's prefetch elements are
 * created with `new Audio()` and never attached, so the only <audio> in the
 * document is the one that is actually playing.
 */
const getAudio = () => document.querySelector('audio');

Connector.playerSelector = 'body';

Connector.useMediaSessionApi();

Util.bindListeners(
	['audio'],
	['playing', 'pause', 'ended', 'durationchange'],
	Connector.onStateChanged,
);

Connector.isPlaying = () => {
	const audio = getAudio();
	return Boolean(audio && !audio.paused && !audio.ended);
};

Connector.getDuration = () => getAudio()?.duration;

Connector.getCurrentTime = () => getAudio()?.currentTime;

/**
 * The SAVE key reports its state through aria-pressed. During album
 * playback it saves the whole album rather than the playing track, so
 * love is only synced when it saves the song itself.
 */
Connector.isLoved = () => {
	const saveButton = document.querySelector('[data-save-target]');
	if (saveButton?.getAttribute('data-save-target') !== 'song') {
		return null;
	}
	return saveButton.getAttribute('aria-pressed') === 'true';
};
