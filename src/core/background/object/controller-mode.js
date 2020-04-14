'use strict';

/**
 * A connector is ready to scrobble tracks.
 *
 * @type {String}
 */
const Base = 'Base';

/**
 * A connector attached to a controller is disabled by a user.
 *
 * @type {String}
 */
const Disabled = 'Disabled';

/**
 * A scrobble service returned an error.
 *
 * @type {String}
 */
const Err = 'Error';

/**
 * A song was ignored by a scrobble service.
 *
 * @type {String}
 */
const Ignored = 'Ignored';

/**
 * A song info is being loaded.
 *
 * @type {String}
 */
const Loading = 'Loading';

/**
 * A song is now playing.
 *
 * @type {String}
 */
const Playing = 'Playing';

/**
 * A song is scrobbled.
 *
 * @type {String}
 */
const Scrobbled = 'Scrobbled';

/**
 * A user skipped a song.
 *
 * @type {String}
 */
const Skipped = 'Skipped';

/**
 * An unknown song is playing.
 *
 * @type {String}
 */
const Unknown = 'Unknown';

/**
 * A list of inactive modes.
 *
 * If a mode is not in this list, it means an active mode.
 *
 * @type {Array}
 */
const inactiveModes = [Base, Disabled];

/**
 * Check if a given mode is active.
 *
 * @param  {String} mode Mode instance
 * @return {Boolean} True if the mode is active; false otherwise
 */
function isActiveMode(mode) {
	return !inactiveModes.includes(mode);
}

/**
 * Check if a given mode is inactive.
 *
 * @param  {String} mode Mode instance
 * @return {Boolean} True if the mode is inactive; false otherwise
 */
function isInactiveMode(mode) {
	return inactiveModes.includes(mode);
}

define(() => {
	return {
		Base, Disabled, Err, Ignored, Loading,
		Playing, Scrobbled, Skipped, Unknown,

		isActiveMode, isInactiveMode,
	};
});
