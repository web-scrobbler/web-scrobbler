/**
 * A connector is ready to scrobble tracks.
 */
export const Base = 'Base';

/**
 * An option, or something hard coded into the connector, is disallowing scrobbling.
 */
export const Disallowed = 'Disallowed';

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
 * A song is paused.
 */
export const Paused = 'Paused';

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
 * Site is unsupported.
 */
export const Unsupported = 'Unsupported';

/**
 * A user loved a song.
 */
export const Loved = 'Loved';

/**
 * A user unloved a song.
 */
export const Unloved = 'Unloved';
