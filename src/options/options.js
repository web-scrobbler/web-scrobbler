'use strict';

define((require) => {
	const ChromeStorage = require('storage/chrome-storage');

	const options = ChromeStorage.getStorage(ChromeStorage.OPTIONS);
	const connectorsOptions = ChromeStorage.getStorage(ChromeStorage.CONNECTORS_OPTIONS);

	/**
	 * Object that maps options to their element IDs.
	 * @type {Object}
	 */
	const optionsUiMap = {
		disableGa: '#disable-ga',
		forceRecognize: '#force-recognize',
		useNotifications: '#use-notifications',
		useUnrecognizedSongNotifications: '#use-unrecognized-song-notifications'
	};
	const connectorsOptionsUiMap = {
		GoogleMusic: {
			scrobblePodcasts: '#gm-podcasts'
		},
		YouTube: {
			scrobbleMusicOnly: '#yt-music-only',
			scrobbleEntertainmentOnly: '#yt-entertainment-only'
		}
	};

	async function initialize() {
		await initializeOptions();
		await initializeConnectorsOptions();
	}

	async function initializeOptions() {
		const optionsData = await options.get();

		for (const option in optionsUiMap) {
			const optionId = optionsUiMap[option];

			$(optionId).click(async function() {
				const data = await options.get();
				data[option] = this.checked;

				await options.set(data);
			});

			$(optionId).attr('checked', optionsData[option]);
		}
	}

	async function initializeConnectorsOptions() {
		const connectorsData = await connectorsOptions.get();

		for (const connector in connectorsOptionsUiMap) {
			for (const option in connectorsOptionsUiMap[connector]) {
				const optionId = connectorsOptionsUiMap[connector][option];

				$(optionId).click(async function() {
					const data = await connectorsOptions.get();
					if (!data[connector]) {
						data[connector] = {};
					}

					data[connector][option] = this.checked;
					await connectorsOptions.set(data);
				});

				$(optionId).attr('checked', connectorsData[connector][option]);
			}
		}
	}

	return { initialize };
});
