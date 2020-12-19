import md5 from 'blueimp-md5';

import { Song } from '@/background/object/song';

/**
 * Helpers to get/generate unique repository keys for the EditedTracks
 * repository.
 */

/**
 * Return a generator generates all possible repository keys for the given song.
 *
 * Some connectors don't implement `Connector.getUniqueId` function, so we need
 * to generate the repository key manually by using song info as a seed value.
 *
 * Since repository keys are created with song info, there could be a case,
 * when this info is changed (e.g. a new getter was added to a connector), and
 * we can't calculate the same ID again, since the song info is not the same.
 *
 * @param song Song object
 *
 * @yields Repository key
 */
export function* generateRepositoryKey(
	song: Song
): Generator<string, void, unknown> {
	// Base repository key that created by `getRepositoryKey` function.
	yield getRepositoryKey(song);

	// Fallback value 1 (no `artist album` property)
	yield createRepositoryKey(song, ['artist', 'track', 'album']);

	// Fallback value 2 (no `album` property)
	yield createRepositoryKey(song, ['artist', 'track']);
}

/**
 * Get an unique repository key for the given song. Song unique ID is used
 * by default; if it's missing, generate repository key using song properties.
 *
 * @param song Song object
 *
 * @return Repository key
 */
export function getRepositoryKey(song: Song): string {
	const uniqueId = song.getUniqueId();
	if (uniqueId) {
		return uniqueId;
	}

	return createRepositoryKey(song, Song.BASE_FIELDS);
}

/**
 * Create an unique repository key for a song based on song properties.
 *
 * @param song Song object
 * @param properties Array of properties
 *
 * @return Unique repository key
 */
function createRepositoryKey(song: Song, properties: string[]): string {
	let inputStr = '';

	for (const field of properties) {
		if (song.parsed[field]) {
			inputStr += song.parsed[field];
		}
	}
	if (inputStr) {
		return md5(inputStr);
	}

	throw new Error('Unable to create a repository key for the empty song');
}
