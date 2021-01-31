import type { Controller } from '@/background/object/controller';

export interface NowPlayingListener {
	/**
	 * Called when the song is reset.
	 *
	 * @param ctrl Controller
	 */
	onReset(ctrl: Controller): void;

	/**
	 * Called when the controller starts playing a new track.
	 *
	 * @param ctrl Controller
	 */
	onNowPlaying(ctrl: Controller): void;
}
