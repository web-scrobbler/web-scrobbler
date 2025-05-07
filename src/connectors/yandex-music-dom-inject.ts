/**
 * This script runs in non-isolated environment(yandex music itself)
 * for accessing window variables
 *
 * Script is run as an IIFE to ensure variables are scoped, as in the event
 * of extension reload/update a new script will have to override the current one.
 *
 * Script starts by calling window.cleanup to cleanup any potential previous script.
 *
 * @returns a cleanup function that cleans up event listeners and similar for a future overriding script.
 */
// cleanup previous script
if ('cleanup' in window && typeof window.cleanup === 'function') {
	(window as unknown as { cleanup: () => void }).cleanup();
}

const enum YandexMusicEvents {
	// on PLAY/OFF, on changing timer offset
	EVENT_STATE,
	// on changing track
	EVENT_TRACK
}

(window as unknown as { cleanup: () => void }).cleanup = (() => {
	interface Window {
		externalAPI: {
			__WEB_SCROBBLER_EVENTS: Partial<Record<YandexMusicEvents, Set<(() => void)>>>,

			on: (event: YandexMusicEvents, listener: () => void) => void;
			off: (event: YandexMusicEvents, listener: () => void) => void;
			EVENT_STATE: YandexMusicEvents.EVENT_STATE;
			EVENT_TRACK: YandexMusicEvents.EVENT_TRACK;
			isPlaying: () => boolean;
			getCurrentTrack: () => {
				title: string;
				album: { title: string } | null; // currently you can't 
				cover: string;
				artists: { title: string }[];
				duration: number;
				link: string | null;
			};
			getProgress: () => { position: number };
		};
	}

	let isPolyfilled = false;
	const abortController = new AbortController();

	const queryAny = (node: ParentNode = document) =>
		<T extends Element>(...queries: string[]) =>
			queries.map((it) => node.querySelector<T>(it)).find(node => node !== null);

	const getBottomBarRoot = () =>
		queryAny()<HTMLDivElement>
			("[class*='PlayerBarDesktop_root']", "[class*='PlayerBarMobile_info']");

	const getTimecodeInput =
		() => queryAny()<HTMLInputElement>("[class*='ChangeTimecode_slider']");

	function reapplyListeners() {
		console.log("applying listeners");
		// @ts-ignore
		const API = window.externalAPI as Window["externalAPI"];

		async function onTimecodeChanged(this: HTMLInputElement, oldTime: number, newTime: number) {
			const timeDifference = newTime - oldTime;
			const currentPlayerTime = () => Number(this.value);
			const triggerStateEvents = () => API.__WEB_SCROBBLER_EVENTS[YandexMusicEvents.EVENT_STATE]?.forEach(it => it());
			const triggerTrackEvents = () => API.__WEB_SCROBBLER_EVENTS[YandexMusicEvents.EVENT_TRACK]?.forEach(it => it());

			if (timeDifference === 1) {
				await new Promise(res => setTimeout(res, 1000));
				if (currentPlayerTime() !== newTime) {
					triggerStateEvents();
				}
				return;
			}

			if (newTime === 0) {
				triggerTrackEvents();
			}
		}

		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
					const oldValue = mutation.oldValue;
					const newValue = getTimecodeInput()!.value;
					onTimecodeChanged.call(getTimecodeInput()!, Number(oldValue), Number(newValue));
				}
			});
		});

		observer.observe(getTimecodeInput()!, {
			attributes: true,
			attributeOldValue: true,
			attributeFilter: ['value'],
			characterData: true,
			characterDataOldValue: true,
		})

		abortController.signal.addEventListener('abort', observer.disconnect);

		isPolyfilled = true;
	}

	function applyExternalAPI_Polyfill() {
		console.log('patching..')

		if (isPolyfilled) {
			console.log("already polyffiled! we don't want to lose our listeners!")
			reapplyListeners();
			return;
		}

		// @ts-expect-error API above
		window.externalAPI = {
			__WEB_SCROBBLER_EVENTS: {},

			EVENT_STATE: YandexMusicEvents.EVENT_STATE,

			EVENT_TRACK: YandexMusicEvents.EVENT_TRACK,

			on(event: YandexMusicEvents, listener: () => void) {
				if (this.__WEB_SCROBBLER_EVENTS[event]) {
					this.__WEB_SCROBBLER_EVENTS[event].add(listener);
				} else {
					this.__WEB_SCROBBLER_EVENTS[event] = new Set([listener]);
				}
			},
			off(event: YandexMusicEvents, listener: () => void) {
				this.__WEB_SCROBBLER_EVENTS[event]?.delete(listener);
			},
			isPlaying: () => queryAny(getBottomBarRoot())('[*|href="#pause_filled"]', '[*|href="#pause"]') instanceof SVGUseElement,
			getCurrentTrack() {
				const duration = Number(getTimecodeInput()?.max);
				const cover = queryAny(getBottomBarRoot())<HTMLImageElement>("img")?.src || ""

				const titleRoot
					= (queryAny(getBottomBarRoot())<HTMLAnchorElement | HTMLDivElement>(
						"[class*='Meta_titleContainer'] a", "[class*='Meta_titleContainer']"
					));

				let href = null;

				if (titleRoot instanceof HTMLAnchorElement) {
					href = titleRoot.href;
				}

				const _artists: string[] = [];
				getBottomBarRoot()?.querySelectorAll("[class*='SeparatedArtists_root']")
					.forEach(it => it.querySelectorAll('a')?.forEach(it => {
						it.innerText && _artists.push(it.innerText);
					}))

				return {
					title: titleRoot?.innerText || "",
					album: null,
					cover,
					artists: _artists.map(title => ({ title })),
					duration,
					link: href,
				}
			},
			getProgress: () => ({ position: Number(getTimecodeInput()?.value) })
		} satisfies Window["externalAPI"];

		reapplyListeners();
	}

	// @ts-ignore
	if (Object.prototype.toString.call(window?.externalAPI) !== "[object Object]") {
		applyExternalAPI_Polyfill();
		const mediaQuery = window.matchMedia('(min-width: 768px)')
		mediaQuery.addEventListener('change', applyExternalAPI_Polyfill, { signal: abortController.signal });
	} else {
		console.log("Seems, Yandex turn back externalAPI. See this link for more details: https://yandexmusic.userecho.ru/communities/6/topics/13791-novyij-dizajn-integratsiya-s-rasshireniyami?page=1")
		console.log("Tell about it to web-scrobbler issues: https://github.com/web-scrobbler/web-scrobbler/issues . It'll remove a lot of code")
		console.log("If you on old Yandex music version skip that message");
	}

	const API = (window as unknown as Window).externalAPI;

	setupListeners();

	function setupListeners() {
		API.on(API.EVENT_STATE, onEvent);
		API.on(API.EVENT_TRACK, onEvent);
		onEvent();
	}

	function onEvent() {
		window.postMessage(
			{
				sender: 'web-scrobbler',
				type: 'YANDEX_MUSIC_STATE',
				trackInfo: getTrackInfo(),
				isPlaying: API.isPlaying(),
			},
			'*',
		);
	}

	function getTrackInfo() {
		const trackInfo = API.getCurrentTrack();

		const track = trackInfo.title || "";
		let album = null;

		if (trackInfo.album) {
			album = trackInfo.album.title;
		}

		let trackArt = null;

		if (isPolyfilled) {
			trackArt = trackInfo.cover
				? trackInfo.cover.replace(/(\d{1,3}x\d{1,3})$/, '400x400')
				: undefined;
		} else {
			// not pollyfied realization
			trackArt = trackInfo.cover
				? `https://${trackInfo.cover.replace('%%', '400x400')}`
				: undefined;
		}

		return {
			track,
			album,
			trackArt,

			artist: trackInfo.artists[0]?.title,
			duration: trackInfo.duration,
			currentTime: API.getProgress().position,
			uniqueID: trackInfo.link,
		};
	}

	return () => {
		console.log('yandex-inject: aborted')
		API.off(API.EVENT_STATE, onEvent);
		API.off(API.EVENT_TRACK, onEvent);
		if (isPolyfilled) {
			abortController.abort("yandex music reinject");

			// @ts-ignore
			window.externalAPI = undefined;
		}
	};
})();
