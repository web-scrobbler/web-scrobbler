export {};

/**
 * The FlaviBot web player remote-controls the bot in a Discord voice
 * channel, so no audio plays in the tab itself. The page fills the Media
 * Session API with title, artist and artwork, and its playback state,
 * which does not depend on the site's language.
 *
 * Position and duration come from the progress slider, in milliseconds.
 */
const progressSelector = '.mp-bar [role="slider"]';

Connector.playerSelector = '.mp-bar';

Connector.useMediaSessionApi();

Connector.isPlaying = () => navigator.mediaSession.playbackState === 'playing';

const getProgress = (attribute: string) => {
	const value = document
		.querySelector(progressSelector)
		?.getAttribute(attribute);
	return value ? Number(value) / 1000 : null;
};

Connector.getCurrentTime = () => getProgress('aria-valuenow');

Connector.getDuration = () => getProgress('aria-valuemax');
