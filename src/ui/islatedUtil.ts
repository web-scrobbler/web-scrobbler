/**
 * @returns true if the user is on an iOS device, false otherwise.
 */
export function isIos() {
	return CSS.supports('-webkit-touch-callout', 'none');
}
