/**
 * This script runs in non-isolated environments (gensokyoradio.net) so that we
 * have access to the global `audio` player.
 */

interface GensokyoWindow {
	audio: HTMLAudioElement;
}

gensokyoSetupEventListener();

function gensokyoSendUpdateEvent(type: string) {
	window.postMessage(
		{
			sender: 'web-scrobbler',
			type,
			isPlaying: (window as unknown as GensokyoWindow).audio.paused
				? false
				: true,
		},
		'*',
	);
}

function gensokyoSetupEventListener() {
	const audio = (window as unknown as GensokyoWindow).audio;

	for (const e of ['play', 'pause', 'ended', 'emptied', 'suspend']) {
		audio.addEventListener(e, gensokyoSendUpdateEvent.bind(null, e));
	}
}
