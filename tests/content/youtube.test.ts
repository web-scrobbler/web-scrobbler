import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type BaseConnector from '@/core/content/connector';

describe('YouTube playback detection', () => {
	let connector: BaseConnector;
	let video: {
		currentTime: number;
		paused: boolean;
		ended: boolean;
		matches: (selector: string) => boolean;
		addEventListener: ReturnType<typeof vi.fn>;
	} | null;
	let documentMock: {
		querySelector: ReturnType<typeof vi.fn>;
		addEventListener: ReturnType<typeof vi.fn>;
	};

	beforeEach(async () => {
		vi.resetModules();
		video = {
			currentTime: 0,
			paused: true,
			ended: false,
			matches: (selector) => selector === '.html5-main-video',
			addEventListener: vi.fn(),
		};
		connector = {
			onStateChanged: vi.fn(),
			applyFilter: vi.fn(),
		} as unknown as BaseConnector;
		documentMock = {
			querySelector: vi.fn((selector) =>
				selector === '.html5-main-video' ? video : null,
			),
			addEventListener: vi.fn(),
		};
		vi.stubGlobal('Connector', connector);
		vi.stubGlobal('document', documentMock);
		vi.stubGlobal('Util', {
			getOption: vi.fn().mockResolvedValue(false),
			debugLog: vi.fn(),
			// YouTube can expose this class while background autoplay is paused.
			hasElementClass: vi.fn().mockReturnValue(true),
		});
		vi.stubGlobal('MetadataFilter', {
			createYouTubeFilter: () => ({ append: vi.fn() }),
		});
		await import('@/connectors/youtube');
	});

	afterEach(() => vi.unstubAllGlobals());

	it('waits for a background video to start despite the playing CSS class', () => {
		expect(connector.isPlaying()).toBe(false);
		Object.assign(video!, { paused: false });
		expect(connector.isPlaying()).toBe(false);
		Object.assign(video!, { currentTime: 1 });
		expect(connector.isPlaying()).toBe(true);
	});

	it('does not classify a video waiting to start as a disallowed scrobble', () => {
		expect(connector.scrobblingDisallowedReason()).toBeNull();
	});

	it('detects pauses and the end of playback from the video', () => {
		Object.assign(video!, { currentTime: 20, paused: false });
		expect(connector.isPlaying()).toBe(true);
		Object.assign(video!, { paused: true });
		expect(connector.isPlaying()).toBe(false);
		Object.assign(video!, { paused: false, ended: true });
		expect(connector.isPlaying()).toBe(false);
	});

	it('does not report playback when the video is missing', () => {
		video = null;
		expect(connector.isPlaying()).toBe(false);
	});

	it.each(['timeupdate', 'play', 'pause', 'ended'])(
		'updates playback on %s even when YouTube replaces the video',
		(eventName) => {
			const registration = documentMock.addEventListener.mock.calls.find(
				([name]) => name === eventName,
			);
			expect(registration).toBeDefined();
			const [, listener, capture] = registration!;
			expect(capture).toBe(true);
			const replacement = { ...video!, currentTime: 1, paused: false };
			video = replacement;
			listener({ target: replacement });
			expect(connector.onStateChanged).toHaveBeenCalledOnce();
			listener({ target: { matches: () => false } });
			expect(connector.onStateChanged).toHaveBeenCalledOnce();
		},
	);
});
