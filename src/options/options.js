'use strict';

define((require) => {
	const Options = require('storage/options');

	/**
	 * Object that maps options to their element IDs.
	 * @type {Object}
	 */
	const OPTIONS_UI_MAP = {
		'#disable-ga': Options.DISABLE_GA,
		'#force-recognize': Options.FORCE_RECOGNIZE,
		'#use-notifications': Options.USE_NOTIFICATIONS,
		'#use-unrecognized-song-notifications': Options.USE_UNRECOGNIZED_SONG_NOTIFICATIONS,
	};
	const CONNECTORS_OPTIONS_UI_MAP = {
		GoogleMusic: {
			'#gm-podcasts': 'scrobblePodcasts'
		},
		YouTube: {
			'#yt-music-only': 'scrobbleMusicOnly',
			'#yt-entertainment-only': 'scrobbleEntertainmentOnly',
		}
	};

	async function initialize() {
		await initializeOptions();
		await initializeConnectorsOptions();
	}

	async function initializeOptions() {
		for (const optionId in OPTIONS_UI_MAP) {
			const option = OPTIONS_UI_MAP[optionId];

			$(optionId).click(async function() {
				Options.setOption(option, this.checked);
			});

			const optionValue = await Options.getOption(option);
			$(optionId).attr('checked', optionValue);
		}
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

	return { initialize };
});
