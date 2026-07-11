export {};

setupConnector();

function setupConnector(): void {
	const isOldDesign = document.querySelector(
		'.player-controls__btn_play, .track.track_type_player',
	);

	if (isOldDesign) {
		// не уверен, где именно используется старая версия плеера, но оставлен здесь для совместимости
		setupOldConnector();
	} else {
		// текущая версия плеера
		setupDefaultConnector();
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

function setupDefaultConnector(): void {
	// хеш в конце CSS Modules-класса похоже меняется при каждой сборке сайта,
	// поэтому во всех селекторах используется только его стабильная часть
	const playerSelector =
		'section[class*="PlayerBarDesktopWithBackgroundProgressBar_root__"]';
	Connector.playerSelector = playerSelector;

	// ограничиваем поиск метаданных областью нижней панели плеера,
	// чтобы не принять название или исполнителя из списка треков за текущий трек
	const getPlayer = (): Element | null =>
		document.querySelector(playerSelector);

	Connector.getTrack = (): string | null => {
		const titleContainer = getPlayer()?.querySelector(
			'div[class*="Meta_titleContainer__"]',
		);
		const link = titleContainer?.querySelector('a');
		const titleSpan = link?.querySelector('span[class*="Meta_title__"]');
		if (!titleSpan) {
			return null;
		}

		let trackName = titleSpan.textContent?.trim() ?? '';
		// некоторые треки имеют отдельное обозначение версии, например Remix,
		// неразрывные пробелы нормализуются перед добавлением версии к названию
		const versionSpan = titleContainer?.querySelector<HTMLElement>(
			'[class*="Meta_version__"]',
		);
		if (versionSpan?.className.includes('Meta_version__')) {
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
		const artistContainer = getPlayer()?.querySelector(
			'div[class*="Meta_artists__"]',
		);
		if (!artistContainer) {
			return null;
		}

		// у совместных треков каждый исполнитель находится в отдельном span'e,
		// Web Scrobbler ожидает одну строку, поэтому объединяем имена через запятую.
		const artists = Array.from(
			artistContainer.querySelectorAll(
				'span[class*="Meta_artistCaption__"]',
			),
		)
			.map((artist) => artist.textContent?.trim())
			.filter((artist): artist is string => Boolean(artist));

		return artists.length ? artists.join(', ') : null;
	};

	Connector.getTrackArt = (): string | null => {
		// обложка может находиться в мобильной, обычной или полноэкранной
		// версии плеера, используем первый доступный вариант
		const trackArtImage = [
			'img[class*="PlayerBarMobile_cover"]',
			'img[class*="PlayerBarDesktopWithBackgroundProgressBar_cover"]',
			'img[class*="FullscreenPlayerDesktopPoster_cover"]',
		]
			.map((cover) => document.querySelector<HTMLImageElement>(cover))
			.find((cover) => cover !== null);

		if (!trackArtImage) {
			return null;
		}

		const url = new URL(
			trackArtImage.src,
			window.location.origin,
		).toString();

		// Яндекс позволяет запросить крупную обложку, подставив размер в URL
		return url.replace(/\d+x\d+/, '800x800');
	};

	Connector.getCurrentTime = (): number | null => {
		// value ползунка содержит точную позицию в секундах и не зависит
		// от локализованного текстового отображения времени.
		const slider = getPlayer()?.querySelector<HTMLInputElement>(
			'input[class*="ChangeTimecodeBackground_slider__"]',
		);
		const currentTime = Number(slider?.value);
		return Number.isFinite(currentTime) ? currentTime : null;
	};

	Connector.getDuration = (): number | null => {
		// max того же ползунка равен полной длительности трека в секундах.
		const slider = getPlayer()?.querySelector<HTMLInputElement>(
			'input[class*="ChangeTimecodeBackground_slider__"]',
		);
		const duration = Number(slider?.max);
		return Number.isFinite(duration) ? duration : null;
	};

	Connector.isPlaying = (): boolean => {
		// иконка кнопки содержит pause во время воспроизведения и play на паузе
		// (aria-label может быть локализован, поэтому ненадёжен)
		const playIcon = getPlayer()?.querySelector(
			'[class*="BaseSonataControlsDesktop_playButtonIcon__"] use',
		);
		const icon =
			playIcon?.getAttribute('href') ??
			playIcon?.getAttribute('xlink:href');

		return icon?.includes('#pause') ?? false;
	};

	Connector.onStateChanged();

	let observedPlayer: Element | null = null;
	const playerObserver = new MutationObserver(() =>
		Connector.onStateChanged(),
	);
	const observePlayer = (): void => {
		const player = getPlayer();
		if (player === observedPlayer) {
			return;
		}

		playerObserver.disconnect();
		observedPlayer = player;
		if (!player) {
			Connector.onStateChanged();
			return;
		}

		playerObserver.observe(player, {
			attributes: true,
			attributeFilter: ['aria-label', 'class', 'href', 'xlink:href'],
			characterData: true,
			childList: true,
			subtree: true,
		});
		Connector.onStateChanged();
	};

	observePlayer();

	new MutationObserver(observePlayer).observe(document.body, {
		childList: true,
		subtree: true,
	});
}
