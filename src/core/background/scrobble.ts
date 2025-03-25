import { showNativeScrobblerWarning } from '@/util/notifications';
import type ClonedSong from '../object/cloned-song';
import scrobbleService from '../object/scrobble-service';
import { ServiceCallResult } from '../object/service-call-result';
import type { BaseSong } from '../object/song';
import type { ScrobblerSongInfo } from '../scrobbler/base-scrobbler';

export async function sendNowPlaying(
	song: BaseSong,
): Promise<ServiceCallResult[]> {
	await scrobbleService.bindAllScrobblers();
	void showNativeScrobblerWarning(song.connector);
	return scrobbleService.sendNowPlaying(song);
}

export async function sendPaused(song: BaseSong): Promise<ServiceCallResult[]> {
	await scrobbleService.bindAllScrobblers();
	return scrobbleService.sendPaused(song);
}

export async function sendResumedPlaying(
	song: BaseSong,
): Promise<ServiceCallResult[]> {
	await scrobbleService.bindAllScrobblers();
	return scrobbleService.sendResumedPlaying(song);
}

export async function scrobble(
	songs: BaseSong[],
	currentlyPlaying: boolean,
): Promise<ServiceCallResult[][]> {
	await scrobbleService.bindAllScrobblers();
	return scrobbleService.scrobble(songs, currentlyPlaying);
}

export async function getSongInfo(
	song: ClonedSong,
): Promise<(Record<string, never> | ScrobblerSongInfo | null)[]> {
	await scrobbleService.bindAllScrobblers();
	return scrobbleService.getSongInfo(song);
}

export async function toggleLove(
	song: ClonedSong,
	isLoved: boolean,
): Promise<(ServiceCallResult | Record<string, never>)[]> {
	await scrobbleService.bindAllScrobblers();
	const res = await scrobbleService.toggleLove(song, isLoved);
	if (
		res.some((callResult) => callResult === ServiceCallResult.ERROR_OTHER)
	) {
		throw new Error('An error occurred while toggling love for track');
	}
	return res;
}
