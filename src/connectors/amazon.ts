export {};

const oldUiPlayerBarSelector = '#dragonflyTransport .rightSide';

function setupConnector() {
	if (isNewPlayer()) {
		Util.debugLog('Setup connector for the new player');

		setupPropertiesForNewPlayer();
	} else {
		Util.debugLog('Setup connector for the old player');

		setupPropertiesForOldPlayer();
	}

	Connector.applyFilter(MetadataFilter.createAmazonFilter());
}

function isNewPlayer() {
	return document.querySelector(oldUiPlayerBarSelector) === null;
}

function setupPropertiesForNewPlayer() {
	const playerBarSelector = '#transport';
	const trackContainerSelector = `${playerBarSelector} music-horizontal-item`;

	// NOTE The latest UI is built with React Native Web: class names are
	// generated, so rely on `data-testid` and ARIA attributes only.
	const miniPlayerTitleSelector = '[data-testid="MiniPlayer_Title"]';
	const miniPlayerImageSelector = '[data-testid*="MiniPlayer_Image"] img';
	const miniPlayerSliderSelector = '[role="slider"][aria-valuemax]';

	/**
	 * Get the element that contains the whole mini player of the latest UI.
	 */
	function getMiniPlayer(): Element | null {
		let element = document.querySelector(miniPlayerTitleSelector);
		while (element !== null) {
			if (element.querySelector(miniPlayerSliderSelector) !== null) {
				return element;
			}
			element = element.parentElement;
		}
		return null;
	}

	function getSliderValue(attribute: string): number | null {
		const value = getMiniPlayer()
			?.querySelector(miniPlayerSliderSelector)
			?.getAttribute(attribute);
		if (value === null || value === undefined) {
			return null;
		}

		const number = Number.parseInt(value);
		return Number.isNaN(number) ? null : number;
	}

	// NOTE The latest UI has no stable container for the player and animates
	// its elements with JS, so observing `body` fires dozens of times per
	// second and slows the page down. Poll the player state instead.
	Connector.playerSelector = null;
	setInterval(() => Connector.onStateChanged(), 1000);

	Connector.getTrackInfo = () => {
		const miniPlayer = getMiniPlayer();
		if (miniPlayer !== null) {
			const track = miniPlayer
				.querySelector(miniPlayerTitleSelector)
				?.textContent?.trim();
			const artist = miniPlayer
				.querySelector('a[href*="/artists/"]')
				?.textContent?.trim();
			// NOTE The mini player shows a 64x64 thumbnail; request a bigger one
			const trackArt = miniPlayer
				.querySelector<HTMLImageElement>(miniPlayerImageSelector)
				?.getAttribute('src')
				?.replace(/\._[^./]+_\.(\w+)$/, '._SX500_SY500_.$1');

			return { artist, track, trackArt };
		}

		// Previous version of the new UI
		const trackContainer = document.querySelector(trackContainerSelector);
		if (trackContainer === null) {
			return null;
		}

		const artist = trackContainer.getAttribute('secondary-text');
		const track = trackContainer.getAttribute('primary-text');
		const trackArt = trackContainer.getAttribute('image-src');

		return { artist, track, trackArt };
	};

	Connector.getUniqueID = () => {
		const trackLink = getMiniPlayer()
			?.querySelector(miniPlayerTitleSelector)
			?.getAttribute('href');

		return trackLink?.match(/\/tracks\/([^/?#]+)/)?.[1] ?? null;
	};

	Connector.getCurrentTime = () => getSliderValue('aria-valuenow');

	Connector.getDuration = () => getSliderValue('aria-valuemax');

	Connector.scrobblingDisallowedReason = () => {
		if (getMiniPlayer() !== null) {
			return null;
		}

		const trackContainer = document.querySelector(trackContainerSelector);
		if (trackContainer === null) {
			// Nothing is playing yet
			return null;
		}

		// NOTE Regular tracks have no link
		// Check this condition first if the connector does not work
		return trackContainer.getAttribute('primary-href') === '#'
			? null
			: 'IsAd';
	};

	Connector.pauseButtonSelector = [
		'[data-testid*="MiniPlayer_Pause"]',
		`${playerBarSelector} music-button[icon-name=pause]`,
	];
}

function setupPropertiesForOldPlayer() {
	const optionBtnSelector = '.buttonOption.main[title=Options]';

	Connector.playerSelector = oldUiPlayerBarSelector;

	Connector.getArtist = () => {
		// FIXME Use unified selector
		return Util.getAttrFromSelectors(
			[
				'.trackInfoContainer .trackArtist a',
				'.trackInfoContainer .trackArtist span',
			],
			'title',
		);
	};

	Connector.getAlbumArtist = Connector.getArtist;

	Connector.trackSelector = '.trackInfoContainer .trackTitle';

	Connector.getAlbum = () => {
		const sourceLink = document.querySelector('.trackSourceLink a');
		if (sourceLink) {
			const sourceLinkUrl = sourceLink.getAttribute('href');
			if (sourceLinkUrl && sourceLinkUrl.includes('albums')) {
				return sourceLink.textContent;
			}
		}

		const albumCellTitle = Util.getAttrFromSelectors(
			'tr.selectable.currentlyPlaying td.albumCell',
			'title',
		);
		if (albumCellTitle) {
			return albumCellTitle;
		}

		const albumImageTitle = Util.getAttrFromSelectors(
			'.nowPlayingDetail img.albumImage',
			'title',
		);
		if (albumImageTitle) {
			return albumImageTitle;
		}

		if (sourceLink) {
			const clickAction = sourceLink.getAttribute('data-ui-click-action');
			if (clickAction === 'selectAlbum') {
				return sourceLink.getAttribute('title');
			}
		}

		return null;
	};

	Connector.currentTimeSelector = '.songDuration.timeElapsed';

	Connector.playButtonSelector =
		'.rightSide .playbackControls .playerIconPlay';

	Connector.durationSelector = '#currentDuration';

	Connector.trackArtSelector = '.rightSide .albumArtWrapper img';

	Connector.getUniqueID = () => {
		const optionsHref = Util.getAttrFromSelectors(
			optionBtnSelector,
			'href',
		);
		return optionsHref && optionsHref.replace(/[\W\w]+adriveId=/, '');
	};
}

setupConnector();
