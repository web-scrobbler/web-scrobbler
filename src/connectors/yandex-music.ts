export {};
const connectorLabel = 'YandexMusic';
setupConnector();
function setupConnector() {
	let isNewDesign = false;
	let checks = 0;
	const maxChecks = 10;
	const intervalMs = 200;

	const checkInterval = setInterval(() => {
		const body = document.querySelector('body');
		if (body) {
			isNewDesign =
				body.classList.contains('ym-font-music') &&
				(body.classList.contains('ym-dark-theme') ||
					body.classList.contains('ym-light-theme'));
		}

		checks++;
		if (checks >= maxChecks) {
			clearInterval(checkInterval);

			if (isNewDesign) {
				setupNewConnector();
				Util.debugLog(
					`${connectorLabel}: New design was recognized.`,
					'log',
				);
			} else {
				setupOldConnector();
				Util.debugLog(
					`${connectorLabel}: Old design was recognized`,
					'log',
				);
			}
		}
	}, intervalMs);
}
function setupOldConnector() {
	const observer = new MutationObserver(() => {
		const el = document.querySelector('.track.track_type_player');
		if (el) {
			observer.disconnect();
			Connector.playerSelector = '.track.track_type_player';
			Util.debugLog(
				`${connectorLabel}: Successfully catched playerSelector`,
				'log',
			);
		} else {
			Util.debugLog(
				`${connectorLabel}: Failed to catch the playerSelector`,
				'error',
			);
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

	const trackObserver = new MutationObserver(() =>
		Connector.onStateChanged(),
	);

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
		if (!timeStr) {
			return null;
		}
		const val = parseFloat(timeStr);
		return isNaN(val) ? null : val;
	};

	Connector.getDuration = (): number | null => {
		const el = document.querySelector('.progress__bar.progress__text');
		const durStr = el?.getAttribute('data-duration');
		if (!durStr) {
			return null;
		}
		const val = parseFloat(durStr);
		return isNaN(val) ? null : val;
	};

	Connector.isPlaying = (): boolean => {
		const btn2 = document.querySelector('.player-controls__btn_play');
		return btn2?.classList.contains('player-controls__btn_pause') ?? false;
	};
}

function setupNewConnector() {
	Util.debugLog(`${connectorLabel}: Initialization started`, 'log');
	let attempts = 0;
	const maxAttempts = 20;
	const intervalMs = 500;
	const initInterval = setInterval(() => {
		attempts++;
		const playerContainer = document.querySelector(
			'section[class*="PlayerBarDesktopWithBackgroundProgressBar_root"]',
		);
		if (!playerContainer) {
			if (attempts >= maxAttempts) {
				clearInterval(initInterval);
			}
			return;
		}
		const infoContainer = playerContainer.querySelector(
			'div[class*="PlayerBarDesktopWithBackgroundProgressBar_info"]',
		);
		const titleContainer = infoContainer?.querySelector(
			'div[class*="Meta_titleContainer__"]',
		);
		const link = titleContainer?.querySelector(
			'a[class*="Meta_albumLink__"]',
		);
		const titleSpan = link?.querySelector('span[class*="Meta_title__"]');
		if (!titleSpan) {
			return;
		}
		Util.debugLog(`${connectorLabel}: playerContainer found.`, 'log');
		clearInterval(initInterval);
		Connector.playerSelector = playerContainer as unknown as
			| string
			| string[]
			| null;
		new MutationObserver(() => Connector.onStateChanged()).observe(
			playerContainer,
			{
				childList: true,
				subtree: true,
			},
		);
		Connector.onStateChanged();
	}, intervalMs);
	Connector.getTrack = (): string | null => {
		const container = Connector.playerSelector as HTMLElement | null;
		if (!container) {
			return null;
		}

		const info = container.querySelector<HTMLElement>(
			'div[class*="PlayerBarDesktopWithBackgroundProgressBar_info"]',
		);
		const titleContainer = info?.querySelector<HTMLElement>(
			'div[class*="Meta_titleContainer__"]',
		);
		const link = titleContainer?.querySelector<HTMLAnchorElement>(
			'a[class*="Meta_albumLink__"]',
		);
		const titleSpan = link?.querySelector<HTMLSpanElement>(
			'span[class*="Meta_title__"]',
		);

		return titleSpan?.textContent?.trim() ?? null;
	};
	Connector.getArtist = (): string | null => {
		const container = Connector.playerSelector as HTMLElement | null;
		if (!container) {
			return null;
		}

		const artistContainer = container.querySelector<HTMLElement>(
			'div[class*="SeparatedArtists_root_variant_breakAll__"], div[class*="Meta_artists__"]',
		);
		const firstLink =
			artistContainer?.querySelector<HTMLAnchorElement>('a');
		const span = firstLink?.querySelector<HTMLSpanElement>(
			'span[class*="Meta_artistCaption"]',
		);

		return span?.textContent?.trim() ?? null;
	};
	Connector.getTrackArt = () => {
		const img = document.querySelector(
			'img[class*="PlayerBarDesktopWithBackgroundProgressBar_cover__"]',
		);
		const src = img?.getAttribute('src');
		return src ? src.replace(/\d+x\d+/, '1000x1000') : null;
	};
	Connector.getCurrentTime = () => {
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
	Connector.getDuration = () => {
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
	Connector.isPlaying = () => {
		const buttons = Array.from(document.querySelectorAll('button'));
		for (const btn of buttons) {
			if (
				Array.from(btn.classList).some((c) =>
					c.includes('BaseSonataControlsDesktop_sonataButton'),
				)
			) {
				const label = btn.getAttribute('aria-label');
				if (!label) {
					continue;
				}
				if (
					[
						'\u041F\u0430\u0443\u0437\u0430',
						'Pause',
						'Pauza',
						'\u04AE\u0437\u04AF\u043B\u0438\u0441',
					].includes(label)
				) {
					return true;
				}
				if (
					[
						'\u0412\u043E\u0441\u043F\u0440\u043E\u0438\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u0435',
						'Playback',
						'Ijro',
						'\u041E\u0439\u043D\u0430\u0442\u0443',
					].includes(label)
				) {
					return false;
				}
			}
		}
		return false;
	};

	function startWatchdog() {
		let attempts = 0;
		const maxAttempts = 10;
		const intervalMs = 1000;

		let containerWasMissing = false;

		const watchdog = setInterval(() => {
			const container = document.querySelector(
				'section[class*="PlayerBarDesktopWithBackgroundProgressBar_root"]',
			);

			if (container) {
				if (containerWasMissing) {
					setupNewConnector();
					attempts = 0;
					containerWasMissing = false;
					Util.debugLog(
						`${connectorLabel} playerContainer disappeared earlier, but is restored now. You switched to the mobile version by an accident, did you?`,
						'warn',
					);
				}
				return; // Контейнер есть, продолжаем наблюдать
			}

			// Контейнер пропал
			containerWasMissing = true;
			attempts++;

			if (attempts > maxAttempts) {
				clearInterval(watchdog);
				const isMobile = document.querySelector(
					'section[class*="PlayerBarMobile_root__"]',
				);
				if (isMobile) {
					Util.debugLog(
						`${connectorLabel}: It seems that you are in mobile version of site. Unfortunately, the extension does not support mobile design yet. Please, change display ratio or switch to Desktop version`,
						'error',
					);
				} else {
					Util.debugLog(
						`${connectorLabel}: It seems that there is error with extension happened. Please, try to reinstall extension or to reload page. If you still getting this error, please, open an issue on https://github.com/web-scrobbler/web-scrobbler/issues/new/choose and mention BananaDeadRU`,
						'error',
					);
				}
			}
		}, intervalMs);
	}
	startWatchdog();
}
