export {};

const PAUSE_ICON = 59802;

Connector.playerSelector = '.header-tools, .pinned-audio';

Connector.artistSelector =
	'.AudioPlayer-content > .subtitle, .pinned-audio-subtitle';

Connector.trackSelector = '.AudioPlayer-content > .title, .pinned-audio-title';

Connector.isPlaying = () =>
	Util.hasElementClass('.toggle-play.player-button', 'pause') ||
	Util.getTextFromSelectors('.pinned-audio-ico')?.charCodeAt(0) ===
		PAUSE_ICON;

Connector.isStateChangeAllowed = () =>
	!Util.isElementVisible(
		'.playback-button-inner, .pinned-audio-wrapper-utils button:nth-child(2) span',
	);
