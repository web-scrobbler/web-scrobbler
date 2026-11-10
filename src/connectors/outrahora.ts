export {};

/**
 * outrahora rádio ships two players that both fill the Media Session API:
 * the station site at radio.outrahora.com, and an embed bar injected on
 * every page of outrahora.com.
 *
 * The bar keeps its player inside a Shadow DOM and creates the audio
 * element with `new Audio()`, so it is reachable neither by
 * `document.querySelector('audio')` nor through the shadow root. Both
 * the audio listeners and the `paused` check only apply to the station
 * site; on the bar we fall back to the tab audible API.
 */
const isEmbedBar = window.location.hostname !== 'radio.outrahora.com';

if (isEmbedBar) {
	Connector.playerSelector = '#outrahora-radio-widget';

	Connector.useTabAudibleApi();
} else {
	Connector.playerSelector = '#playerView';

	Util.bindListeners(
		['audio'],
		['playing', 'pause', 'waiting'],
		Connector.onStateChanged,
	);

	Connector.isPlaying = () => !document.querySelector('audio')?.paused;
}

Connector.useMediaSessionApi();
