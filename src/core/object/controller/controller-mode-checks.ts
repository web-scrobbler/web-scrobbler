import { Base, Disabled } from './controller-mode';

/**
 * A list of inactive modes.
 *
 * If a mode is not in this list, it means an active mode.
 */
const inactiveModes = [Base, Disabled];

/**
 * Check if a given mode is active.
 *
 * @param mode - Mode instance
 * @returns True if the mode is active; false otherwise
 */
export function isActiveMode(mode: string): boolean {
	return !inactiveModes.includes(mode);
}

/**
 * Check if a given mode is inactive.
 *
 * @param mode - Mode instance
 * @returns True if the mode is inactive; false otherwise
 */
export function isInactiveMode(mode: string): boolean {
	return inactiveModes.includes(mode);
}
