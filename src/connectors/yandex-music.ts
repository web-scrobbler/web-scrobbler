export {};

setupConnector();

function setupConnector(): void {
	const body = document.querySelector('body');
	const isNewDesign =
		body?.classList.contains('ym-font-music') &&
		(body.classList.contains('ym-dark-theme') ||
			body.classList.contains('ym-light-theme'));

	if (isNewDesign) {
		setupNewConnector();
	} else {
		setupOldConnector();
	}
}

function setupOldConnector(): void {
	Util.debugLog('setting up for Yandex Music old design');
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

// NEW CONNECTOR

function setupNewConnector(): void {
	Util.debugLog('setting up for Yandex Music new design');

	// this accommodates both desktop and mobile player.
	// during fullscreen the bar still exists underneath
	const playerSelector = 'section[class*="PlayerBar_root__"]';
	Connector.playerSelector = playerSelector;

	Connector.getTrack = () => {
		const titleContainer = `${playerSelector} [class*="Meta_titleContainer__"]`;
		let title = Util.getTextFromSelectors(
			`${titleContainer} [class*="Meta_title__"]`,
		)?.trim();
		const version = Util.getTextFromSelectors(
			`${titleContainer} [class*="Meta_version__"]`,
		)?.trim();

		if (version) {
			title += ` (${version})`;
		}

		return title;
	};

	Connector.getArtist = () => {
		return Util.getTextFromSelectors(
			`${playerSelector} [class*="Meta_artists__"]`,
		);
	};

	Connector.getTrackArt = () => {
		const url = Util.extractImageUrlFromSelectors('img[class*="_cover__"]');

		return url?.replace(/\d+x\d+$/g, '800x800');
	};

	Connector.getCurrentTime = (): number | null => {
		const timeStr = Util.getAttrFromSelectors(
			`${playerSelector} input[class*=_slider__]`,
			'value',
		);
		return timeStr ? parseFloat(timeStr) : null;
	};

	Connector.getDuration = (): number | null => {
		const durStr = Util.getAttrFromSelectors(
			`${playerSelector} input[class*=_slider__]`,
			'max',
		);
		return durStr ? parseFloat(durStr) : null;
	};

	Connector.isPlaying = () => {
		const playPauseButtonSelectors = [
			`${playerSelector} button[class*="BaseSonataControlsDesktop_sonataButton__"] svg[class*="BaseSonataControlsDesktop_playButtonIcon__"] use`,
			`${playerSelector} button[class*="SonataControls_root__"] svg use`,
		];

		return Util.getAttrFromSelectors(
			playPauseButtonSelectors,
			'xlink:href',
		)?.includes('pause');
	};

	Connector.onStateChanged();

	const playerNode = document.querySelector(Connector.playerSelector);
	if (playerNode) {
		const observer = new MutationObserver(() => Connector.onStateChanged());
		observer.observe(playerNode, { childList: true, subtree: true });
	} else {
		console.warn(
			'[Yandex Connector] Плеер не найден — используем fallback через setInterval',
		);
		setInterval(() => Connector.onStateChanged(), 1000);
	}
}
