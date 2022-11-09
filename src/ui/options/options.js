'use strict';

define((require) => {
	const Options = require('storage/options');

	const hiddenOptionsClass = 'hidden-options';
	const optionsContainerId = '#collapseOptions';

	const percentValues = [
		10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
	];

	/**
	 * Object that maps options to their element IDs.
	 * @type {Object}
	 */
	const OPTIONS_UI_MAP = {
		'#use-notifications': Options.USE_NOTIFICATIONS,
		'#use-unrecognized-song-notifications': Options.USE_UNRECOGNIZED_SONG_NOTIFICATIONS,
		'#scrobble-podcasts': Options.SCROBBLE_PODCASTS,
		'#force-recognize': Options.FORCE_RECOGNIZE,
		'#scrobble-recognized-tracks': Options.SCROBBLE_RECOGNIZED_TRACKS,
		'#scrobble-edited-tracks-only': Options.SCROBBLE_EDITED_TRACKS_ONLY,
	};
	const CONNECTORS_OPTIONS_UI_MAP = {
		YouTube: {
			'#yt-music-only': 'scrobbleMusicOnly',
			'#yt-entertainment-only': 'scrobbleEntertainmentOnly',
		},
	};

	async function initialize() {
		await initializeOptions();
		await initializeConnectorsOptions();
	}

	async function initializeOptions() {
		for (const optionId in OPTIONS_UI_MAP) {
			const option = OPTIONS_UI_MAP[optionId];

			$(optionId).on('input', async function() {
				// TODO: Does this trigger when a radio button gets unchecked?
				console.log('input', this.checked);
				Options.setOption(option, this.checked);
			});

			const optionValue = await Options.getOption(option);
			$(optionId).attr('checked', optionValue);
		}

		const scrobblePercentEl = $('#scrobblePercent');

		for (const val of percentValues) {
			scrobblePercentEl.append($(`<option>${val}%</option>`));
		}
		scrobblePercentEl[0].selectedIndex = percentValues.indexOf(
			await Options.getOption(Options.SCROBBLE_PERCENT)
		);
		scrobblePercentEl.on('change', function() {
			const percent = percentValues[this.selectedIndex];
			Options.setOption(Options.SCROBBLE_PERCENT, percent);
		});

		$(optionsContainerId).bind('click', function(event) {
			if (event.altKey) {
				showHiddenOptions();
			}
		});
	}

	async function initializeConnectorsOptions() {
		for (const connector in CONNECTORS_OPTIONS_UI_MAP) {
			for (const optionId in CONNECTORS_OPTIONS_UI_MAP[connector]) {
				const option = CONNECTORS_OPTIONS_UI_MAP[connector][optionId];

				$(optionId).click(async function() {
					Options.setConnectorOption(connector, option, this.checked);
				});

				const optionValue =
					await Options.getConnectorOption(connector, option);
				$(optionId).attr('checked', optionValue);
			}
		}
	}

	function showHiddenOptions() {
		$(optionsContainerId)
			.find(`.${hiddenOptionsClass}`).removeClass(hiddenOptionsClass);
	}

	return { initialize };
});
