'use strict';

require([
	'webextension-polyfill',
	'storage/browser-storage',
	'vendor/showdown.min',
	'storage/options',
], (browser, BrowserStorage, showdown, Options) => {
	const PRIVACY_FILENAME = 'privacy.md';
	const DEFAULT_PRIVACY_PATH = `_locales/en/${PRIVACY_FILENAME}`;

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
		$('.controls').hide();
		$('.finished').show();
	}

	async function updateGaState(value) {
		Options.setOption(Options.DISABLE_GA, value);
	}

	async function preparePrivacyPolicy() {
		const locale = browser.i18n.getMessage('@@ui_locale');
		const privacyDocs = [DEFAULT_PRIVACY_PATH];

		if (!locale.startsWith('en')) {
			const language = locale.split('_')[0];

			privacyDocs.unshift(`_locales/${language}/${PRIVACY_FILENAME}`);
			privacyDocs.unshift(`_locales/${locale}/${PRIVACY_FILENAME}`);
		}

		for (let privacyDoc of privacyDocs) {
			console.log(`fetching ${privacyDoc}`);
			try {
				const response = await fetch(browser.runtime.getURL(privacyDoc));
				const markdown = await response.text();
				let converter = new showdown.Converter();
				let content = converter.makeHtml(markdown);
				$('.privacy-policy').html(content);
				break;
			} catch (err) {
				console.log(`Failed to load ${privacyDoc}, reason: ${err.message}`);
			}
		}
	}
});
