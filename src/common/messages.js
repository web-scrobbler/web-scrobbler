import { runtime, tabs } from 'webextension-polyfill';

/**
 * An event emitted when a connector changes its state.
 */
export const EVENT_STATE_CHANGED = 'EVENT_STATE_CHANGED';

/**
 * An event emitted when a now playing track is updated.
 */
export const EVENT_TRACK_UPDATED = 'EVENT_TRACK_UPDATED';

/**
 * An event emitted when a connector is injected into a page and a
 * tab controller is created.
 */
export const EVENT_READY = 'EVENT_READY';

/**
 * A request to get an active tab ID.
 *
 * A request receiver must return an ID of an active tab.
 */
export const REQUEST_GET_ACTIVE_TAB_ID = 'REQUEST_GET_ACTIVE_TAB_ID';

/**
 * A request to get a label of an active connector.
 *
 * A request receiver must return a connector label.
 */
export const REQUEST_GET_CONNECTOR_LABEL = 'REQUEST_GET_CONNECTOR_LABEL';

/**
 * A request to get a now playing track.
 *
 * A request receiver must return a copy of a track instance.
 */
export const REQUEST_GET_TRACK = 'REQUEST_GET_TRACK';

/**
 * A request to correct a now playing track.
 *
 * A request sender must provide edited track info as a `track` property.
 */
export const REQUEST_CORRECT_TRACK = 'REQUEST_CORRECT_TRACK';

/**
 * A request to reset now playing track.
 */
export const REQUEST_RESET_TRACK = 'REQUEST_RESET_TRACK';

/**
 * A request to ignore (don't scrobble) a current track.
 */
export const REQUEST_SKIP_TRACK = 'REQUEST_SKIP_TRACK';

/**
 * A request to love/unlove a now playing track.
 *
 * A request sender must provide a boolean flag as a `isLoved` property.
 */
export const REQUEST_TOGGLE_LOVE = 'REQUEST_TOGGLE_LOVE';

/**
 * A request to sign in to an account.
 *
 * A request sender must provide a scrobbler ID as a `scrobblerId` property.
 */
export const REQUEST_SIGN_IN = 'REQUEST_SIGN_IN';

/**
 * A request to sign out.
 *
 * A request sender must provide a scrobbler ID as a `scrobblerId` property.
 */
export const REQUEST_SIGN_OUT = 'REQUEST_SIGN_OUT';

/**
 * A request to get an active tab ID.
 *
 * A request sender must provide a scrobbler ID as a `scrobblerId` property,
 * and a user properties as a `properties` property.
 */
export const REQUEST_APPLY_USER_PROPERTIES = 'REQUEST_APPLY_USER_PROPERTIES';

/**
 * A request to check if a connector is injected.
 *
 * A request receiver script should return a truthy value.
 */
export const REQUEST_PING = 'REQUEST_PING';

/**
 * Send a message to a tab with a given ID.
 *
 * @param {Number} tabId Tab ID
 * @param {String} type Message type
 * @param {Object} data Data to send
 *
 * @return {Object} Response data
 */
export async function sendMessageTo(tabId, type, data) {
	return runtime.sendMessage({ tabId, type, data });
}

/**
 * Send a message to all modules.
 *
 * @param {String} type Message type
 * @param {Object} data Data to send
 *
 * @return {Object} Response data
 */
export async function sendMessageToAll(type, data) {
	return runtime.sendMessage({ type, data });
}

/**
 * Send a message to an active tab.
 *
 * @param {String} type Message type
 * @param {Object} data Data to send
 *
 * @return {Object} Response data
 */
export async function sendMessageToActiveTab(type, data) {
	const tabId = await sendMessageToAll(REQUEST_GET_ACTIVE_TAB_ID);

	return runtime.sendMessage({ tabId, type, data });
}

/**
 * Send a message to content scripts from a tab with a given ID.
 *
 * @param {Number} tabId Tab ID
 * @param {String} type Message type
 *
 * @return {Object} Response data
 */
export async function sendMessageToContentScripts(tabId, type) {
	return tabs.sendMessage(tabId, { type });
}
