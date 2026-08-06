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
 * `FIRST_ARTIST_ONLY` option is enabled, keeping the full artist
 * name if it is present in the allowlist.
 *
 * Returns `null` when the song is corrected by the user, has no artist,
 * the option is disabled, or the extracted artist does not differ from the
 * original.
 *
 * @param song - Song instance
 * @returns The first artist, or `null` when no change should be applied
 */
export async function getFirstArtistForSong(
	song: Song,
): Promise<string | null> {
	if (song.flags.isCorrectedByUser) {
		return null;
	}
	const artist = song.getArtist();
	if (!artist) {
		return null;
	}

	const firstArtistOnly = await Options.getOption(
		Options.FIRST_ARTIST_ONLY,
	);
	if (!firstArtistOnly) {
		return null;
	}

	const allowlist = await getArtistAllowlist();
	const extracted = await extract(artist, allowlist);

	return extracted && extracted !== artist ? extracted : null;
}

/**
 * Apply the first-artist extraction to the song's processed fields.
 *
 * Runs after Metadata so it is the final word on the artist, and is skipped
 * entirely when the user has corrected the song manually.
 *
 * @param song - Song instance
 */
export async function process(song: Song): Promise<void> {
	const firstArtist = await getFirstArtistForSong(song);
	if (firstArtist === null) {
		return;
	}

	const originalArtist = song.getArtist();
	const originalAlbumArtist = song.getAlbumArtist();

	if (originalArtist) {
		song.processed.artist = firstArtist;
	}

	if (originalAlbumArtist && originalAlbumArtist === originalArtist) {
		song.processed.albumArtist = firstArtist;
	}
}
