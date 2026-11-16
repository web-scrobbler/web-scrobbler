import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import webextensionPolyfill from '#/mocks/webextension-polyfill';
webextensionPolyfill.reset();

import BaseConnector from '@/core/content/connector';
import type { ConnectorMeta } from '@/core/connectors';
import * as Util from '@/core/content/util';
import * as MetadataFilter from '@web-scrobbler/metadata-filter';
import {
	DEFAULT_MOBILE_CLIENT_VERSION,
	extractCategoryAndDescriptionFromWatchHtml,
	extractElementTextWithNewlines,
	extractVideoIdFromLocation,
	fetchMobileNextData,
	fetchWatchVideoMetadata,
	fetchYouTubeMusicInfo,
	getActiveChapterTitle,
	isAllowedYouTubeOrigin,
	isMobileYouTubePage,
	isValidYouTubeVideoId,
	normalizeChannelId,
	parseMobileNextResponse,
	readMobileClientVersion,
	setBoundedCache,
} from '@/connectors/helpers/youtube';

describe('YouTube connector helpers', () => {
	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	describe('isValidYouTubeVideoId', () => {
		it('accepts valid 11-character YouTube video IDs', () => {
			expect(isValidYouTubeVideoId('WA3hL4hDx9c')).toBe(true);
			expect(isValidYouTubeVideoId('mHnC_vELJsk')).toBe(true);
			expect(isValidYouTubeVideoId('8XgW1vbNX9g')).toBe(true);
			expect(isValidYouTubeVideoId('a-B_0123456')).toBe(true);
		});

		it('rejects malformed, empty, traversal, or injection payloads', () => {
			for (const invalid of [
				null,
				undefined,
				'',
				'short',
				'too_long_video_id',
				'WA3hL4hDx9c&extra=1',
				'WA3hL4hDx9c#frag',
				'../secret12',
				'WA3hL4h/x9c',
				'__proto__',
				12345678901,
			]) {
				expect(isValidYouTubeVideoId(invalid)).toBe(false);
			}
		});
	});

	describe('isAllowedYouTubeOrigin & isMobileYouTubePage', () => {
		it('allows only HTTPS official YouTube web hosts', () => {
			expect(isAllowedYouTubeOrigin('https://m.youtube.com')).toBe(true);
			expect(isAllowedYouTubeOrigin('https://www.youtube.com')).toBe(
				true,
			);
			expect(isAllowedYouTubeOrigin('https://youtube.com')).toBe(true);
			expect(isAllowedYouTubeOrigin('http://m.youtube.com')).toBe(false);
			expect(isAllowedYouTubeOrigin('https://evil.com')).toBe(false);
			expect(
				isAllowedYouTubeOrigin('https://m.youtube.com.evil.com'),
			).toBe(false);
			expect(isAllowedYouTubeOrigin('https://m.youtube.com/evil')).toBe(
				false,
			);
			expect(isAllowedYouTubeOrigin('https://m.youtube.com:8443')).toBe(
				false,
			);
			expect(isAllowedYouTubeOrigin('https://user@m.youtube.com')).toBe(
				false,
			);
			expect(isAllowedYouTubeOrigin('not-a-url')).toBe(false);
		});

		it('detects mobile hostname strictly', () => {
			expect(isMobileYouTubePage('m.youtube.com')).toBe(true);
			expect(isMobileYouTubePage('www.youtube.com')).toBe(false);
			expect(isMobileYouTubePage('music.youtube.com')).toBe(false);
		});
	});

	describe('normalizeChannelId', () => {
		it('normalizes valid YouTube channel handles and channel/c/user paths', () => {
			expect(
				normalizeChannelId('https://www.youtube.com/@RickAstleyYT'),
			).toBe('@RickAstleyYT');
			expect(
				normalizeChannelId('https://m.youtube.com/@pbx_beats-s/'),
			).toBe('@pbx_beats-s');
			expect(
				normalizeChannelId('/channel/UC2_UQudprVIqYiI45Ve6pDQ'),
			).toBe('channel/UC2_UQudprVIqYiI45Ve6pDQ');
			expect(normalizeChannelId('/c/Monstercat')).toBe('c/Monstercat');
			expect(normalizeChannelId('/user/LegacyChannel')).toBe(
				'user/LegacyChannel',
			);
		});

		it('rejects open-redirect, protocol-relative, non-channel, and traversal inputs', () => {
			for (const invalid of [
				null,
				undefined,
				'',
				'   ',
				'/',
				'//evil.com/@user',
				'https://evil.com/@user',
				'javascript:alert(1)',
				'/@user/../admin',
				'/watch?v=WA3hL4hDx9c',
				'/live/jfKfPfyJRdk',
				'/shorts/jfKfPfyJRdk',
				'/results',
			]) {
				expect(normalizeChannelId(invalid)).toBeNull();
			}
		});
	});

	describe('extractVideoIdFromLocation', () => {
		it('extracts video IDs from watch queries and /live/<id> URLs', () => {
			expect(
				extractVideoIdFromLocation({
					pathname: '/watch',
					search: '?v=WA3hL4hDx9c&t=10s',
				}),
			).toBe('WA3hL4hDx9c');

			expect(
				extractVideoIdFromLocation({
					pathname: '/live/jfKfPfyJRdk',
					search: '?si=sharetoken',
				}),
			).toBe('jfKfPfyJRdk');

			expect(
				extractVideoIdFromLocation({
					pathname: '/live/jfKfPfyJRdk/',
					search: '',
				}),
			).toBe('jfKfPfyJRdk');
		});

		it('ignores home feeds, Shorts, and invalid video IDs', () => {
			expect(
				extractVideoIdFromLocation({ pathname: '/', search: '' }),
			).toBeNull();
			expect(
				extractVideoIdFromLocation({
					pathname: '/shorts/jfKfPfyJRdk',
					search: '',
				}),
			).toBeNull();
			expect(
				extractVideoIdFromLocation({
					pathname: '/watch',
					search: '?v=invalid',
				}),
			).toBeNull();
		});
	});

	describe('readMobileClientVersion', () => {
		it('reads valid INNERTUBE_CLIENT_VERSION and falls back on malformed values', () => {
			const validDoc = {
				scripts: [
					{
						textContent:
							'var x = {"INNERTUBE_CLIENT_VERSION":"2.20260501.03.00"};',
					},
				],
			} as unknown as Document;
			expect(readMobileClientVersion(validDoc)).toBe('2.20260501.03.00');

			const maliciousDoc = {
				scripts: [
					{
						textContent:
							'var x = {"INNERTUBE_CLIENT_VERSION":"1.0;evil()"};',
					},
				],
			} as unknown as Document;
			expect(readMobileClientVersion(maliciousDoc)).toBe(
				DEFAULT_MOBILE_CLIENT_VERSION,
			);
			expect(readMobileClientVersion(null)).toBe(
				DEFAULT_MOBILE_CLIENT_VERSION,
			);
		});
	});

	describe('setBoundedCache', () => {
		it('enforces capacity bounds and prevents prototype key collisions', () => {
			const cache = new Map<string, number>();
			setBoundedCache(cache, 'a', 1, 2);
			setBoundedCache(cache, 'b', 2, 2);
			// Access/refresh 'a' so 'b' becomes oldest
			setBoundedCache(cache, 'a', 10, 2);
			setBoundedCache(cache, 'c', 3, 2);

			expect(cache.size).toBe(2);
			expect(cache.has('b')).toBe(false);
			expect(cache.get('a')).toBe(10);
			expect(cache.get('c')).toBe(3);

			setBoundedCache(cache, '__proto__', 99, 5);
			setBoundedCache(cache, 'constructor', 100, 5);
			expect(cache.get('__proto__')).toBe(99);
			expect(cache.get('constructor')).toBe(100);
			expect(({} as Record<string, unknown>).polluted).toBeUndefined();
		});
	});

	describe('parseMobileNextResponse', () => {
		it('parses slimVideoInformationRenderer, slimOwnerRenderer, description, and DESCRIPTION_CHAPTERS', () => {
			const payload = {
				contents: {
					singleColumnWatchNextResults: {
						results: {
							results: {
								contents: [
									{
										slimVideoMetadataSectionRenderer: {
											contents: [
												{
													slimVideoInformationRenderer:
														{
															title: {
																runs: [
																	{
																		text: 'in my bubble',
																	},
																],
															},
														},
												},
												{
													slimOwnerRenderer: {
														title: {
															runs: [
																{
																	text: 'Chillhop Music',
																},
															],
														},
														navigationEndpoint: {
															browseEndpoint: {
																browseId:
																	'UCOxqgCwgOqC2lMqC5PYz_Dg',
																canonicalBaseUrl:
																	'/@ChillhopMusic',
															},
														},
													},
												},
											],
										},
									},
								],
							},
						},
					},
				},
				engagementPanels: [
					{
						engagementPanelSectionListRenderer: {
							panelIdentifier: 'video-description-ep-identifier',
							content: {
								structuredDescriptionContentRenderer: {
									items: [
										{
											expandableVideoDescriptionBodyRenderer:
												{
													attributedDescriptionBodyText:
														{
															content:
																'Provided to YouTube by Label\n\nTrack Name · Primary Artist · Featured Artist\n\nAlbum Title\n\nAuto-generated by YouTube.',
														},
												},
										},
									],
								},
							},
						},
					},
				],
				playerOverlays: {
					playerOverlayRenderer: {
						decoratedPlayerBarRenderer: {
							decoratedPlayerBarRenderer: {
								playerBar: {
									multiMarkersPlayerBarRenderer: {
										markersMap: [
											{ key: 'HEATSEEKER', value: {} },
											{
												key: 'DESCRIPTION_CHAPTERS',
												value: {
													chapters: [
														{
															chapterRenderer: {
																title: {
																	runs: [
																		{
																			text: 'Second Artist - Second Track',
																		},
																	],
																},
																timeRangeStartMillis:
																	'151000',
															},
														},
														{
															chapterRenderer: {
																title: {
																	runs: [
																		{
																			text: 'First Artist - First Track',
																		},
																	],
																},
																timeRangeStartMillis: 0,
															},
														},
													],
												},
											},
										],
									},
								},
							},
						},
					},
				},
			};

			const parsed = parseMobileNextResponse(payload);
			expect(parsed.title).toBe('in my bubble');
			expect(parsed.channelName).toBe('Chillhop Music');
			expect(parsed.channelId).toBe('@ChillhopMusic');
			expect(parsed.chapters).toEqual([
				{
					title: 'First Artist - First Track',
					timeRangeStartMillis: 0,
				},
				{
					title: 'Second Artist - Second Track',
					timeRangeStartMillis: 151000,
				},
			]);

			const topic = Util.parseYtTopicVideoDescription(parsed.description);
			expect(topic).toEqual({
				artist: 'Primary Artist',
				track: 'Track Name (feat. Featured Artist)',
				album: 'Album Title',
			});
		});

		it('parses videoMetadataViewModel and compactifyVideoActionBarViewModel channelBar', () => {
			const payload = {
				contents: {
					singleColumnWatchNextResults: {
						results: {
							results: {
								contents: [
									{
										slimVideoMetadataSectionRenderer: {
											contents: [
												{
													videoMetadataViewModel: {
														title: {
															content:
																'FLUX CONDUCT | HARLEQUINADE',
														},
													},
												},
												{
													compactifyVideoActionBarViewModel:
														{
															channelBar: {
																compactChannelBarViewModel:
																	{
																		channelBarHeader:
																			{
																				channelBarHeaderViewModel:
																					{
																						style: 'CHANNEL_BAR_HEADER_STYLE_SHOW_ONLY_AVATAR',
																						title: 'pbx the Brand ',
																						onTap: {
																							innertubeCommand:
																								{
																									browseEndpoint:
																										{
																											browseId:
																												'UCDfJTE5ociK2NcMtpa_e0BA',
																											canonicalBaseUrl:
																												'/@pbx_beats-s',
																										},
																								},
																						},
																					},
																			},
																	},
															},
														},
												},
											],
										},
									},
								],
							},
						},
					},
				},
			};

			const parsed = parseMobileNextResponse(payload);
			expect(parsed).toEqual({
				title: 'FLUX CONDUCT | HARLEQUINADE',
				channelName: 'pbx the Brand',
				channelId: '@pbx_beats-s',
				description: null,
				chapters: [],
			});
		});

		it('falls back to videoDescriptionHeaderRenderer and legacy slimVideoMetadataRenderer', () => {
			const payload = {
				contents: {
					singleColumnWatchNextResults: {
						results: {
							results: {
								contents: [
									{
										itemSectionRenderer: {
											contents: [
												{
													slimVideoMetadataRenderer: {
														title: {
															runs: [
																{
																	text: 'Legacy Title',
																},
															],
														},
														description: {
															runs: [
																{
																	text: 'Legacy line 1\n',
																},
																{
																	text: 'Legacy line 2',
																},
															],
														},
													},
												},
											],
										},
									},
								],
							},
						},
					},
				},
				engagementPanels: [
					{
						engagementPanelSectionListRenderer: {
							panelIdentifier: 'video-description-ep-identifier',
							content: {
								structuredDescriptionContentRenderer: {
									items: [
										{
											videoDescriptionHeaderRenderer: {
												channel: {
													runs: [
														{
															text: 'Fallback Channel',
														},
													],
												},
												channelNavigationEndpoint: {
													browseEndpoint: {
														browseId:
															'UC1VLey4KHEALRvqD3wSiGUA',
													},
												},
											},
										},
									],
								},
							},
						},
					},
				],
			};

			const parsed = parseMobileNextResponse(payload);
			expect(parsed.title).toBe('Legacy Title');
			expect(parsed.channelName).toBe('Fallback Channel');
			expect(parsed.channelId).toBe('channel/UC1VLey4KHEALRvqD3wSiGUA');
			expect(parsed.description).toBe('Legacy line 1\nLegacy line 2');
		});

		it('handles null or malformed payloads safely', () => {
			for (const badPayload of [null, undefined, 'str', 42, [], {}]) {
				expect(parseMobileNextResponse(badPayload)).toEqual({
					title: null,
					channelName: null,
					channelId: null,
					description: null,
					chapters: [],
				});
			}
		});
	});

	describe('getActiveChapterTitle', () => {
		const chapters = [
			{ title: 'Intro - Track A', timeRangeStartMillis: 10_000 },
			{ title: 'Track B', timeRangeStartMillis: 60_000 },
			{ title: 'Track C', timeRangeStartMillis: 120_000 },
		];

		it('resolves active chapter across boundaries and before chapter 0', () => {
			expect(getActiveChapterTitle(chapters, 5)).toBeNull();
			expect(getActiveChapterTitle(chapters, 10)).toBe('Intro - Track A');
			expect(getActiveChapterTitle(chapters, 59.9)).toBe(
				'Intro - Track A',
			);
			expect(getActiveChapterTitle(chapters, 60)).toBe('Track B');
			expect(getActiveChapterTitle(chapters, 180)).toBe('Track C');
		});

		it('returns null for empty chapters or invalid times', () => {
			expect(getActiveChapterTitle([], 10)).toBeNull();
			expect(getActiveChapterTitle(chapters, -1)).toBeNull();
			expect(getActiveChapterTitle(chapters, NaN)).toBeNull();
		});
	});

	describe('extractCategoryAndDescriptionFromWatchHtml', () => {
		it('extracts JSON-decoded category and shortDescription safely', () => {
			const html =
				'<script>var ytInitialPlayerResponse = {"videoDetails":{"shortDescription":"Provided to YouTube\\n\\nFugitive \\u00b7 Time, The Valuator\\n\\nAlbum \\"Fragile\\"\\n\\nAuto-generated by YouTube."},"microformat":{"playerMicroformatRenderer":{"category":"Music"}}};</script>';
			expect(extractCategoryAndDescriptionFromWatchHtml(html)).toEqual({
				category: 'Music',
				shortDescription:
					'Provided to YouTube\n\nFugitive \u00b7 Time, The Valuator\n\nAlbum "Fragile"\n\nAuto-generated by YouTube.',
			});
		});

		it('handles missing fields and large inputs in linear time without errors', () => {
			const noise = `${'{"category":123}'.repeat(40_000)}"shortDescription":"unterminated`;
			const start = Date.now();
			const result = extractCategoryAndDescriptionFromWatchHtml(noise);
			expect(Date.now() - start).toBeLessThan(200);
			expect(result).toEqual({
				category: null,
				shortDescription: null,
			});
		});
	});

	describe('extractElementTextWithNewlines', () => {
		it('preserves line breaks across BR and block nodes without relying on innerText', () => {
			const nodeTree = {
				nodeType: 1,
				tagName: 'YTM-CRAWLER-DESCRIPTION',
				childNodes: [
					{
						nodeType: 1,
						tagName: 'DIV',
						childNodes: [
							{ nodeType: 3, nodeValue: 'Provided to YouTube' },
						],
					},
					{ nodeType: 1, tagName: 'BR', childNodes: [] },
					{
						nodeType: 1,
						tagName: 'SPAN',
						childNodes: [
							{ nodeType: 3, nodeValue: 'Song · Artist' },
						],
					},
					{
						nodeType: 1,
						tagName: 'SCRIPT',
						childNodes: [{ nodeType: 3, nodeValue: 'ignored()' }],
					},
					{
						nodeType: 1,
						tagName: 'P',
						childNodes: [{ nodeType: 3, nodeValue: 'Album' }],
					},
					{
						nodeType: 1,
						tagName: 'DIV',
						childNodes: [
							{
								nodeType: 3,
								nodeValue: 'Auto-generated by YouTube.',
							},
						],
					},
				],
			} as unknown as Node;

			const text = extractElementTextWithNewlines(nodeTree);
			expect(text).toBe(
				'Provided to YouTube\n\nSong · Artist\nAlbum\nAuto-generated by YouTube.',
			);
			expect(Util.parseYtTopicVideoDescription(text)).toEqual({
				artist: 'Artist',
				track: 'Song',
				album: 'Album',
			});
		});
	});

	describe('async fetch helpers', () => {
		it('rejects disallowed origin or invalid videoId before invoking fetch', async () => {
			const fetchSpy = vi.fn();
			global.fetch = fetchSpy as unknown as typeof fetch;

			const res1 = await fetchMobileNextData(
				'https://evil.example',
				'WA3hL4hDx9c',
				'2.20261113.00.00',
			);
			const res2 = await fetchWatchVideoMetadata(
				'https://m.youtube.com',
				'../bad',
			);
			const res3 = await fetchYouTubeMusicInfo('invalid');

			expect(res1.status).toBe('error');
			expect(res2.status).toBe('error');
			expect(res3.status).toBe('error');
			expect(fetchSpy).not.toHaveBeenCalled();
		});

		it('distinguishes parent navigation aborts from HTTP errors and parses OMV data', async () => {
			const controller = new AbortController();
			global.fetch = vi.fn((_url: string, init?: RequestInit) => {
				return new Promise((_resolve, reject) => {
					init?.signal?.addEventListener('abort', () => {
						reject(new DOMException('Aborted', 'AbortError'));
					});
				});
			}) as unknown as typeof fetch;

			const pendingFetch = fetchMobileNextData(
				'https://m.youtube.com',
				'WA3hL4hDx9c',
				'2.20261113.00.00',
				controller.signal,
			);
			controller.abort();
			expect(await pendingFetch).toEqual({ status: 'aborted' });

			global.fetch = vi.fn().mockResolvedValue({
				ok: true,
				json: () =>
					Promise.resolve({
						videoDetails: {
							musicVideoType: 'MUSIC_VIDEO_TYPE_OMV',
							author: 'Rick Astley',
							title: 'Never Gonna Give You Up',
						},
					}),
			}) as unknown as typeof fetch;

			expect(await fetchYouTubeMusicInfo('dQw4w9WgXcQ')).toEqual({
				status: 'ok',
				data: {
					done: true,
					recognisedByYtMusic: true,
					currentTrackInfo: {
						artist: 'Rick Astley',
						track: 'Never Gonna Give You Up',
					},
				},
			});

			global.fetch = vi.fn().mockResolvedValue({
				ok: false,
				status: 503,
			}) as unknown as typeof fetch;

			expect(
				await fetchWatchVideoMetadata(
					'https://m.youtube.com',
					'dQw4w9WgXcQ',
				),
			).toEqual({
				status: 'error',
				reason: 'HTTP 503',
			});
		});
	});
});

interface MockEnvironmentOptions {
	url: string;
	isPlaying?: boolean;
	currentTime?: number;
	duration?: number;
	playbackRate?: number;
	adShowing?: boolean;
	desktopVideoId?: string | null;
	domTitle?: string | null;
	domChannelName?: string | null;
	domChannelHref?: string | null;
	domDescription?: string | null;
	hasDescriptionChaptersPanel?: boolean;
	desktopChapterTitle?: string | null;
	options?: Partial<{
		scrobbleMusicOnly: boolean;
		scrobbleEntertainmentOnly: boolean;
		scrobbleMusicRecognisedOnly: boolean;
		enableGetTrackInfoFromYtMusic: boolean;
	}>;
}

describe('YouTube connector integration on mobile and desktop', () => {
	const originalWindow = globalThis.window;
	const originalDocument = globalThis.document;
	const originalFetch = globalThis.fetch;
	const originalConnector = globalThis.Connector;
	const originalUtil = globalThis.Util;
	const originalMetadataFilter = globalThis.MetadataFilter;
	const originalMutationObserver = globalThis.MutationObserver;

	afterEach(() => {
		vi.resetModules();
		vi.restoreAllMocks();
		globalThis.window = originalWindow;
		globalThis.document = originalDocument;
		globalThis.fetch = originalFetch;
		globalThis.Connector = originalConnector;
		globalThis.Util = originalUtil;
		globalThis.MetadataFilter = originalMetadataFilter;
		globalThis.MutationObserver = originalMutationObserver;
	});

	async function setupConnectorEnvironment(config: MockEnvironmentOptions) {
		vi.resetModules();

		let currentConfig = { ...config };
		let currentUrl = new URL(config.url);
		const windowListeners = new Map<string, Set<EventListener>>();
		const videoListeners = new Map<string, Set<EventListener>>();

		const videoElement = {
			get currentTime() {
				return currentConfig.currentTime ?? 10;
			},
			get duration() {
				return currentConfig.duration ?? 180;
			},
			get playbackRate() {
				return currentConfig.playbackRate ?? 1;
			},
			addEventListener: (name: string, fn: EventListener) => {
				const set = videoListeners.get(name) ?? new Set();
				set.add(fn);
				videoListeners.set(name, set);
			},
		};

		const playerNode = {
			classList: {
				contains: (cls: string) =>
					cls === 'playing-mode'
						? (currentConfig.isPlaying ?? true)
						: false,
			},
		};

		const makeTextElement = (text: string) => ({
			innerText: text,
			textContent: text,
			nodeType: 1,
			tagName: 'DIV',
			childNodes: [{ nodeType: 3, nodeValue: text }],
		});

		const selectorMap = (): Record<string, unknown> => ({
			'#player': playerNode,
			'#movie_player': playerNode,
			'.html5-video-player': playerNode,
			'#movie_player video.html5-main-video': videoElement,
			'#player video.html5-main-video': videoElement,
			'.html5-main-video': videoElement,
			'#movie_player video.html5-main-video, #player video.html5-main-video, .html5-main-video':
				videoElement,
			'#movie_player.ad-showing, #movie_player.ad-interrupting, .ad-showing, .ad-interrupting':
				currentConfig.adShowing ? playerNode : null,
			'ytd-watch-flexy': currentConfig.desktopVideoId
				? {
						getAttribute: (attr: string) =>
							attr === 'video-id'
								? currentConfig.desktopVideoId
								: null,
					}
				: null,
			'.html5-video-player .ytp-title-link': currentConfig.domTitle
				? makeTextElement(currentConfig.domTitle)
				: null,
			'#top-row .ytd-channel-name a': currentConfig.domChannelName
				? makeTextElement(currentConfig.domChannelName)
				: null,
			'#upload-info .ytd-channel-name .yt-simple-endpoint':
				currentConfig.domChannelHref
					? { href: currentConfig.domChannelHref }
					: null,
			'#description.ytd-expandable-video-description-body-renderer':
				currentConfig.domDescription
					? makeTextElement(currentConfig.domDescription)
					: null,
			'[target-id="engagement-panel-macro-markers-description-chapters"]':
				currentConfig.hasDescriptionChaptersPanel ? playerNode : null,
			'.html5-video-player .ytp-chapter-title-content':
				currentConfig.desktopChapterTitle
					? makeTextElement(currentConfig.desktopChapterTitle)
					: null,
		});

		const querySingle = (selector: string) =>
			selectorMap()[selector] ?? null;

		const docMock = {
			get location() {
				return currentUrl;
			},
			scripts: [],
			body: {},
			documentElement: {},
			querySelector: (selector: string) => querySingle(selector),
			querySelectorAll: (selector: string) => {
				const found = querySingle(selector);
				return found ? [found] : [];
			},
		};

		const winMock = {
			get location() {
				return currentUrl;
			},
			addEventListener: (name: string, fn: EventListener) => {
				const set = windowListeners.get(name) ?? new Set();
				set.add(fn);
				windowListeners.set(name, set);
			},
		};

		class FakeMutationObserver {
			public observe() {
				// No-op in mock
			}
			public disconnect() {
				// No-op in mock
			}
		}

		globalThis.window = winMock as unknown as Window & typeof globalThis;
		globalThis.document = docMock as unknown as Document;
		globalThis.MutationObserver =
			FakeMutationObserver as unknown as typeof MutationObserver;

		const meta: ConnectorMeta = {
			label: 'YouTube',
			matches: ['*://www.youtube.com/*', '*://m.youtube.com/*'],
			js: 'youtube.js',
			id: 'youtube',
			usesBlocklist: true,
		};

		const connector = new BaseConnector(meta);
		connector.onStateChanged = vi.fn();

		const resolvedOptions = {
			scrobbleMusicOnly: false,
			scrobbleEntertainmentOnly: false,
			scrobbleMusicRecognisedOnly: false,
			enableGetTrackInfoFromYtMusic: false,
			...config.options,
		};

		const utilProxy = {
			...Util,
			debugLog: vi.fn(),
			getOption: vi.fn((_conn: string, key: string) =>
				Promise.resolve(
					Boolean(
						resolvedOptions[key as keyof typeof resolvedOptions],
					),
				),
			),
		};

		globalThis.Connector = connector;
		globalThis.Util = utilProxy as unknown as typeof Util;
		globalThis.MetadataFilter = MetadataFilter;

		await import('@/connectors/youtube');
		// Flush readConnectorOptions microtasks
		await Promise.resolve();
		await Promise.resolve();

		return {
			connector,
			updateConfig: (next: Partial<MockEnvironmentOptions>) => {
				currentConfig = { ...currentConfig, ...next };
				if (next.url) {
					currentUrl = new URL(next.url);
				}
			},
			dispatchWindowEvent: (name: string) => {
				for (const fn of windowListeners.get(name) ?? []) {
					fn({} as Event);
				}
			},
		};
	}

	async function flushAsync() {
		for (let i = 0; i < 10; i++) {
			await Promise.resolve();
		}
	}

	beforeEach(() => {
		webextensionPolyfill.reset();
	});

	it('does not issue API requests on m.youtube.com home feed', async () => {
		const fetchSpy = vi.fn();
		globalThis.fetch = fetchSpy as unknown as typeof fetch;

		const { connector } = await setupConnectorEnvironment({
			url: 'https://m.youtube.com/',
			options: {
				scrobbleMusicOnly: true,
				scrobbleMusicRecognisedOnly: true,
				enableGetTrackInfoFromYtMusic: true,
			},
		});

		expect(connector.getUniqueID()).toBeNull();
		expect(Util.isArtistTrackEmpty(connector.getTrackInfo() ?? null)).toBe(
			true,
		);
		expect(connector.scrobblingDisallowedReason()).toBe('Other');
		expect(fetchSpy).not.toHaveBeenCalled();
	});

	it('prevents stale DOM leak while /next loads, then wakes Connector and extracts channel/title cleanly', async () => {
		let resolveNext!: (value: unknown) => void;
		globalThis.fetch = vi.fn((url: string) => {
			if (url.endsWith('/youtubei/v1/next')) {
				return new Promise((resolve) => {
					resolveNext = resolve;
				});
			}
			return Promise.reject(new Error(`Unexpected fetch: ${url}`));
		}) as unknown as typeof fetch;

		const { connector } = await setupConnectorEnvironment({
			url: 'https://m.youtube.com/watch?v=8XgW1vbNX9g',
			domTitle: 'Stale Previous Video Title - Wrong Artist',
		});

		expect(connector.scrobblingDisallowedReason()).toBe('IsLoading');
		expect(connector.getTrackInfo()).toEqual({});
		expect(connector.getChannelId?.()).toBe('');

		resolveNext({
			ok: true,
			json: () =>
				Promise.resolve({
					contents: {
						singleColumnWatchNextResults: {
							results: {
								results: {
									contents: [
										{
											slimVideoMetadataSectionRenderer: {
												contents: [
													{
														videoMetadataViewModel:
															{
																title: {
																	content:
																		'Artist Name - Track Name [Official Video]',
																},
															},
													},
													{
														compactifyVideoActionBarViewModel:
															{
																channelBar: {
																	compactChannelBarViewModel:
																		{
																			channelBarHeader:
																				{
																					channelBarHeaderViewModel:
																						{
																							style: 'CHANNEL_BAR_HEADER_STYLE_SHOW_ONLY_AVATAR',
																							title: 'pbx the Brand ',
																							onTap: {
																								innertubeCommand:
																									{
																										browseEndpoint:
																											{
																												canonicalBaseUrl:
																													'/@pbx_beats-s',
																											},
																									},
																							},
																						},
																				},
																		},
																},
															},
													},
												],
											},
										},
									],
								},
							},
						},
					},
				}),
		});

		await flushAsync();

		expect(connector.onStateChanged).toHaveBeenCalled();
		expect(connector.scrobblingDisallowedReason()).toBeNull();
		expect(connector.getUniqueID()).toBe('8XgW1vbNX9g');
		expect(connector.getOriginUrl()).toBe('https://youtu.be/8XgW1vbNX9g');
		expect(connector.getChannelId?.()).toBe('@pbx_beats-s');
		expect(connector.getChannelLabel?.()).toBe('pbx the Brand');
		expect(connector.getTrackInfo()).toEqual({
			artist: 'Artist Name',
			track: 'Track Name [Official Video]',
		});
	});

	it('falls back to /watch?v= shortDescription for unplayable-next Topic videos and respects Music category', async () => {
		globalThis.fetch = vi.fn((url: string) => {
			if (url.endsWith('/youtubei/v1/next')) {
				return Promise.resolve({
					ok: true,
					json: () =>
						Promise.resolve({
							contents: {
								singleColumnWatchNextResults: {
									results: {
										results: {
											contents: [
												{
													slimVideoMetadataSectionRenderer:
														{
															contents: [
																{
																	slimVideoInformationRenderer:
																		{
																			title: {
																				runs: [
																					{
																						text: 'Fugitive',
																					},
																				],
																			},
																		},
																},
																{
																	slimOwnerRenderer:
																		{
																			title: {
																				runs: [
																					{
																						text: 'Time, The Valuator - Topic',
																					},
																				],
																			},
																			navigationEndpoint:
																				{
																					browseEndpoint:
																						{
																							browseId:
																								'UC2_UQudprVIqYiI45Ve6pDQ',
																						},
																				},
																		},
																},
															],
														},
												},
											],
										},
									},
								},
							},
						}),
				});
			}
			if (url === 'https://m.youtube.com/watch?v=WA3hL4hDx9c') {
				return Promise.resolve({
					ok: true,
					text: () =>
						Promise.resolve(
							'{"videoDetails":{"shortDescription":"Provided to YouTube by The Orchard\\n\\nFugitive \\u00b7 Time, The Valuator\\n\\nHow Fleeting, How Fragile\\n\\nAuto-generated by YouTube."},"microformat":{"playerMicroformatRenderer":{"category":"Music"}}}',
						),
				});
			}
			return Promise.reject(new Error(`Unexpected URL: ${url}`));
		}) as unknown as typeof fetch;

		const { connector } = await setupConnectorEnvironment({
			url: 'https://m.youtube.com/watch?v=WA3hL4hDx9c',
			options: { scrobbleMusicOnly: true },
		});

		expect(connector.scrobblingDisallowedReason()).toBe('IsLoading');
		await flushAsync();

		expect(connector.scrobblingDisallowedReason()).toBeNull();
		expect(connector.getTrackInfo()).toEqual({
			artist: 'Time, The Valuator',
			track: 'Fugitive',
			album: 'How Fleeting, How Fragile',
		});
	});

	it('resolves chapters dynamically on m.youtube.com and clears uniqueID/timeInfo', async () => {
		globalThis.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () =>
				Promise.resolve({
					playerOverlays: {
						playerOverlayRenderer: {
							decoratedPlayerBarRenderer: {
								decoratedPlayerBarRenderer: {
									playerBar: {
										multiMarkersPlayerBarRenderer: {
											markersMap: [
												{
													key: 'DESCRIPTION_CHAPTERS',
													value: {
														chapters: [
															{
																chapterRenderer:
																	{
																		title: {
																			runs: [
																				{
																					text: 'mommy - Flashes of Calm',
																				},
																			],
																		},
																		timeRangeStartMillis: 0,
																	},
															},
															{
																chapterRenderer:
																	{
																		title: {
																			runs: [
																				{
																					text: 'dryhope - Ever Forward',
																				},
																			],
																		},
																		timeRangeStartMillis: 151000,
																	},
															},
														],
													},
												},
											],
										},
									},
								},
							},
						},
					},
				}),
		}) as unknown as typeof fetch;

		const { connector, updateConfig } = await setupConnectorEnvironment({
			url: 'https://m.youtube.com/watch?v=eYLbteOm42k',
			currentTime: 20,
		});

		connector.scrobblingDisallowedReason();
		await flushAsync();

		expect(connector.getUniqueID()).toBeNull();
		expect(connector.getTimeInfo()).toBeNull();
		expect(connector.getTrackInfo()).toEqual({
			artist: 'mommy',
			track: 'Flashes of Calm',
		});

		updateConfig({ currentTime: 160 });
		expect(connector.getTrackInfo()).toEqual({
			artist: 'dryhope',
			track: 'Ever Forward',
		});
	});

	it('supports /live/<id> URLs and aborts superseded SPA transitions cleanly', async () => {
		const abortedSignals: boolean[] = [];

		globalThis.fetch = vi.fn((url: string, init?: RequestInit) => {
			if (url.endsWith('/youtubei/v1/next')) {
				const parsedBody = JSON.parse(String(init?.body)) as {
					videoId: string;
				};
				if (parsedBody.videoId === 'jfKfPfyJRdk') {
					return new Promise(() => {
						init?.signal?.addEventListener('abort', () => {
							abortedSignals.push(true);
						});
					});
				}
				return Promise.resolve({
					ok: true,
					json: () =>
						Promise.resolve({
							contents: {
								singleColumnWatchNextResults: {
									results: {
										results: {
											contents: [
												{
													slimVideoMetadataSectionRenderer:
														{
															contents: [
																{
																	videoMetadataViewModel:
																		{
																			title: {
																				content:
																					'Next Artist - Next Track',
																			},
																		},
																},
															],
														},
												},
											],
										},
									},
								},
							},
						}),
				});
			}
			return Promise.reject(new Error(`Unexpected URL: ${url}`));
		}) as unknown as typeof fetch;

		const { connector, updateConfig, dispatchWindowEvent } =
			await setupConnectorEnvironment({
				url: 'https://m.youtube.com/live/jfKfPfyJRdk',
			});

		expect(connector.getUniqueID()).toBe('jfKfPfyJRdk');
		expect(connector.scrobblingDisallowedReason()).toBe('IsLoading');

		updateConfig({ url: 'https://m.youtube.com/watch?v=dQw4w9WgXcQ' });
		dispatchWindowEvent('state-navigateend');

		expect(abortedSignals).toEqual([true]);
		// Simulate Controller evaluating state on state-navigateend notification
		expect(connector.scrobblingDisallowedReason()).toBe('IsLoading');
		await flushAsync();

		expect(connector.getUniqueID()).toBe('dQw4w9WgXcQ');
		expect(connector.scrobblingDisallowedReason()).toBeNull();
		expect(connector.getTrackInfo()).toEqual({
			artist: 'Next Artist',
			track: 'Next Track',
		});
	});

	it('wakes Connector when YouTube Music recognition finishes on m.youtube.com', async () => {
		globalThis.fetch = vi.fn((url: string) => {
			if (url === 'https://m.youtube.com/youtubei/v1/next') {
				return Promise.resolve({
					ok: true,
					json: () =>
						Promise.resolve({
							contents: {
								singleColumnWatchNextResults: {
									results: {
										results: {
											contents: [
												{
													slimVideoMetadataSectionRenderer:
														{
															contents: [
																{
																	videoMetadataViewModel:
																		{
																			title: {
																				content:
																					'Fallback Video Title',
																			},
																		},
																},
															],
														},
												},
											],
										},
									},
								},
							},
						}),
				});
			}
			if (url === 'https://music.youtube.com/youtubei/v1/player') {
				return Promise.resolve({
					ok: true,
					json: () =>
						Promise.resolve({
							videoDetails: {
								musicVideoType: 'MUSIC_VIDEO_TYPE_OMV',
								author: 'YTM Official Artist',
								title: 'YTM Official Track',
							},
						}),
				});
			}
			return Promise.reject(new Error(`Unexpected URL: ${url}`));
		}) as unknown as typeof fetch;

		const { connector } = await setupConnectorEnvironment({
			url: 'https://m.youtube.com/watch?v=mHnC_vELJsk',
			options: {
				scrobbleMusicRecognisedOnly: true,
				enableGetTrackInfoFromYtMusic: true,
			},
		});

		expect(connector.scrobblingDisallowedReason()).toBe('IsLoading');
		await flushAsync();

		expect(connector.onStateChanged).toHaveBeenCalled();
		expect(connector.scrobblingDisallowedReason()).toBeNull();
		expect(connector.getTrackInfo()).toEqual({
			artist: 'YTM Official Artist',
			track: 'YTM Official Track',
		});
	});

	it('preserves desktop www.youtube.com DOM extraction and guards invalid playbackRate', async () => {
		globalThis.fetch = vi.fn() as unknown as typeof fetch;

		const { connector, updateConfig } = await setupConnectorEnvironment({
			url: 'https://www.youtube.com/watch?v=mHnC_vELJsk',
			desktopVideoId: 'mHnC_vELJsk',
			domTitle: 'Rick Astley - Never Gonna Give You Up',
			domChannelName: 'Rick Astley',
			domChannelHref: 'https://www.youtube.com/@RickAstleyYT',
			currentTime: 50,
			duration: 210,
			playbackRate: 0,
		});

		expect(connector.playerSelector).toEqual(['#content', '#app']);
		expect(connector.getUniqueID()).toBe('mHnC_vELJsk');
		expect(connector.getChannelId?.()).toBe('@RickAstleyYT');
		expect(connector.getTimeInfo()).toEqual({
			currentTime: 50,
			duration: 210,
		});
		expect(connector.getTrackInfo()).toEqual({
			artist: 'Rick Astley',
			track: 'Never Gonna Give You Up',
		});

		updateConfig({ adShowing: true });
		expect(connector.scrobblingDisallowedReason()).toBe('IsAd');
	});

	it('retries cleanly on back navigation after abort and exposes mobile infobox/love selectors', async () => {
		let attemptsForVidA = 0;
		globalThis.fetch = vi.fn((url: string, init?: RequestInit) => {
			if (url.endsWith('/youtubei/v1/next')) {
				const parsed = JSON.parse(String(init?.body)) as {
					videoId: string;
				};
				if (parsed.videoId === 'AAAAAAAAAAA') {
					attemptsForVidA += 1;
					if (attemptsForVidA === 1) {
						return new Promise(() => {
							// Remains pending until aborted by navigation
						});
					}
					return Promise.resolve({
						ok: true,
						json: () =>
							Promise.resolve({
								contents: {
									singleColumnWatchNextResults: {
										results: {
											results: {
												contents: [
													{
														slimVideoMetadataSectionRenderer:
															{
																contents: [
																	{
																		videoMetadataViewModel:
																			{
																				title: {
																					content:
																						'Artist A - Track A',
																				},
																			},
																	},
																],
															},
													},
												],
											},
										},
									},
								},
							}),
					});
				}
				return Promise.resolve({
					ok: true,
					json: () =>
						Promise.resolve({
							contents: {
								singleColumnWatchNextResults: {
									results: {
										results: {
											contents: [
												{
													slimVideoMetadataSectionRenderer:
														{
															contents: [
																{
																	videoMetadataViewModel:
																		{
																			title: {
																				content:
																					'Artist B - Track B',
																			},
																		},
																},
															],
														},
												},
											],
										},
									},
								},
							},
						}),
				});
			}
			if (url.startsWith('https://m.youtube.com/watch?v=')) {
				return Promise.resolve({
					ok: true,
					text: () =>
						Promise.resolve(
							'{"microformat":{"playerMicroformatRenderer":{"category":"Gaming"}}}',
						),
				});
			}
			if (url === 'https://music.youtube.com/youtubei/v1/player') {
				return Promise.resolve({
					ok: true,
					json: () =>
						Promise.resolve({
							videoDetails: { musicVideoType: 'NON_MUSIC' },
						}),
				});
			}
			return Promise.reject(new Error(`Unexpected URL: ${url}`));
		}) as unknown as typeof fetch;

		const { connector, updateConfig, dispatchWindowEvent } =
			await setupConnectorEnvironment({
				url: 'https://m.youtube.com/watch?v=AAAAAAAAAAA',
				options: {
					scrobbleMusicOnly: true,
					scrobbleMusicRecognisedOnly: true,
				},
			});

		expect(connector.scrobbleInfoLocationSelector).toContain(
			'ytm-slim-video-metadata-section-renderer',
		);
		expect(connector.loveButtonSelector).toContain(
			'ytm-slim-video-metadata-section-renderer like-button-view-model button[aria-pressed="false"]',
		);
		expect(connector.unloveButtonSelector).toContain(
			'ytm-slim-video-metadata-section-renderer like-button-view-model button[aria-pressed="true"]',
		);

		// First load starts pending fetch for A
		expect(connector.scrobblingDisallowedReason()).toBe('IsLoading');

		// Navigate to B (aborts A), then return back via popstate to A
		updateConfig({ url: 'https://m.youtube.com/watch?v=BBBBBBBBBBB' });
		dispatchWindowEvent('state-navigateend');
		connector.scrobblingDisallowedReason();
		await flushAsync();
		expect(connector.scrobblingDisallowedReason()).toBe(
			'NotOnYouTubeMusic',
		);

		updateConfig({ url: 'https://m.youtube.com/watch?v=AAAAAAAAAAA' });
		dispatchWindowEvent('popstate');
		expect(connector.scrobblingDisallowedReason()).toBe('IsLoading');
		await flushAsync();

		expect(attemptsForVidA).toBe(2);
		expect(connector.getTrackInfo()).toEqual({
			artist: 'Artist A',
			track: 'Track A',
		});
		// Non-music YTM status takes priority over ForbiddenYouTubeCategory
		expect(connector.scrobblingDisallowedReason()).toBe(
			'NotOnYouTubeMusic',
		);
	});

	it('prevents delayed settlement of an aborted request from clobbering a restarted request', async () => {
		let resolveStaleA!: (value: unknown) => void;
		let attemptsForA = 0;

		globalThis.fetch = vi.fn((url: string, init?: RequestInit) => {
			if (url.endsWith('/youtubei/v1/next')) {
				const parsed = JSON.parse(String(init?.body)) as {
					videoId: string;
				};
				if (parsed.videoId === 'CCCCCCCCCCC') {
					attemptsForA += 1;
					if (attemptsForA === 1) {
						return new Promise((resolve) => {
							resolveStaleA = resolve;
						});
					}
					return Promise.resolve({
						ok: true,
						json: () =>
							Promise.resolve({
								contents: {
									singleColumnWatchNextResults: {
										results: {
											results: {
												contents: [
													{
														slimVideoMetadataSectionRenderer:
															{
																contents: [
																	{
																		videoMetadataViewModel:
																			{
																				title: {
																					content:
																						'Fresh Artist - Fresh Track',
																				},
																			},
																	},
																],
															},
													},
												],
											},
										},
									},
								},
							}),
					});
				}
				return Promise.resolve({
					ok: true,
					json: () => Promise.resolve({}),
				});
			}
			return Promise.reject(new Error(`Unexpected URL: ${url}`));
		}) as unknown as typeof fetch;

		const { connector, updateConfig, dispatchWindowEvent } =
			await setupConnectorEnvironment({
				url: 'https://m.youtube.com/watch?v=CCCCCCCCCCC',
			});

		expect(connector.scrobblingDisallowedReason()).toBe('IsLoading');

		// Navigate to another video (aborts attempt 1), then immediately navigate back (starts attempt 2)
		updateConfig({ url: 'https://m.youtube.com/watch?v=DDDDDDDDDDD' });
		dispatchWindowEvent('state-navigateend');

		updateConfig({ url: 'https://m.youtube.com/watch?v=CCCCCCCCCCC' });
		dispatchWindowEvent('popstate');
		expect(connector.scrobblingDisallowedReason()).toBe('IsLoading');

		// Settle the older aborted promise late; identity + abort guards must ignore it
		resolveStaleA({
			ok: true,
			json: () =>
				Promise.resolve({
					contents: {
						singleColumnWatchNextResults: {
							results: {
								results: {
									contents: [
										{
											slimVideoMetadataSectionRenderer: {
												contents: [
													{
														videoMetadataViewModel:
															{
																title: {
																	content:
																		'Stale Artist - Stale Track',
																},
															},
													},
												],
											},
										},
									],
								},
							},
						},
					},
				}),
		});

		await flushAsync();

		expect(attemptsForA).toBe(2);
		expect(connector.getTrackInfo()).toEqual({
			artist: 'Fresh Artist',
			track: 'Fresh Track',
		});
	});
});
