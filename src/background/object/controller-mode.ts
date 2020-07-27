export enum ControllerMode {
	/**
	 * A connector is ready to scrobble tracks.
	 */
	Base,

	/**
	 * A connector attached to a controller is disabled by a user.
	 */
	Disabled,

	/**
	 * A scrobble service returned an error.
	 */
	Err,

	/**
	 * A song was ignored by a scrobble service.
	 */
	Ignored,

	/**
	 * A song info is being loaded.
	 */
	Loading,

	/**
	 * A song is now playing.
	 */
	Playing,

	/**
	 * A song is scrobbled.
	 */
	Scrobbled,

	/**
	 * A user skipped a song.
	 */
	Skipped,

	/**
	 * An unknown song is playing.
	 */
	Unknown,
}

/**
 * A list of inactive modes.
 *
 * If a mode is not in this list, it means an active mode.
 */
const inactiveModes = [ControllerMode.Base, ControllerMode.Disabled];

/**
 * Check if a given mode is active.
 *
 * @param mode Controller mode
 *
 * @return True if the mode is active; false otherwise
 */
export function isActiveMode(mode: ControllerMode): boolean {
	return !inactiveModes.includes(mode);
}

/**
 * Check if a given mode is inactive.
 *
 * @param mode Controller mode
 *
 * @return True if the mode is inactive; false otherwise
 */
export function isInactiveMode(mode: ControllerMode): boolean {
	return inactiveModes.includes(mode);
}
