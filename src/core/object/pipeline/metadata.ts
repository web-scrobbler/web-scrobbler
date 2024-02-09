/**
 * This pipeline stage loads song info from external services.
 */
import * as Options from '@/core/storage/options';
import Song from '@/core/object/song';
import { ConnectorMeta } from '@/core/connectors';
import { ScrobblerSongInfo } from '@/core/scrobbler/base-scrobbler';
import { sendContentMessage } from '@/util/communication';

const INFO_TO_COPY: ['duration', 'artist', 'track'] = [
	'duration',
	'artist',
	'track',
];
const METADATA_TO_COPY: [
	'trackArtUrl',
	'artistUrl',
	'trackUrl',
	'albumUrl',
	'userPlayCount',
	'albumMbId',
] = [
	'trackArtUrl',
	'artistUrl',
	'trackUrl',
	'albumUrl',
	'userPlayCount',
	'albumMbId',
];

/**
 * Load song info using ScrobblerService object.
 * @param song - Song instance
 * @param connector - Connector instance
 */
export async function process(
	song: Song,
	connector: ConnectorMeta,
): Promise<void> {
	if (song.isEmpty()) {
		return;
	}

	const songInfoArr = await sendContentMessage({
		type: 'getSongInfo',
		payload: {
			song: song.getCloneableData(),
		},
	});
	const songInfo = getInfo(songInfoArr);
	const isSongValid = songInfo !== null;
	if (isSongValid) {
		if (!song.flags.isCorrectedByUser) {
			for (const field of INFO_TO_COPY) {
				if (!songInfo[field]) {
					continue;
				}
				// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Set regardless of previous state
				(song.processed[field] as any) = songInfo[field];
			}
		}

		if (await shouldCopyAlbum(song)) {
			song.processed.album = songInfo.album;
			song.noRegex.album = songInfo.album;
			song.flags.isAlbumFetched = true;
		}

		for (const field of METADATA_TO_COPY) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Set regardless of previous state
			(song.metadata[field] as any) = songInfo[field];
		}
	}

	const forceRecognize = await Options.getOption(
		Options.FORCE_RECOGNIZE,
		connector.id,
	);
	const scrobbleEditedTracksOnly = await Options.getOption(
		Options.SCROBBLE_EDITED_TRACKS_ONLY,
		connector.id,
	);

	song.flags.isValid =
		(isSongValid || Boolean(forceRecognize)) &&
		(song.flags.isCorrectedByUser || !scrobbleEditedTracksOnly);
}

/**
 * Determine if album should be copied to current track
 * This depends on the user's options
 * @param song - Song to be copied to
 *
 * @returns true if pipeline should copy album to current track; false if not.
 */
async function shouldCopyAlbum(song: Song): Promise<boolean> {
	if (song.getAlbum() && !song.flags.isAlbumFetched) {
		return false;
	}

	if (await Options.getOption(Options.ALBUM_GUESSING_DISABLED)) {
		return false;
	}

	if (await Options.getOption(Options.ALBUM_GUESSING_ALL_TRACKS)) {
		return true;
	}

	return !song.flags.isCorrectedByUser;
}

/**
 * Get song info from array contains the highest keys count.
 * @param songInfoArr - Array of song info objects
 * @returns Song info object
 */
function getInfo(
	songInfoArr: (ScrobblerSongInfo | Record<string, never> | null)[],
) {
	if (songInfoArr.length === 0) {
		return null;
	}
	return songInfoArr.reduce((prev, current) => {
		if (!current) {
			return prev;
		}
		if (!prev) {
			return current;
		}
		if (
			getNonEmptyKeyCount(current as Record<string, unknown> | null) >
			getNonEmptyKeyCount(prev as Record<string, unknown> | null)
		) {
			return current;
		}

		return prev;
	}, {});
}

/**
 * Return number of non-empty object keys.
 * @param obj - Object instance
 * @returns Number of non-empty object keys
 */
function getNonEmptyKeyCount(obj: Record<string, unknown> | null): number {
	let keyCount = 0;
	if (obj === null) {
		return 0;
	}
	for (const key in obj) {
		if (obj[key]) {
			++keyCount;
		}
	}

	return keyCount;
}
