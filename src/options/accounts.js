'use strict';

define((require) => {
	const Util = require('util/util');
	const browser = require('webextension-polyfill');
	const ScrobbleService = require('object/scrobble-service');

	async function initialize() {
		await createAccountViews();
		setupEventListeners();
	}

	async function setupEventListeners() {
		const tab = await Util.getCurrentTab();
		browser.tabs.onActivated.addListener((activeInfo) => {
			if (tab.id === activeInfo.tabId) {
				createAccountViews();
			}
		});
	}

	async function createAccountViews() {
		const scrobblers = ScrobbleService.getRegisteredScrobblers();
		for (const scrobbler of scrobblers) {
			await createAccountView(scrobbler);
		}
	}

	async function createAccountView(scrobbler) {
		createEmptyAccountView(scrobbler);

		try {
			const session = await scrobbler.getSession();
			await createAuthorizedAccountView(scrobbler, session);
		} catch (e) {
			createUnauthorizedAccountView(scrobbler);
		}
	}

	function createEmptyAccountView(scrobbler) {
		const elementId = getAccountViewId(scrobbler);
		if ($(`#${elementId}`).length === 0) {
			const $account = $('<div/>').attr('id', elementId);
			$('#accounts-wrapper').append($account);
		}
	}

	function getAccountViewId(scrobbler) {
		return scrobbler.getLabel().replace('.', '');
	}

	function createAuthorizedAccountView(scrobbler, session) {
		const $account = $(`#${getAccountViewId(scrobbler)}`);
		$account.empty();

		const $label = $('<h4/>').text(scrobbler.getLabel());
		const $authStr = $('<p/>').text(browser.i18n.getMessage('accountsSignedInAs', session.sessionName));
		const $controls = $('<div/>').addClass('controls');

		const $profileBtn = $('<a href="#"/>').attr('i18n', 'accountsProfile').click(async() => {
			const profileUrl = await scrobbler.getProfileUrl();
			if (profileUrl) {
				browser.tabs.create({ url: profileUrl });
			}
		});
		const $logoutBtn = $('<a href="#"/>').attr('i18n', 'accountsSignOut').click(async() => {
			await scrobbler.signOut();
			createUnauthorizedAccountView(scrobbler);
		});

		$controls.append($profileBtn, ' • ', $logoutBtn);
		$account.append($label, $authStr, $controls);
	}

	function createUnauthorizedAccountView(scrobbler) {
		const $account = $(`#${getAccountViewId(scrobbler)}`);
		$account.empty();

		const $label = $('<h4/>').text(scrobbler.getLabel());
		const $authUrl = $('<a href="#"/>').attr('i18n', 'accountsSignIn').click(() => {
			browser.runtime.sendMessage({
				type: 'REQUEST_AUTHENTICATE',
				scrobbler: scrobbler.getLabel()
			});
		});
		const $authStr = $('<span/>').attr('i18n', 'accountsNotSignedIn');
		const $placeholder = $('<span/>').html('&nbsp;');

		$account.append($label, $authStr, $placeholder, $authUrl);
	}

	return { initialize };
});
