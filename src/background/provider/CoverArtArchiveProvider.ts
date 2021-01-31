import { Song } from '@/background/model/song/Song';
import { CoverArtProvider } from '@/background/provider/CoverArtProvider';

export class CoverArtArchiveProvider implements CoverArtProvider {
	async getCoverArt(song: Song): Promise<string> {
		const musicBrainzId = song.getMetadata('albumMbId');
		if (musicBrainzId) {
			return this.getCoverArtByMbId(musicBrainzId);
		}

		return null;
	}

	/**
	 * Return an URL to a coverart for the given MusicBrainz ID.
	 *
	 * @param mbid MusicBrainz ID of track or album
	 *
	 * @return Cover art URL
	 */
	private async getCoverArtByMbId(mbid: string): Promise<string> {
		const coverArtUrl = `http://coverartarchive.org/release/${mbid}/front-500`;
		const response = await fetch(coverArtUrl, { method: 'HEAD' });
		if (response.ok) {
			return coverArtUrl;
		}

		throw new Error('Unable to fetch cover art from MusicBrainz');
	}
}
