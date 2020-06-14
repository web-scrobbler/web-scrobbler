'use strict';

require([
	'webextension-polyfill',
	'vendor/showdown.min',
	'storage/options',
	'util/util-browser',
], (browser, showdown, Options, Util) => {
	/**
	 * Run initialization
	 */
	init();

	function init() {
		$('#opt-out').click(closePage);

		preparePrivacyPolicy();
	}

	function closePage() {
		$('#controls').hide();
		$('#finished').show();
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
