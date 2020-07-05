/**
 * A connector is ready to scrobble tracks.
 */
export const Base = 'Base';

/**
 * A connector attached to a controller is disabled by a user.
 */
export const Disabled = 'Disabled';

/**
 * A scrobble service returned an error.
 */
export const Err = 'Error';

/**
 * A song was ignored by a scrobble service.
 */
export const Ignored = 'Ignored';

/**
 * A song info is being loaded.
 */
export const Loading = 'Loading';

/**
 * A song is now playing.
 */
export const Playing = 'Playing';

/**
 * A song is scrobbled.
 */
export const Scrobbled = 'Scrobbled';

/**
 * A user skipped a song.
 */
export const Skipped = 'Skipped';

/**
 * An unknown song is playing.
 */
export const Unknown = 'Unknown';

/**
 * A list of inactive modes.
 *
 * If a mode is not in this list, it means an active mode.
 */
const inactiveModes = [Base, Disabled];

/**
 * Check if a given mode is active.
 *
 * @param {String} mode Mode instance
 *
 * @return {Boolean} True if the mode is active; false otherwise
 */
export function isActiveMode(mode) {
	return !inactiveModes.includes(mode);
}

/**
 * Check if a given mode is inactive.
 *
 * @param {String} mode Mode instance
 *
 * @return {Boolean} True if the mode is inactive; false otherwise
 */
export function isInactiveMode(mode) {
	return inactiveModes.includes(mode);
}
