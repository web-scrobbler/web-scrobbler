/* eslint-disable @typescript-eslint/no-explicit-any */

import { browser } from 'webextension-polyfill-ts';

import { UserProperties } from '@/background/scrobbler/base-scrobbler';
import { EditedSongInfo } from '@/background/object/song';

export enum Event {
	/**
	 * An event emitted when a connector is injected into a page and a
	 * tab controller is created.
	 */
	Ready = 'EVENT_READY',

	/**
	 * An event emitted when a connector changes its state.
	 */
	StateChanged = 'EVENT_STATE_CHANGED',

	/**
	 * An event emitted when a now playing track is updated.
	 */
	TrackUpdated = 'EVENT_TRACK_UPDATED',
}

export enum Request {
	/**
	 * A request to get an active tab ID.
	 *
	 * A request receiver must return an ID of an active tab.
	 */
	GetActiveTabId = 'REQUEST_GET_ACTIVE_TAB_ID',

	/**
	 * A request to get a label of an active connector.
	 *
	 * A request receiver must return a connector label.
	 */
	GetConnectorLabel = 'REQUEST_GET_CONNECTOR_LABEL',

	/**
	 * A request to get a now playing track.
	 *
	 * A request receiver must return a copy of a track instance.
	 */
	GetTrack = 'REQUEST_GET_TRACK',

	/**
	 * A request to correct a now playing track.
	 *
	 * A request sender must provide edited track info as a `track` property.
	 */
	CorrectTrack = 'REQUEST_CORRECT_TRACK',

	/**
	 * A request to reset now playing track.
	 */
	ResetTrack = 'REQUEST_RESET_TRACK',

	/**
	 * A request to ignore (don't scrobble) a current track.
	 */
	SkipTrack = 'REQUEST_SKIP_TRACK',

	/**
	 * A request to love/unlove a now playing track.
	 *
	 * A request sender must provide a boolean flag as a `isLoved` property.
	 */
	ToggleLove = 'REQUEST_TOGGLE_LOVE',

	/**
	 * A request to sign in to an account.
	 *
	 * A request sender must provide a scrobbler ID as a `scrobblerId` property.
	 */
	SignIn = 'REQUEST_SIGN_IN',

	/**
	 * A request to sign out.
	 *
	 * A request sender must provide a scrobbler ID as a `scrobblerId` property.
	 */
	SignOut = 'REQUEST_SIGN_OUT',

	/**
	 * A request to get an active tab ID.
	 *
	 * A request sender must provide a scrobbler ID as a `scrobblerId` property,
	 * and a user properties as a `properties` property.
	 */
	ApplyUserProperties = 'REQUEST_APPLY_USER_PROPERTIES',

	/**
	 * A request to check if a connector is injected.
	 *
	 * A request receiver script should return a truthy value.
	 */
	Ping = 'REQUEST_PING',
}

export interface Message {
	tabId: number;
	type: MessageType;
	data: unknown;
}

export type MessageType = Event | Request;

/**
 * A response to Request.CorrectTrack request.
 */
export interface CorrectTrackResponse {
	track: EditedSongInfo;
}

/**
 * A response to Request.ToggleLove request.
 */
export interface ToggleLoveResponse {
	isLoved: boolean;
}

/**
 * A response to Request.SignIn, Request.SignOut requests.
 */
export interface ScrobblerRequestResponse {
	scrobblerId: string;
}

/**
 * A response to Request.ApplyUserProperties request.
 */
export interface UserPropertiesResponse extends ScrobblerRequestResponse {
	userProps: UserProperties;
}

/**
 * Send a message to a tab with a given ID.
 *
 * @param tabId Tab ID
 * @param type Message type
 * @param [data] Data to send
 *
 * @return Response data
 */
export async function sendMessageTo(
	tabId: number,
	type: MessageType,
	data?: unknown
): Promise<any> {
	return browser.runtime.sendMessage({ tabId, type, data });
}

/**
 * Send a message to all modules.
 *
 * @param type Message type
 * @param [data] Data to send
 *
 * @return Response data
 */
export async function sendMessageToAll(
	type: MessageType,
	data?: unknown
): Promise<any> {
	return browser.runtime.sendMessage({ type, data });
}

/**
 * Send a message to an active tab.
 *
 * @param type Message type
 * @param [data] Data to send
 *
 * @return Response data
 */
export async function sendMessageToActiveTab(
	type: MessageType,
	data?: unknown
): Promise<any> {
	const tabId = (await sendMessageToAll(Request.GetActiveTabId)) as number;

	return browser.runtime.sendMessage({ tabId, type, data });
}

/**
 * Send a message to content scripts from a tab with a given ID.
 *
 * @param tabId Tab ID
 * @param type Message type
 *
 * @return Response data
 */
export async function sendMessageToContentScripts(
	tabId: number,
	type: MessageType
): Promise<any> {
	return browser.tabs.sendMessage(tabId, { type });
}
