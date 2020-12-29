/**
 * A helper to get/generate unique ID for a song.
 */
export interface SongUniqueIdGenerator {
	/**
	 * Return a generator generates all possible repository keys for the given song.
	 *
	 * @yields Repository key
	 */
	generateUniqueId(): UniqueIdGenerator;
}

export type UniqueIdGenerator = Generator<string, void, unknown>;
