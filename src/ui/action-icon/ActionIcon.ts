import type { Song } from '@/background/model/song/Song';
import type { ControllerMode } from '@/background/object/controller-mode';
import type { LoveStatus } from '@/background/model/song/LoveStatus';

/**
 * Action icon that indicates the extension status.
 */
export interface ActionIcon {
	/**
	 * Set the action icon according to the given context (the controller
	 * mode and the now playing song).
	 *
	 * @param song Now playing song
	 * @param mode Controller mode
	 */
	setAction(song: Song, mode: ControllerMode): void;

	/**
	 * Set the love icon according to the given context (the now playing song
	 * and the love status).
	 *
	 * @param song Now playing song
	 * @param loveStatus Is song loved or unloved
	 */
	setLoveStatus(song: Song, loveStatus: LoveStatus): void;

	/**
	 * Set the default action icon.
	 */
	reset(): void;
}
