import { Song } from '@/background/model/song/Song';
import { ScrobbleCache } from '@/background/repository/scrobble-cache/ScrobbleCache';
import { Scrobbleable } from '@/background/scrobbler/Scrobbleable';
import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';

export async function populateScrobbleCache(
	scrobbleCache: ScrobbleCache
): Promise<void> {
	const unscrobbledTracks = generateUnscrobbledTracks(5);

	scrobbleCache.clear();
	for (const entry of unscrobbledTracks) {
		await scrobbleCache.addSong(entry, [
			ScrobblerId.LastFm,
			ScrobblerId.LibreFm,
		]);
	}
}

function generateUnscrobbledTracks(size: number): ReadonlyArray<Scrobbleable> {
	const result: Scrobbleable[] = [];

	for (let i = 0; i < size; ++i) {
		const scrobbleable = createScrobbleable(i);

		result.push(scrobbleable);
	}

	return result;
}

function createScrobbleable(index: number): Scrobbleable {
	return new Song({
		artist: `Artist ${index}`,
		track: `Track ${index}`,
		album: `Album ${index}`,
		albumArtist: `Album Artist ${index}`,
	});
}
