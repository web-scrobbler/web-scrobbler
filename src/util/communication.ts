import { ConnectorMeta } from '@/core/connectors';
import { ControllerModeStr } from '@/core/object/controller/controller';
import { ServiceCallResult } from '@/core/object/service-call-result';
import { CloneableSong } from '@/core/object/song';
import { ScrobblerSongInfo } from '@/core/scrobbler/base-scrobbler';
import { ManagerTab } from '@/core/storage/wrapper';
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
		payload: ControllerModeStr;
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
		response: Promise<ServiceCallResult[]>;
	};
	setPaused: {
		payload: {
			song: CloneableSong;
		};
		response: void;
	};
	setResumedPlaying: {
		payload: {
			song: CloneableSong;
		};
		response: void;
	};
	scrobble: {
		payload: {
			song: CloneableSong;
		};
		response: Promise<ServiceCallResult[]>;
	};
	getSongInfo: {
		payload: {
			song: CloneableSong;
		};
		response: Promise<(Record<string, never> | ScrobblerSongInfo | null)[]>;
	};
	toggleLove: {
		payload: {
			song: CloneableSong;
			isLoved: boolean;
		};
		response: Promise<(ServiceCallResult | Record<string, never>)[]>;
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
			song: CloneableSong | null;
		};
	};
	disableConnectorUntilTabIsClosed: {
		payload: undefined;
		response: void;
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
	) => BackgroundCommunications[K]['response'];
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
				const response = l((listener) => {
					if (message.type !== listener.type) {
						return;
					}
					done = true;
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
	) => ContentCommunications[K]['response'];
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
				const response = l((listener) => {
					if (message.type !== listener.type) {
						return;
					}
					done = true;
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
	) => PopupCommunications[K]['response'];
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
				const response = l((listener) => {
					if (message.type !== listener.type) {
						return;
					}
					done = true;
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
	return browser.runtime.sendMessage(message);
}
