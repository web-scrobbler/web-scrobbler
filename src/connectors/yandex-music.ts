export {};

const currentCollapsedPlayerSelector =
	'section[class*="PlayerBar_root__"]:has([class*="Meta_titleContainer__"])';
const vibePageSelector = 'div[class*="VibePage_meta__"]';
const vibePlayerSelector = 'section[class*="VibePlayerBar_root__"]';
const mobilePlayerSelector = 'section[class*="PlayerBarMobile_root__"]';
const backgroundProgressPlayerSelector =
	"section[class*='PlayerBarDesktopWithBackgroundProgressBar_root']";
const veryOldPlayButtonSelector = '.player-controls__btn_play';
const stateObservers = new Map<string, () => void>();

type ConnectorLayout =
	| 'current-collapsed'
	| 'vibe'
	| 'mobile-player'
	| 'background-progress'
	| 'very-old';

let activeLayout: ConnectorLayout | null = null;
let isLayoutObserverStarted = false;

setupConnector();

function setupConnector(): void {
	ensureConnectorMatchesCurrentLayout();
	startLayoutObserver();
}

function detectConnectorLayout(): ConnectorLayout | null {
	// The current Yandex.Music DOM can render different player roots
	// depending on page mode. Check exact roots before the broad
	// PlayerBar_root fallback, otherwise artist lookup can hit page content.
	if (document.querySelector(vibePlayerSelector)) {
		return 'vibe';
	}

	if (document.querySelector(mobilePlayerSelector)) {
		return 'mobile-player';
	}

	if (document.querySelector(backgroundProgressPlayerSelector)) {
		return 'background-progress';
	}

	if (document.querySelector(currentCollapsedPlayerSelector)) {
		return 'current-collapsed';
	}

	// This is the very old Yandex.Music player. It is not expected
	// anymore, but keeping it costs little and preserves compatibility.
	if (document.querySelector(veryOldPlayButtonSelector)) {
		return 'very-old';
	}

	return null;
}

function ensureConnectorMatchesCurrentLayout(): boolean {
	const nextLayout = detectConnectorLayout();
	if (nextLayout === null || nextLayout === activeLayout) {
		return false;
	}

	disposeStateObservers();
	activeLayout = nextLayout;

	switch (nextLayout) {
		case 'current-collapsed':
			setupPlayerBarConnector(
				currentCollapsedPlayerSelector,
				'current-collapsed',
			);
			break;
		case 'vibe':
			setupVibeConnector();
			break;
		case 'mobile-player':
			setupPlayerBarConnector(mobilePlayerSelector, 'mobile-player');
			break;
		case 'background-progress':
			setupPlayerBarConnector(
				backgroundProgressPlayerSelector,
				'background-progress',
			);
			break;
		case 'very-old':
			setupOldConnector();
			break;
	}

	return true;
}

function startLayoutObserver(): void {
	if (isLayoutObserverStarted) {
		return;
	}

	isLayoutObserverStarted = true;
	let animationFrame = 0;
	const observer = new MutationObserver(() => {
		if (animationFrame !== 0) {
			return;
		}

		animationFrame = window.requestAnimationFrame(() => {
			animationFrame = 0;
			notifyStateChanged();
		});
	});

	observer.observe(document.body, { childList: true, subtree: true });
}

function setupPlayerBarConnector(
	playerSelector: string,
	layoutId: ConnectorLayout,
): void {
	// PlayerBarMobile and PlayerBarDesktopWithBackgroundProgressBar use the
	// same Meta_* blocks. Always scope reads to the active player root so
	// artist names from the page body are not picked by accident.
	Connector.playerSelector = playerSelector;

	Connector.getTrack = (): string | null => {
		const titleContainer = `${playerSelector} [class*="Meta_titleContainer__"]`;
		let title = Util.getTextFromSelectors(
			`${titleContainer} [class*="Meta_title__"]`,
		)?.trim();
		const version = Util.getTextFromSelectors(
			`${titleContainer} [class*="Meta_version__"]`,
		)?.trim();

		if (!title) {
			return null;
		}

		if (version) {
			title += ` (${version})`;
		}

		return title;
	};

	Connector.getArtist = (): string | null => {
		const player = document.querySelector(playerSelector);
		if (!player) {
			return null;
		}

		const artistCaptions = player.querySelectorAll<HTMLElement>(
			'[class*="Meta_artists__"] [class*="Meta_artistCaption__"]',
		);
		const artists = Array.from(artistCaptions)
			.map((artist) => artist.textContent?.trim())
			.filter(Boolean);

		if (artists.length > 0) {
			return artists.join(', ');
		}

		const artistContainer = player.querySelector<HTMLElement>(
			'[class*="Meta_artists__"]',
		);

		return artistContainer?.textContent?.trim() || null;
	};

	Connector.getTrackArt = (): string | null => {
		const img = document.querySelector<HTMLImageElement>(
			`${playerSelector} img[class*="_cover__"]`,
		);
		const url = img?.currentSrc || img?.src;

		return url?.replace(/\d+x\d+$/g, '800x800') ?? null;
	};

	Connector.getCurrentTime = (): number | null => {
		const timeStr = Util.getAttrFromSelectors(
			`${playerSelector} input[class*="_slider__"]`,
			'value',
		);
		return timeStr ? parseFloat(timeStr) : null;
	};

	Connector.getDuration = (): number | null => {
		const durStr = Util.getAttrFromSelectors(
			`${playerSelector} input[class*="_slider__"]`,
			'max',
		);
		return durStr ? parseFloat(durStr) : null;
	};

	Connector.isPlaying = (): boolean => {
		const playPauseButtonSelectors = [
			`${playerSelector} button[aria-label="Пауза"]`,
			`${playerSelector} button[class*="BaseSonataControlsDesktop_sonataButton__"] svg[class*="BaseSonataControlsDesktop_playButtonIcon__"] use`,
			`${playerSelector} [class*="PlayerBarMobile_infoButtons__"] button:last-child svg use`,
		];

		// xlink:href is deprecated. Read both attributes while Yandex
		// transitions icons between the old and modern SVG APIs.
		if (document.querySelector(playPauseButtonSelectors[0])) {
			return true;
		}

		const useHrefAttr =
			Util.getAttrFromSelectors(
				playPauseButtonSelectors.slice(1),
				'xlink:href',
			) ??
			Util.getAttrFromSelectors(
				playPauseButtonSelectors.slice(1),
				'href',
			);

		return useHrefAttr?.includes('pause') ?? false;
	};

	Connector.isLoved = (): boolean => {
		const likeButton = document.querySelector(
			`${playerSelector} button[aria-label="Нравится"]`,
		);
		if (likeButton?.getAttribute('aria-pressed') === 'true') {
			return true;
		}

		const useHrefAttr = Util.getAttrFromSelectors(
			`${playerSelector} button[aria-label="Нравится"] svg use`,
			'xlink:href',
		);

		return useHrefAttr?.includes('liked') ?? false;
	};

	observeConnectorState(playerSelector, layoutId);
}

function setupVibeConnector(): void {
	Connector.playerSelector = vibePlayerSelector;

	Connector.getTrack = (): string | null => {
		const title = getVibeTrackTitle();
		const artist = getVibeArtist();

		// Before playback starts, Vibe can show a preview title as
		// "Artist — Track" and does not render SeparatedArtists yet.
		// Once the artist node appears, the title becomes track-only.
		if (!artist && title?.includes(' — ')) {
			return title.split(' — ').slice(1).join(' — ').trim() || null;
		}

		return title || null;
	};

	Connector.getArtist = (): string | null => {
		const artist = getVibeArtist();
		if (artist) {
			return artist;
		}

		const title = getVibeTrackTitle();
		if (!title?.includes(' — ')) {
			return null;
		}

		// This fallback only covers the idle Vibe preview state.
		// It avoids returning "Моя волна" as an artist when the real
		// SeparatedArtists block has not been rendered yet.
		return title.split(' — ')[0]?.trim() || null;
	};

	Connector.getTrackArt = (): string | null => {
		const img = document.querySelector<HTMLImageElement>(
			`${vibePlayerSelector} img[class*="AlbumCover_cover__"]`,
		);
		const src = img?.currentSrc || img?.src;
		if (!src) {
			return null;
		}

		return new URL(src, window.location.origin)
			.toString()
			.replace(/\d+x\d+$/, '800x800');
	};

	Connector.getCurrentTime = (): number | null => {
		const timeStr = Util.getAttrFromSelectors(
			`${vibePlayerSelector} input[class*="VibePlayerbarMeta_slider__"]`,
			'value',
		);
		return timeStr ? parseFloat(timeStr) : null;
	};

	Connector.getDuration = (): number | null => {
		const durStr = Util.getAttrFromSelectors(
			`${vibePlayerSelector} input[class*="VibePlayerbarMeta_slider__"]`,
			'max',
		);
		return durStr ? parseFloat(durStr) : null;
	};

	Connector.isPlaying = (): boolean => {
		const pauseButton = document.querySelector(
			`${vibePlayerSelector} button[aria-label="Пауза"]`,
		);

		return pauseButton !== null;
	};

	Connector.isLoved = (): boolean => {
		const likeButton = document.querySelector(
			`${vibePlayerSelector} button[aria-label="Нравится"], ${vibePlayerSelector} button[aria-label="Не нравится"]`,
		);

		return likeButton?.getAttribute('aria-pressed') === 'true';
	};

	// Vibe stores artist metadata outside the player section, so observe
	// the whole document. Yandex can replace the Vibe page block on
	// Play/Next/Prev, and an observer attached to the old node would miss
	// the new track metadata.
	observeConnectorState(vibePageSelector, 'vibe', document.body);
}

function getVibeTrackTitle(): string | null {
	const title = document
		.querySelector(
			`${vibePlayerSelector} [class*="VibePlayerbarMeta_trackNameText"]`,
		)
		?.textContent?.trim();

	return title || null;
}

function getVibeArtist(): string | null {
	const artistElement = document.querySelector<HTMLElement>(
		`${vibePageSelector} [class*="VibePage_entityMeta__"] [class*="SeparatedArtists_"]`,
	);
	const artist =
		artistElement?.getAttribute('title') ??
		artistElement?.textContent?.trim();

	return artist || null;
}

function observeConnectorState(
	playerSelector: string,
	layoutId: string,
	observerTarget?: Node,
): void {
	notifyStateChanged();

	const playerNode = document.querySelector(playerSelector);
	const targetNode = observerTarget ?? playerNode;
	if (targetNode) {
		const observerKey = `${layoutId}:${
			targetNode === document.body ? 'body' : playerSelector
		}`;
		if (stateObservers.has(observerKey)) {
			return;
		}

		let animationFrame = 0;
		const observer = new MutationObserver(() => {
			if (animationFrame !== 0) {
				return;
			}

			animationFrame = window.requestAnimationFrame(() => {
				animationFrame = 0;
				notifyStateChanged();
			});
		});

		observer.observe(targetNode, {
			attributes: true,
			childList: true,
			subtree: true,
		});

		stateObservers.set(observerKey, () => {
			observer.disconnect();
			if (animationFrame !== 0) {
				window.cancelAnimationFrame(animationFrame);
				animationFrame = 0;
			}
		});
	} else {
		const intervalKey = `${layoutId}:${playerSelector}:interval`;
		if (stateObservers.has(intervalKey)) {
			return;
		}

		const intervalId = window.setInterval(notifyStateChanged, 1000);
		stateObservers.set(intervalKey, () => {
			window.clearInterval(intervalId);
		});
	}
}

function disposeStateObservers(): void {
	for (const dispose of stateObservers.values()) {
		dispose();
	}
	stateObservers.clear();
}

function notifyStateChanged(): void {
	ensureConnectorMatchesCurrentLayout();
	Connector.onStateChanged();
}

function setupOldConnector(): void {
	const observer = new MutationObserver(() => {
		const el = document.querySelector('.track.track_type_player');
		if (el) {
			observer.disconnect();
			Connector.playerSelector = '.track.track_type_player';
		}
	});

	const btn = document.querySelector('.player-controls__btn_play');
	if (btn) {
		const btnObserver = new MutationObserver(() => {
			Connector.onStateChanged();
		});
		btnObserver.observe(btn, {
			attributes: true,
			attributeFilter: ['class'],
		});
	}

	const trackObserver = new MutationObserver(() => {
		Connector.onStateChanged();
	});

	const trackNode = document.querySelector(
		'.player-controls__track-container',
	);
	if (trackNode) {
		trackObserver.observe(trackNode, { childList: true, subtree: true });
	}

	observer.observe(document.body, { childList: true, subtree: true });

	Connector.trackSelector = '.track__title';
	Connector.artistSelector = '.d-artists.d-artists__expanded';

	Connector.getTrackArt = (): string | null => {
		const container = document.querySelector(
			'.player-controls__track-container',
		);
		if (!container) {
			return null;
		}

		const images = container.querySelectorAll<HTMLImageElement>('img');
		for (const img of images) {
			const src = img.getAttribute('src');
			if (src && src.includes('50x50')) {
				const absoluteUrl = new URL(
					src,
					window.location.origin,
				).toString();
				return absoluteUrl.replace('50x50', '800x800');
			}
		}
		return null;
	};

	Connector.getCurrentTime = (): number | null => {
		const el = document.querySelector('.progress__bar.progress__text');
		const timeStr = el?.getAttribute('data-played-time');
		return timeStr ? parseFloat(timeStr) : null;
	};

	Connector.getDuration = (): number | null => {
		const el = document.querySelector('.progress__bar.progress__text');
		const durStr = el?.getAttribute('data-duration');
		return durStr ? parseFloat(durStr) : null;
	};

	Connector.isPlaying = (): boolean => {
		const btn = document.querySelector('.player-controls__btn_play');
		return btn?.classList.contains('player-controls__btn_pause') ?? false;
	};
}
