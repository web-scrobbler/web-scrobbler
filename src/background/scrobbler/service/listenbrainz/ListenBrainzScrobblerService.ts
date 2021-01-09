import { LoveStatus } from '@/background/model/song/LoveStatus';
import { TrackInfo } from '@/background/model/song/TrackInfo';
import { ApiCallResult } from '@/background/scrobbler/api-call-result';
import { ScrobbleService } from '@/background/scrobbler/service/ScrobbleService';
import { SessionProvider } from '@/background/scrobbler/service/SessionProvider';
import { SessionData } from '@/background/scrobbler/service/TokenBasedSessionProvider';

interface ListenBrainzResult {
	status: string;
}

export class ListenBrainzScrobblerService
	implements ScrobbleService, SessionProvider {
	getAuthUrl(): string {
		return 'https://listenbrainz.org/login/musicbrainz?next=%2Fprofile%2F';
	}

	requestSession(): Promise<SessionData> {
		throw new Error('Method not implemented.');
	}

	sendNowPlayingRequest(trackInfo: TrackInfo): Promise<ApiCallResult> {
		throw new Error('Method not implemented.');
	}

	sendScrobbleRequest(trackInfo: TrackInfo): Promise<ApiCallResult> {
		throw new Error('Method not implemented.');
	}

	sendLoveRequest(
		trackInfo: TrackInfo,
		loveStatus: LoveStatus
	): Promise<ApiCallResult> {
		throw new Error('Method not implemented.');
	}

	// private processResult(result: ListenBrainzResult): ApiCallResult {
	// 	if (result.status !== 'ok') {
	// 		throw this.makeApiCallResult(ApiCallResult.ERROR_OTHER);
	// 	}

	// 	return this.makeApiCallResult(ApiCallResult.RESULT_OK);
	// }

	// makeTrackMetadata(songInfo: SongInfo): TrackMetadata {
	// 	const { artist, track, album, albumArtist, originUrl } = songInfo;

	// 	const trackMeta: TrackMetadata = {
	// 		artist_name: artist,
	// 		track_name: track,
	// 		additional_info: {},
	// 	};

	// 	if (album) {
	// 		trackMeta.release_name = album;
	// 	}

	// 	if (originUrl) {
	// 		trackMeta.additional_info.origin_url = originUrl;
	// 	}

	// 	if (albumArtist) {
	// 		trackMeta.additional_info.release_artist_name = albumArtist;
	// 	}

	// 	return trackMeta;
	// }
}
