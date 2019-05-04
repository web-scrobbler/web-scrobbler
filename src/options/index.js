'use strict';

require([
	'webextension-polyfill',
	'options/accounts',
	'options/connectors',
	'options/dialogs',
	'options/export',
	'options/options',
	'bootstrap'
],
(browser, Accounts, Connectors, Dialogs, Export, Options) => {
	const GITHUB_RELEASES_URL =
		'https://github.com/web-scrobbler/web-scrobbler/releases/tag';

	async function initialize() {
		await Promise.all([
			Connectors.initialize(),
			Accounts.initialize(),
			Dialogs.initialize(),
			Options.initialize(),
			Export.initialize(),
		]);

		updateSections();
		updateReleaseNotesUrl();
	}

	async function updateSections() {
		switch (location.hash) {
			case '#accounts':
				// Expand 'Accounts' section and collapse 'Contacts' one.
				$('#accounts').addClass('in');
				$('#contact').removeClass('in');
				break;
			case '#options':
				// Expand 'Accounts' section and collapse 'Contacts' one.
				$('#options').addClass('in');
				$('#contact').removeClass('in');
				break;
		}
	}

	function updateReleaseNotesUrl() {
		const extVersion = browser.runtime.getManifest().version;
		const releaseNotesUrl = `${GITHUB_RELEASES_URL}/v${extVersion}`;

		$('a#latest-release').attr('href', releaseNotesUrl);
	}

	$(document).ready(() => {
		initialize();
	});
});
