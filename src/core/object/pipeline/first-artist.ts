/**
 * This pipeline stage extracts the first artist from multi-artist tracks,
 * unless the artist name is allowlisted.
 */
import * as Options from '@/core/storage/options';
import { extract } from '@/core/scrobbler/lastfm/first-artist-extractor';
import { getArtistAllowlist } from '@/core/scrobbler/lastfm/artist-allowlist';
import type Song from '@/core/object/song';

/**
 * Extract the first artist from the song's artist field when the
 * `LASTFM_FIRST_ARTIST_ONLY` option is enabled, keeping the full artist
 * name if it is present in the allowlist.
 *
 * Runs after Metadata so it is the final word on the artist, and is skipped
 * entirely when the user has corrected the song manually.
 *
 * @param song - Song instance
 */
export async function process(song: Song): Promise<void> {
	if (song.flags.isCorrectedByUser) {
		return;
	}
	if (!song.getArtist()) {
		return;
	}

	const firstArtistOnly = await Options.getOption(
		Options.LASTFM_FIRST_ARTIST_ONLY,
	);
	if (!firstArtistOnly) {
		return;
	}

	const originalArtist = song.getArtist();
	const originalAlbumArtist = song.getAlbumArtist();

	const allowlist = await getArtistAllowlist();
	const firstArtist = await extract(originalArtist ?? '', allowlist);

	if (firstArtist && firstArtist !== originalArtist) {
		song.processed.artist = firstArtist;

		if (originalAlbumArtist === originalArtist) {
			song.processed.albumArtist = firstArtist;
		}
	}
}
