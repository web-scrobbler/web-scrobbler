'use strict';

import 'bootstrap/dist/css/bootstrap.css';

import 'ui/base.css';
import 'ui/startup/index.css';

import 'ui/i18n';

require([
	'webextension-polyfill',
	'showdown',
	'storage/options',
	'util/util-browser',
], (browser, showdown, Options, Util) => {
	const optInBtnId = 'opt-in';
	const optOutBtnId = 'opt-out';

	const privacyContainerId = 'privacy-text';
	const controlsContainerId = 'controls';
	const finishedTooltipId = 'finished';

	/**
	 * Run initialization
	 */
	init();

	function init() {
		const optInBtn = document.getElementById(optInBtnId);
		const optOutBtn = document.getElementById(optOutBtnId);

		optInBtn.addEventListener('click', () => {
			processClick({ disableGa: false });
		});
		optOutBtn.addEventListener('click', () => {
			processClick({ disableGa: true });
		});

		preparePrivacyPolicy();
	}

	async function processClick({ disableGa = false } = {}) {
		Options.setOption(Options.DISABLE_GA, disableGa);
		updateControlsAfterClick();
	}

	function updateControlsAfterClick() {
		const controlsContainer = document.getElementById(controlsContainerId);
		const finishedToolip = document.getElementById(finishedTooltipId);

		controlsContainer.setAttribute('hidden', true);
		finishedToolip.removeAttribute('hidden');
	}

	async function preparePrivacyPolicy() {
		const htmlContents = await getPrivacyHtmlContents();
		const privacyContainer = document.getElementById(privacyContainerId);
		privacyContainer.innerHTML = htmlContents;
	}

	async function getPrivacyHtmlContents() {
		const privacyDocFile = await Util.getPrivacyPolicyFilename();

		console.log(`Fetching ${privacyDocFile}`);
		try {
			const privacyDocUrl = browser.runtime.getURL(privacyDocFile);
			const response = await fetch(privacyDocUrl);
			const markdown = await response.text();

			const converter = new showdown.Converter();
			return converter.makeHtml(markdown);
		} catch (err) {
			console.log(`Failed to load ${privacyDocFile}, reason: ${err.message}`);
		}

		return null;
	}
});
