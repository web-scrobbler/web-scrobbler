/**
 * This pipeline stage sets a flag to block scrobbling if any of the
 * tags have been blocklisted by the user.
 */

import type Song from '@/core/object/song';
import { debugLog } from '@/core/content/util';
import BlockedTags from '@/core/storage/blocked-tags';

/**
 * Fill song info by user defined values.
 * @param song - Song instance
 */
export async function process(song: Song): Promise<void> {
	const blockedTags = new BlockedTags();
	try {
		song.flags.hasBlockedTag = await blockedTags.hasBlockedTag(song);
	} catch (err) {
		debugLog(err, 'error');
	}
}
