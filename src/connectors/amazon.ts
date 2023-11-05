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

	Connector.playerSelector = playerBarSelector;

	Connector.getTrackInfo = () => {
		const trackContainer = document.querySelector(trackContainerSelector);
		if (trackContainer === null) {
			return null;
		}

		const artist = trackContainer.getAttribute('secondary-text');
		const track = trackContainer.getAttribute('primary-text');
		const trackArt = trackContainer.getAttribute('image-src');

		return { artist, track, trackArt };
	};

	Connector.isScrobblingAllowed = () => {
		const trackLink = Util.getAttrFromSelectors(
			trackContainerSelector,
			'primary-href',
		);

		// NOTE Regular tracks have no link
		// Check this condition first if the connector does not work
		return trackLink === '#';
	};

	Connector.pauseButtonSelector = `${playerBarSelector} music-button[icon-name=pause]`;
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
