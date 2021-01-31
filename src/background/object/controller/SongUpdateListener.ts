import type { Controller } from '@/background/object/controller';

export interface SongUpdateListener {
	/**
	 * Called when the now playing song is updated (not changed).
	 *
	 * @param ctrl
	 */
	onSongUpdated(ctrl: Controller): void;
}
