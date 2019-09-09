'use strict';

require([
	'webextension-polyfill',
	'storage/browser-storage',
	'vendor/showdown.min',
	'storage/options',
	'util/util',
], (browser, BrowserStorage, showdown, Options, Util) => {
	/**
	 * Run initialization
	 */
	init();

	function init() {
		$('#opt-in').click(() => {
			updateGaState(false).then(closePage);
		});

		$('#opt-out').click(() => {
			updateGaState(true).then(closePage);
		});

		preparePrivacyPolicy();
	}

	function closePage() {
		$('#controls').hide();
		$('#finished').show();
	}

	async function updateGaState(value) {
		Options.setOption(Options.DISABLE_GA, value);
	}

	async function preparePrivacyPolicy() {
		const privacyDocFile = await Util.getPrivacyPolicyFilename();

		console.log(`fetching ${privacyDocFile}`);
		try {
			const privacyDocUrl = browser.runtime.getURL(privacyDocFile);
			const response = await fetch(privacyDocUrl);
			const markdown = await response.text();

			const converter = new showdown.Converter();
			const content = converter.makeHtml(markdown);

			$('.privacy-policy').html(content);
		} catch (err) {
			console.log(`Failed to load ${privacyDocFile}, reason: ${err.message}`);
		}
	}
});
