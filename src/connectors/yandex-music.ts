export {};

const currentCollapsedPlayerSelector =
	'section[class*="PlayerBar_root__"]:has([class*="Meta_titleContainer__"])';
const vibePlayerSelector = 'section[class*="VibePlayerBar_root__"]';
const backgroundProgressPlayerSelector =
	"section[class*='PlayerBarDesktopWithBackgroundProgressBar_root']";
const veryOldPlayButtonSelector = '.player-controls__btn_play';

setupConnector();

function setupConnector(): void {
	const setupKnownConnector = (): boolean => {
		// The current Yandex.Music DOM can render different player roots
		// depending on page mode. Check the newest known variants first.
		if (document.querySelector(currentCollapsedPlayerSelector)) {
			setupCurrentCollapsedConnector();
			return true;
		}

		if (document.querySelector(vibePlayerSelector)) {
			setupVibeConnector();
			return true;
		}

		// This was the "new" design before the latest redesign.
		// Keep it as a compatibility path for users who may still see it.
		if (document.querySelector(backgroundProgressPlayerSelector)) {
			setupBackgroundProgressConnector();
			return true;
		}

		// This is the very old Yandex.Music player. It is not expected
		// anymore, but keeping it costs little and preserves compatibility.
		if (document.querySelector(veryOldPlayButtonSelector)) {
			setupOldConnector();
			return true;
		}

		return false;
	};

	if (setupKnownConnector()) {
		return;
	}

	const observer = new MutationObserver(() => {
		if (setupKnownConnector()) {
			observer.disconnect();
			Connector.onStateChanged();
		}
	});

	observer.observe(document.body, { childList: true, subtree: true });
}

function setupCurrentCollapsedConnector(): void {
	// This compact player is the newest stable source for normal scrobbling.
	// It can be hidden by some screens, so every getter still returns null
	// when the node is temporarily missing.
	Connector.playerSelector = currentCollapsedPlayerSelector;

	Connector.getTrack = (): string | null => {
		const titleContainer = `${currentCollapsedPlayerSelector} [class*="Meta_titleContainer__"]`;
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

	Connector.artistSelector = `${currentCollapsedPlayerSelector} [class*="Meta_artists__"]`;

	Connector.getTrackArt = (): string | null => {
		const url = Util.extractImageUrlFromSelectors('img[class*="_cover__"]');

		return url?.replace(/\d+x\d+$/g, '800x800') ?? null;
	};

	Connector.getCurrentTime = (): number | null => {
		const timeStr = Util.getAttrFromSelectors(
			`${currentCollapsedPlayerSelector} input[class*="_slider__"]`,
			'value',
		);
		return timeStr ? parseFloat(timeStr) : null;
	};

	Connector.getDuration = (): number | null => {
		const durStr = Util.getAttrFromSelectors(
			`${currentCollapsedPlayerSelector} input[class*="_slider__"]`,
			'max',
		);
		return durStr ? parseFloat(durStr) : null;
	};

	Connector.isPlaying = (): boolean => {
		const playPauseButtonSelectors = [
			`${currentCollapsedPlayerSelector} button[class*="BaseSonataControlsDesktop_sonataButton__"] svg[class*="BaseSonataControlsDesktop_playButtonIcon__"] use`,
			`${currentCollapsedPlayerSelector} [class*="PlayerBarMobile_infoButtons__"] button:last-child svg use`,
		];

		// xlink:href is deprecated. Read both attributes while Yandex
		// transitions icons between the old and modern SVG APIs.
		const useHrefAttr =
			Util.getAttrFromSelectors(playPauseButtonSelectors, 'xlink:href') ??
			Util.getAttrFromSelectors(playPauseButtonSelectors, 'href');

		return useHrefAttr?.includes('pause') ?? false;
	};

	Connector.isLoved = (): boolean => {
		const loveButtonSelectors = [
			`${currentCollapsedPlayerSelector} [class*="PlayerBarDesktopWithBackgroundProgressBar_sonata__"] button:first-child svg use`,
			`${currentCollapsedPlayerSelector} [class*="PlayerBarMobile_infoButtons__"] button:first-child svg use`,
		];

		const useHrefAttr =
			Util.getAttrFromSelectors(loveButtonSelectors, 'xlink:href') ??
			Util.getAttrFromSelectors(loveButtonSelectors, 'href');

		return useHrefAttr?.includes('liked') ?? false;
	};

	observeConnectorState(currentCollapsedPlayerSelector);
}

function setupVibeConnector(): void {
	Connector.playerSelector = vibePlayerSelector;

	Connector.getTrack = (): string | null => {
		const title = document
			.querySelector(
				`${vibePlayerSelector} [class*="VibePlayerbarMeta_trackNameText"]`,
			)
			?.textContent?.trim();

		return title || null;
	};

	Connector.getArtist = (): string | null => {
		const artistElement = document.querySelector<HTMLElement>(
			'[class*="SeparatedArtists_"]',
		);
		const artist =
			artistElement?.getAttribute('title') ??
			artistElement?.textContent?.trim();

		return artist || null;
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

	observeConnectorState(vibePlayerSelector);
}

function observeConnectorState(playerSelector: string): void {
	Connector.onStateChanged();

	const playerNode = document.querySelector(playerSelector);
	if (playerNode) {
		const observer = new MutationObserver(() => Connector.onStateChanged());
		observer.observe(playerNode, {
			attributes: true,
			childList: true,
			subtree: true,
		});
	} else {
		setInterval(() => Connector.onStateChanged(), 1000);
	}
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

// BACKGROUND PROGRESS CONNECTOR

function setupBackgroundProgressConnector(): void {
	Connector.playerSelector = backgroundProgressPlayerSelector;

	Connector.getTrack = (): string | null => {
		const playerContainer = document.querySelector(
			backgroundProgressPlayerSelector,
		);
		if (!playerContainer) {
			return null;
		}

		const titleContainer = playerContainer.querySelector(
			'div[class*="Meta_titleContainer"]',
		);
		if (!titleContainer) {
			return null;
		}

		const link = titleContainer.querySelector('a');
		if (!link) {
			return null;
		}

		const titleSpan = link.querySelector('span[class*="Meta_title__"]');
		if (!titleSpan) {
			return null;
		}

		let trackName = titleSpan.textContent?.trim() ?? '';

		const versionSpan = link.nextElementSibling as HTMLElement | null;
		if (versionSpan && versionSpan.className.includes('Meta_version__')) {
			const versionText = versionSpan.textContent
				?.replace(/\u00a0/g, ' ')
				.trim();
			if (versionText) {
				trackName += ` (${versionText})`;
			}
		}

		return trackName || null;
	};

	Connector.getArtist = (): string | null => {
		const playerContainer = document.querySelector(
			backgroundProgressPlayerSelector,
		);
		if (!playerContainer) {
			return null;
		}

		const artistContainer = playerContainer.querySelector(
			'div[class*="SeparatedArtists_root"]',
		);
		if (!artistContainer) {
			return null;
		}

		const links = artistContainer.querySelectorAll('a');
		const artists: string[] = [];

		links.forEach((a) => {
			const span = a.querySelector('span[class*="Meta_artistCaption"]');
			if (span?.textContent?.trim()) {
				artists.push(span.textContent.trim());
			}
		});

		return artists.length ? artists.join(', ') : null;
	};

	Connector.getTrackArt = (): string | null => {
		const trackArtImage: HTMLImageElement | undefined = [
			'img[class*="PlayerBarMobile_cover"]',
			'img[class*="PlayerBarDesktopWithBackgroundProgressBar_cover"]',
			'img[class*="FullscreenPlayerDesktopPoster_cover"]',
		]
			.map((cover) => document.querySelector<HTMLImageElement>(cover))
			.find((cover) => cover !== null);

		if (trackArtImage === undefined) {
			return null;
		}

		const url = new URL(
			trackArtImage.src,
			window.location.origin,
		).toString();

		return url.replace(/\d+x\d+/, '800x800');
	};

	Connector.getCurrentTime = (): number | null => {
		const el = document.querySelector('[class*="Timecode_root_start"]');
		const parts = el?.textContent?.trim().split(':');
		if (!parts || parts.length !== 2) {
			return null;
		}

		const minutes = parseInt(parts[0], 10);
		const seconds = parseInt(parts[1], 10);
		if (isNaN(minutes) || isNaN(seconds)) {
			return null;
		}

		return minutes * 60 + seconds;
	};

	Connector.getDuration = (): number | null => {
		const el = document.querySelector('[class*="Timecode_root_end"]');
		const parts = el?.textContent?.trim().split(':');
		if (!parts || parts.length !== 2) {
			return null;
		}

		const minutes = parseInt(parts[0], 10);
		const seconds = parseInt(parts[1], 10);
		if (isNaN(minutes) || isNaN(seconds)) {
			return null;
		}

		return minutes * 60 + seconds;
	};

	Connector.isPlaying = (): boolean => {
		const buttons = Array.from(
			document.querySelectorAll('button'),
		) as HTMLElement[];
		for (const btn of buttons) {
			if (
				Array.from(btn.classList).some((c) =>
					c.includes('BaseSonataControlsDesktop_sonataButton'),
				)
			) {
				const label = btn.getAttribute('aria-label');
				if (label === 'Пауза') {
					return true;
				}
				if (label === 'Воспроизведение') {
					return false;
				}
			}
		}
		return false;
	};

	observeConnectorState(backgroundProgressPlayerSelector);
}
