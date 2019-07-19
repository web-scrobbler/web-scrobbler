'use strict';

require([
	'webextension-polyfill',
	'options/accounts',
	'options/connectors',
	'options/dialogs',
	'options/export',
	'options/options',
	'util/util',
	'bootstrap'
],
(browser, Accounts, Connectors, Dialogs, Export, Options, Util) => {
	const GITHUB_RELEASES_URL =
		'https://github.com/web-scrobbler/web-scrobbler/releases/tag';
	const GITHUB_RAW_SRC =
		'https://github.com/web-scrobbler/web-scrobbler/blob/master/src/';

	async function initialize() {
		await Promise.all([
			Connectors.initialize(),
			Accounts.initialize(),
			Dialogs.initialize(),
			Options.initialize(),
			Export.initialize(),
		]);

		updateSections();
		updateUrls();
	}

	async function updateSections() {
		switch (location.hash) {
			case '#accounts':
				$('#collapseAccounts').collapse('show');
				$('#collapseContacts').collapse('hide');
				break;
			case '#options':
				$('#collapseOptions').collapse('show');
				$('#collapseContacts').collapse('hide');
				break;
		}
	}

	async function updateUrls() {
		/* GitHub releases URL */

		const extVersion = browser.runtime.getManifest().version;
		const releaseNotesUrl = `${GITHUB_RELEASES_URL}/v${extVersion}`;

		$('a#latest-release').attr('href', releaseNotesUrl);

		/* Privacy policy URL */

		const privacyPolicyFile = await Util.getPrivacyPolicyFilename();
		const privacyPolicyUrl = `${GITHUB_RAW_SRC}/${privacyPolicyFile}`;

		$('a#privacy-url').attr('href', privacyPolicyUrl);
	}

	$(document).ready(() => {
		initialize();
	});
});
