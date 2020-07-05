import Options from '@/background/storage/options';
import ScrobbleService from '@/background/object/scrobble-service';

const INFO_TO_COPY = ['duration', 'artist', 'track'];
const METADATA_TO_COPY = [
	'trackArtUrl',
	'artistUrl',
	'trackUrl',
	'albumUrl',
	'userPlayCount',
	'albumMbId',
];

/**
 * Load song info using ScrobblerService object.
 * @param {Object} song Song instance
 */
export async function process(song) {
	if (song.isEmpty()) {
		return;
	}

	const songInfoArr = await ScrobbleService.getSongInfo(song.getInfo());
	const songInfo = getInfo(songInfoArr);
	const isSongValid = songInfo !== null;
	if (isSongValid) {
		if (!song.flags.isCorrectedByUser) {
			for (const field of INFO_TO_COPY) {
				song.processed[field] = songInfo[field];
			}

			if (!song.getAlbum()) {
				song.processed.album = songInfo.album;
			}
		}

		for (const field of METADATA_TO_COPY) {
			song.metadata[field] = songInfo[field];
		}

		for (const info of songInfoArr) {
			song.setLoveStatus(info.userloved);
		}
	}

	const forceRecognize = Options.getOption(Options.FORCE_RECOGNIZE);
	song.flags.isValid = isSongValid || forceRecognize;
}

/**
 * Get song info from array contains the highest keys count.
 *
 * @param {Array} songInfoArr Array of song info objects
 * @return {Object} Song info object
 */
function getInfo(songInfoArr) {
	return songInfoArr.reduce((prev, current) => {
		if (!current) {
			return prev;
		}
		if (!prev) {
			return current;
		}
		if (getNonEmptyKeyCount(current) > getNonEmptyKeyCount(prev)) {
			return current;
		}

		return prev;
	}, null);
}

/**
 * Return number of non-empty object keys.
 *
 * @param {Object} obj Object instance
 * @return {Number} Number of non-empty object keys
 */
function getNonEmptyKeyCount(obj) {
	let keyCount = 0;
	for (const key in obj) {
		if (obj[key]) {
			++keyCount;
		}
	}

	return keyCount;
}
