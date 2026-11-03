import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type BaseConnector from '@/core/content/connector';
import Controller from '@/core/object/controller/controller';
import * as ControllerMode from '@/core/object/controller/controller-mode';
import { ServiceCallResult } from '@/core/object/service-call-result';
import type Song from '@/core/object/song';
import type { State } from '@/core/types';

const mocks = vi.hoisted(() => ({
	sendContentMessage: vi.fn(),
	pushScrobble: vi.fn(),
	deleteScrobbles: vi.fn(),
	shouldScrobbleChannel: vi.fn(),
	listeners: new Map<string, () => void>(),
}));

vi.mock('webextension-polyfill', () => ({ default: {} }));
vi.mock('@/util/communication', () => ({
	sendContentMessage: mocks.sendContentMessage,
	setupContentListeners: vi.fn(),
	contentListener: (listener: { type: string; fn: () => void }) => {
		mocks.listeners.set(listener.type, listener.fn);
		return listener;
	},
}));
vi.mock('@/core/storage/browser-storage', () => ({
	DISABLED_TABS: 'DisabledTabs',
	getStorage: () => ({}),
}));
vi.mock('@/core/storage/options', () => ({
	SCROBBLE_PODCASTS: 'scrobblePodcasts',
	SCROBBLE_PERCENT: 'scrobblePercent',
	getOption: async (option: string) =>
		option === 'scrobblePercent' ? 50 : false,
}));
vi.mock('@/core/storage/blocklist', () => ({
	default: class {
		shouldScrobbleChannel = mocks.shouldScrobbleChannel;
	},
}));
vi.mock('@/core/storage/scrobble-cache', () => ({
	default: {
		pushScrobble: mocks.pushScrobble,
		deleteScrobbles: mocks.deleteScrobbles,
	},
}));
vi.mock('@/core/storage/saved-edits', () => ({ default: {} }));
vi.mock('@/core/content/util', () => ({ debugLog: vi.fn() }));
vi.mock('@/core/util/debug', () => ({ debugLog: vi.fn() }));
vi.mock('@/core/object/pipeline/pipeline', () => ({
	default: class {
		async process(song: Song) {
			song.flags.isValid = true;
			song.flags.finishedProcessing = true;
			return true;
		}
	},
}));

describe('Controller playback and scrobble recovery', () => {
	let controller: Controller;
	let state: State;
	const scrobbleRequests = () =>
		mocks.sendContentMessage.mock.calls.filter(
			([message]) => message.type === 'scrobble',
		);
	const update = async (changes: Partial<State> = {}) => {
		state = { ...state, ...changes };
		controller.onStateChanged(state);
		await vi.advanceTimersByTimeAsync(0);
	};

	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(0);
		vi.clearAllMocks();
		mocks.listeners.clear();
		mocks.pushScrobble.mockResolvedValue(1);
		mocks.deleteScrobbles.mockResolvedValue(undefined);
		mocks.shouldScrobbleChannel.mockResolvedValue(true);
		mocks.sendContentMessage.mockImplementation(async ({ type }) => {
			if (type === 'getTabId') {
				return undefined;
			}
			return type === 'scrobble'
				? [[ServiceCallResult.RESULT_OK]]
				: [ServiceCallResult.RESULT_OK];
		});
		vi.stubGlobal('window', globalThis);
		vi.stubGlobal('document', { querySelector: () => null });
		vi.stubGlobal('Util', {
			isArtistTrackEmpty: (song: State) => !(song.artist && song.track),
		});
		state = {
			artist: 'Artist',
			track: 'Track',
			uniqueID: 'video',
			duration: 120,
			currentTime: 1,
			isPlaying: true,
			scrobblingDisallowedReason: null,
		};
		controller = new Controller(
			{
				meta: { id: 'YouTube', label: 'YouTube' },
				getChannelId: () => null,
			} as unknown as BaseConnector,
			true,
		);
	});

	afterEach(async () => {
		controller.finish();
		await vi.advanceTimersByTimeAsync(0);
		vi.clearAllTimers();
		vi.useRealTimers();
		vi.unstubAllGlobals();
	});

	it('waits for playback and requires the listening threshold after a background pause', async () => {
		await update({ isPlaying: false, currentTime: 0 });
		await vi.advanceTimersByTimeAsync(180_000);
		expect(controller.getCurrentSong()).toBeNull();
		expect(mocks.pushScrobble).not.toHaveBeenCalled();
		await update({ isPlaying: true, currentTime: 1 });
		expect(controller.getMode()).toBe(ControllerMode.Playing);
		await vi.advanceTimersByTimeAsync(59_000);
		expect(scrobbleRequests()).toHaveLength(0);
		await vi.advanceTimersByTimeAsync(1_000);
		expect(scrobbleRequests()).toHaveLength(1);
		expect(controller.getMode()).toBe(ControllerMode.Scrobbled);
	});

	it('excludes a pause in the middle of the listening threshold', async () => {
		await update();
		await vi.advanceTimersByTimeAsync(10_000);
		await update({ isPlaying: false });
		await vi.advanceTimersByTimeAsync(180_000);
		expect(scrobbleRequests()).toHaveLength(0);
		await update({ isPlaying: true });
		await vi.advanceTimersByTimeAsync(49_000);
		expect(scrobbleRequests()).toHaveLength(0);
		await vi.advanceTimersByTimeAsync(1_000);
		expect(scrobbleRequests()).toHaveLength(1);
	});

	it('keeps the listening threshold when a temporary block clears early', async () => {
		await update({ scrobblingDisallowedReason: 'IsLoading' });
		await vi.advanceTimersByTimeAsync(10_000);
		await update({ scrobblingDisallowedReason: null });
		expect(controller.getMode()).toBe(ControllerMode.Playing);
		expect(scrobbleRequests()).toHaveLength(0);
		await vi.advanceTimersByTimeAsync(50_000);
		expect(scrobbleRequests()).toHaveLength(1);
	});

	it('submits the missed scrobble when a temporary block clears after the threshold', async () => {
		await update({ scrobblingDisallowedReason: 'IsLoading' });
		await vi.advanceTimersByTimeAsync(60_000);
		expect(mocks.pushScrobble).toHaveBeenCalledWith(
			expect.objectContaining({ status: 'disallowed' }),
		);
		await update({ scrobblingDisallowedReason: null, currentTime: 61 });
		expect(scrobbleRequests()).toHaveLength(1);
		expect(controller.getMode()).toBe(ControllerMode.Scrobbled);
		expect(mocks.deleteScrobbles).toHaveBeenCalledWith([1]);
		await update({ currentTime: 62 });
		expect(scrobbleRequests()).toHaveLength(1);
		await update({ isPlaying: false });
		await update({ isPlaying: true });
		expect(scrobbleRequests()).toHaveLength(1);
		expect(controller.getMode()).toBe(ControllerMode.Scrobbled);
	});

	it('recovers an expired attempt even if Now Playing was already sent', async () => {
		await update();
		await vi.advanceTimersByTimeAsync(10_000);
		await update({ scrobblingDisallowedReason: 'IsLoading' });
		await vi.advanceTimersByTimeAsync(50_000);
		await update({ scrobblingDisallowedReason: null });
		expect(scrobbleRequests()).toHaveLength(1);
		expect(controller.getMode()).toBe(ControllerMode.Scrobbled);
	});

	it('waits for resume before recovering a blocked attempt', async () => {
		await update({ scrobblingDisallowedReason: 'IsLoading' });
		await vi.advanceTimersByTimeAsync(60_000);
		await update({ isPlaying: false, scrobblingDisallowedReason: null });
		expect(scrobbleRequests()).toHaveLength(0);
		await update({ isPlaying: true });
		expect(scrobbleRequests()).toHaveLength(1);
	});

	it('preserves category and channel blocks after an attempt expires', async () => {
		await update({ scrobblingDisallowedReason: 'IsLoading' });
		await vi.advanceTimersByTimeAsync(60_000);
		await update({
			scrobblingDisallowedReason: 'ForbiddenYouTubeCategory',
		});
		expect(scrobbleRequests()).toHaveLength(0);
		mocks.shouldScrobbleChannel.mockResolvedValue(false);
		await update({ scrobblingDisallowedReason: null });
		expect(scrobbleRequests()).toHaveLength(0);
	});

	it('keeps a manually recovered scrobble marked as scrobbled on later updates', async () => {
		await update({ scrobblingDisallowedReason: 'IsLoading' });
		await vi.advanceTimersByTimeAsync(60_000);
		mocks.listeners.get('forceScrobbleSong')!();
		await vi.advanceTimersByTimeAsync(0);
		expect(scrobbleRequests()).toHaveLength(1);
		expect(controller.getMode()).toBe(ControllerMode.Scrobbled);
		await update({ scrobblingDisallowedReason: null, currentTime: 62 });
		expect(scrobbleRequests()).toHaveLength(1);
		expect(controller.getMode()).toBe(ControllerMode.Scrobbled);
	});

	it('recovers only once while several playback updates arrive during submission', async () => {
		await update({ scrobblingDisallowedReason: 'IsLoading' });
		await vi.advanceTimersByTimeAsync(60_000);
		let completeSubmission!: (results: ServiceCallResult[][]) => void;
		mocks.sendContentMessage.mockImplementation(async ({ type }) =>
			type === 'scrobble'
				? new Promise<ServiceCallResult[][]>((resolve) => {
						completeSubmission = resolve;
					})
				: [ServiceCallResult.RESULT_OK],
		);
		await update({ scrobblingDisallowedReason: null });
		await update({ currentTime: 62 });
		await update({ currentTime: 63 });
		expect(scrobbleRequests()).toHaveLength(1);
		completeSubmission([[ServiceCallResult.RESULT_OK]]);
		await vi.advanceTimersByTimeAsync(0);
		expect(controller.getMode()).toBe(ControllerMode.Scrobbled);
	});
});
