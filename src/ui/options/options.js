'use strict';

define((require) => {
	const Options = require('storage/options');

	const hiddenOptionsId = 'hidden-options';
	const optionsContainerId = 'collapseOptions';
	const scrobblePercentId = 'scrobblePercent';

	const percentValues = [
		10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
	];

	/**
	 * Object that maps options to their element IDs.
	 * @type {Object}
	 */
	const OPTIONS_UI_MAP = {
		'disable-ga': Options.DISABLE_GA,
		'force-recognize': Options.FORCE_RECOGNIZE,
		'use-notifications': Options.USE_NOTIFICATIONS,
		'use-unrecognized-song-notifications': Options.USE_UNRECOGNIZED_SONG_NOTIFICATIONS,
		'scrobble-podcasts': Options.SCROBBLE_PODCASTS,
	};
	const CONNECTORS_OPTIONS_UI_MAP = {
		Tidal: {
			'tdl-short-track-names': 'useShortTrackNames',
		},
		YouTube: {
			'yt-music-only': 'scrobbleMusicOnly',
			'yt-entertainment-only': 'scrobbleEntertainmentOnly',
		},
	};

	async function initialize() {
		await initializeOptions();
		await initializeConnectorsOptions();
	}

	async function initializeOptions() {
		for (const optionId in OPTIONS_UI_MAP) {
			const option = OPTIONS_UI_MAP[optionId];
			const optionCheckBox = document.getElementById(optionId);

			optionCheckBox.addEventListener('click', async function() {
				Options.setOption(option, this.checked);
			});

			const optionValue = await Options.getOption(option);
			optionCheckBox.checked = optionValue;
		}

		const scrobblePercentElem = document.getElementById(scrobblePercentId);
		for (const val of percentValues) {
			const percentOption = document.createElement('option');
			percentOption.textContent = `${val}%`;

			scrobblePercentElem.appendChild(percentOption);
		}
		scrobblePercentElem.selectedIndex = percentValues.indexOf(
			await Options.getOption(Options.SCROBBLE_PERCENT)
		);
		scrobblePercentElem.addEventListener('change', function() {
			const percent = percentValues[this.selectedIndex];
			Options.setOption(Options.SCROBBLE_PERCENT, percent);
		});

		const optionsContainer = document.getElementById(optionsContainerId);
		optionsContainer.addEventListener('click', (event) => {
			if (event.altKey) {
				showHiddenOptions();
			}
		});
	}

	async function initializeConnectorsOptions() {
		for (const connector in CONNECTORS_OPTIONS_UI_MAP) {
			for (const optionId in CONNECTORS_OPTIONS_UI_MAP[connector]) {
				const option = CONNECTORS_OPTIONS_UI_MAP[connector][optionId];
				const optionCheckBox = document.getElementById(optionId);

				optionCheckBox.addEventListener('click', async function() {
					Options.setConnectorOption(connector, option, this.checked);
				});

				const optionValue =
					await Options.getConnectorOption(connector, option);
				optionCheckBox.checked = optionValue;
			}
		}
	}

	function showHiddenOptions() {
		document.getElementById(hiddenOptionsId).hidden = false;
	}

	return { initialize };
});
