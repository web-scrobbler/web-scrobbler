import type { ConnectorMeta } from '@/core/connectors';
import type { ChannelInfo } from '@/core/content/util';
import type { ControllerModeStr } from '@/core/object/controller/controller';
import type { ServiceCallResult } from '@/core/object/service-call-result';
import type { CloneableSong } from '@/core/object/song';
import type { ScrobblerSongInfo } from '@/core/scrobbler/base-scrobbler';
import type { ManagerTab } from '@/core/storage/wrapper';
import browser from 'webextension-polyfill';

/**
 * This file deals with communication between the different scripts.
 * It uses continuations to restrict type to a single listener type
 */

interface PopupCommunications {
	currentTab: {
		payload: ManagerTab;
		response: void;
	};
}

interface ContentCommunications {
	controllerModeChange: {
		payload: {
			mode: ControllerModeStr;
			permanentMode: ControllerModeStr;
		};
		response: void;
	};
	songUpdate: {
		payload: CloneableSong | null;
		response: void;
	};
	getTabId: {
		payload: undefined;
		response: number | undefined;
	};
	showNowPlaying: {
		payload: {
			song: CloneableSong;
			connector: ConnectorMeta;
		};
		response: void;
	};
	clearNowPlaying: {
		payload: {
			song: CloneableSong;
		};
		response: void;
	};
	showSongNotRecognized: {
		payload: {
			song: CloneableSong;
			connector: ConnectorMeta;
		};
		response: void;
	};
	updateTheme: {
		payload: 'dark' | 'light';
		response: void;
	};
	setNowPlaying: {
		payload: {
			song: CloneableSong;
		};
		response: ServiceCallResult[];
	};
	setPaused: {
		payload: {
			song: CloneableSong;
		};
		response: ServiceCallResult[];
	};
	setResumedPlaying: {
		payload: {
			song: CloneableSong;
		};
		response: ServiceCallResult[];
	};
	scrobble: {
		payload: {
			songs: CloneableSong[];
			currentlyPlaying: boolean;
		};
		response: ServiceCallResult[][];
	};
	getSongInfo: {
		payload: {
			song: CloneableSong;
		};
		response: (Record<string, never> | ScrobblerSongInfo | null)[];
	};
	toggleLove: {
		payload: {
			song: CloneableSong;
			isLoved: boolean;
			shouldShowNotification: boolean;
		};
		response: (ServiceCallResult | Record<string, never>)[];
	};
	sendListenBrainzRequest: {
		payload: {
			url: string;
		};
		response: string | null;
	};
	updateScrobblerProperties: {
		payload: undefined;
		response: void;
	};
	fetch: {
		payload: {
			url: string;
			init?: RequestInit | undefined;
		};
		response: {
			ok: boolean;
			content: string;
		};
	};
	isTabAudible: {
		payload: undefined;
		response: boolean;
	};
}

interface BackgroundCommunications {
	resetData: {
		payload: undefined;
		response: void;
	};
	resetInfo: {
		payload: undefined;
		response: void;
	};
	toggleLove: {
		payload: {
			isLoved: boolean;
			shouldShowNotification: boolean;
		};
		response: void;
	};
	updateLove: {
		payload: {
			isLoved: boolean;
		};
		response: void;
	};
	skipCurrentSong: {
		payload: undefined;
		response: void;
	};
	reprocessSong: {
		payload: undefined;
		response: void;
	};
	setEditState: {
		payload: boolean;
		response: void;
	};
	setConnectorState: {
		payload: boolean;
		response: void;
	};
	getConnectorDetails: {
		payload: undefined;
		response: {
			mode: ControllerModeStr;
			permanentMode: ControllerModeStr;
			song: CloneableSong | null;
		};
	};
	disableConnectorUntilTabIsClosed: {
		payload: undefined;
		response: void;
	};
	forceScrobbleSong: {
		payload: undefined;
		response: void;
	};
	addToBlocklist: {
		payload: undefined;
		response: void;
	};
	removeFromBlocklist: {
		payload: undefined;
		response: void;
	};
	getChannelDetails: {
		payload: undefined;
		response: {
			connector: ConnectorMeta;
			channelInfo: ChannelInfo | null | undefined;
		};
	};
}

/**
 * Content listeners
 */

interface SpecificContentListener<K extends keyof BackgroundCommunications> {
	type: K;
	fn: (
		payload: BackgroundCommunications[K]['payload'],
		sender: browser.Runtime.MessageSender,
	) =>
		| BackgroundCommunications[K]['response']
		| Promise<BackgroundCommunications[K]['response']>;
}

type ContentListener = <R>(
	cont: <T extends keyof BackgroundCommunications>(
		prop: SpecificContentListener<T>,
	) => R,
) => R;

export function contentListener<T extends keyof BackgroundCommunications>(
	property: SpecificContentListener<T>,
): ContentListener {
	return <R>(
		cont: <T extends keyof BackgroundCommunications>(
			prop: SpecificContentListener<T>,
		) => R,
	) => cont(property);
}

interface BackgroundMessage<K extends keyof BackgroundCommunications> {
	type: K;
	payload: BackgroundCommunications[K]['payload'];
}

export function setupContentListeners(...listeners: ContentListener[]) {
	browser.runtime.onMessage.addListener(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(message: BackgroundMessage<any>, sender) => {
			let done = false;
			for (const l of listeners) {
				// eslint-disable-next-line
				const response = l((listener) => {
					if (message.type !== listener.type) {
						return;
					}
					done = true;
					// eslint-disable-next-line
					return listener.fn(message.payload, sender);
				});
				if (done) {
					return Promise.resolve(response);
				}
			}
		},
	);
}

export async function sendBackgroundMessage<
	K extends keyof BackgroundCommunications,
>(
	tabId: number,
	message: BackgroundMessage<K>,
): Promise<BackgroundCommunications[K]['response']> {
	// eslint-disable-next-line
	return browser.tabs.sendMessage(tabId, message);
}

/**
 * Background listeners
 */

interface SpecificBackgroundListener<K extends keyof ContentCommunications> {
	type: K;
	fn: (
		payload: ContentCommunications[K]['payload'],
		sender: browser.Runtime.MessageSender,
	) =>
		| ContentCommunications[K]['response']
		| Promise<ContentCommunications[K]['response']>;
}

type BackgroundListener = <R>(
	cont: <T extends keyof ContentCommunications>(
		prop: SpecificBackgroundListener<T>,
	) => R,
) => R;

export function backgroundListener<T extends keyof ContentCommunications>(
	property: SpecificBackgroundListener<T>,
): BackgroundListener {
	return <R>(
		cont: <T extends keyof ContentCommunications>(
			prop: SpecificBackgroundListener<T>,
		) => R,
	) => cont(property);
}

interface ContentMessage<K extends keyof ContentCommunications> {
	type: K;
	payload: ContentCommunications[K]['payload'];
}

export function setupBackgroundListeners(...listeners: BackgroundListener[]) {
	browser.runtime.onMessage.addListener(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(message: ContentMessage<any>, sender) => {
			let done = false;
			for (const l of listeners) {
				// eslint-disable-next-line
				const response = l((listener) => {
					if (message.type !== listener.type) {
						return;
					}
					done = true;
					// eslint-disable-next-line
					return listener.fn(message.payload, sender);
				});
				if (done) {
					return Promise.resolve(response);
				}
			}
		},
	);
}

export async function sendContentMessage<K extends keyof ContentCommunications>(
	message: ContentMessage<K>,
): Promise<ContentCommunications[K]['response']> {
	// eslint-disable-next-line
	return browser.runtime.sendMessage(message);
}

/**
 * popup listeners
 */

interface SpecificPopupListener<K extends keyof PopupCommunications> {
	type: K;
	fn: (
		payload: PopupCommunications[K]['payload'],
		sender: browser.Runtime.MessageSender,
	) =>
		| PopupCommunications[K]['response']
		| Promise<PopupCommunications[K]['response']>;
}

type PopupListener = <R>(
	cont: <T extends keyof PopupCommunications>(
		prop: SpecificPopupListener<T>,
	) => R,
) => R;

export function popupListener<T extends keyof PopupCommunications>(
	property: SpecificPopupListener<T>,
): PopupListener {
	return <R>(
		cont: <T extends keyof PopupCommunications>(
			prop: SpecificPopupListener<T>,
		) => R,
	) => cont(property);
}

interface PopupMessage<K extends keyof PopupCommunications> {
	type: K;
	payload: PopupCommunications[K]['payload'];
}

export function setupPopupListeners(...listeners: PopupListener[]) {
	browser.runtime.onMessage.addListener(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Set regardless of previous state
		(message: PopupMessage<any>, sender) => {
			let done = false;
			for (const l of listeners) {
				// eslint-disable-next-line
				const response = l((listener) => {
					if (message.type !== listener.type) {
						return;
					}
					done = true;
					// eslint-disable-next-line
					return listener.fn(message.payload, sender);
				});
				if (done) {
					return Promise.resolve(response);
				}
			}
		},
	);
}

export async function sendPopupMessage<K extends keyof PopupCommunications>(
	message: PopupMessage<K>,
): Promise<PopupCommunications[K]['response']> {
	// eslint-disable-next-line
	return browser.runtime.sendMessage(message);
}
