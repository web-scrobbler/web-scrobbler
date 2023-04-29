/**
 * This pipeline stage loads song info from external services.
 */
import * as Options from '@/core/storage/options';
import Song from '@/core/object/song';
import { ConnectorMeta } from '@/core/connectors';
import ScrobbleService from '@/core/object/scrobble-service';
import { ScrobblerSongInfo } from '@/core/scrobbler/base-scrobbler';

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
	'albumMbId'
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
	connector: ConnectorMeta
): Promise<void> {
	if (song.isEmpty()) {
		return;
	}

	const songInfoArr = await ScrobbleService.getSongInfo(song);
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

			if (!song.getAlbum() || song.flags.isAlbumFetched) {
				song.processed.album = songInfo.album;
				song.noRegex.album = songInfo.album;
				song.flags.isAlbumFetched = true;
			}
		}

		for (const field of METADATA_TO_COPY) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Set regardless of previous state
			(song.metadata[field] as any) = songInfo[field];
		}
	}

	const forceRecognize = await Options.getOption(
		Options.FORCE_RECOGNIZE,
		connector.id
	);
	const scrobbleEditedTracksOnly = await Options.getOption(
		Options.SCROBBLE_EDITED_TRACKS_ONLY,
		connector.id
	);

	song.flags.isValid =
		(isSongValid || Boolean(forceRecognize)) &&
		(song.flags.isCorrectedByUser || !scrobbleEditedTracksOnly);
}

/**
 * Get song info from array contains the highest keys count.
 * @param songInfoArr - Array of song info objects
 * @returns Song info object
 */
function getInfo(
	songInfoArr: (ScrobblerSongInfo | Record<string, never> | null)[]
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
