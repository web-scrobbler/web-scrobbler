import type { Controller } from '@/background/object/controller';

export interface ModeChangeListener {
	/**
	 * Called when the controller mode is changed
	 *
	 * @param ctrl Controller
	 */
	onModeChanged(ctrl: Controller): void;
}
