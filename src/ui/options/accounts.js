'use strict';

define((require) => {
	const { getCurrentTab } = require('util/util-browser');
	const browser = require('webextension-polyfill');
	const ScrobbleService = require('object/scrobble-service');

	const scrobblerPropertiesMap = {
		ListenBrainz: {
			userApiUrl: {
				title: 'accountsUserApiUrl',
				placeholder: 'accountsUserApiUrlPlaceholder',
			},
			userToken: {
				type: 'password',
				title: 'accountsUserToken',
				placeholder: 'accountsUserTokenPlaceholder',
			},
		},
		Maloja: {
			userApiUrl: {
				title: 'accountsUserApiUrl',
				placeholder: 'accountsUserApiUrlPlaceholder',
			},
			userToken: {
				type: 'password',
				title: 'accountsUserToken',
				placeholder: 'accountsUserTokenPlaceholder',
			},
		},
	};

	async function initialize() {
		await createAccountViews();
		setupEventListeners();
		setupDialog();
	}

	async function setupEventListeners() {
		const tab = await getCurrentTab();
		browser.tabs.onActivated.addListener((activeInfo) => {
			if (tab.id === activeInfo.tabId) {
				createAccountViews();
			}
		});
	}

	async function createAccountViews() {
		const scrobblers = ScrobbleService.getRegisteredScrobblers();
		for (const scrobbler of scrobblers) {
			createEmptyAccountView(scrobbler);
			createAccountView(scrobbler);
		}
	}

	function createEmptyAccountView(scrobbler) {
		const elementId = getAccountViewId(scrobbler);
		if ($(`#${elementId}`).length === 0) {
			const $account = $('<li class="list-group-item"/>').attr('id', elementId);
			$('#accounts-wrapper').append($account);
		}
	}

	function getAccountViewId(scrobbler) {
		return scrobbler.getLabel().replace('.', '');
	}

	async function createAccountView(scrobbler) {
		const accountBody = $(`#${getAccountViewId(scrobbler)}`);

		let session = null;
		try {
			session = await scrobbler.getSession();
		} catch (err) {
			// Do nothing
		}

		const label = $('<h4 class="card-title"/>').text(scrobbler.getLabel());
		const buttons = $('<div/>');

		let authStr = null;
		if (session) {
			const userName = session.sessionName || 'anonymous';
			const authText = browser.i18n.getMessage('accountsSignedInAs', userName);
			authStr = $('<span class="card-text"/>').text(authText);
		} else {
			authStr = $('<span class="card-text"/>').attr('i18n', 'accountsNotSignedIn');
		}

		if (!session) {
			const signInBtn = $('<a class="card-link" href="#"/>')
				.attr('i18n', 'accountsSignIn').click(() => {
					requestAuthenticate(scrobbler);
				});
			buttons.append(signInBtn);
		}

		if (scrobbler.getUsedDefinedProperties().length > 0) {
			const propsBtn = $('<a class="card-link" href="#"/>')
				.attr('i18n', 'accountsScrobblerProps')
				.click(() => {
					initDialog(scrobbler);
				});
			buttons.append(propsBtn);
		}

		if (session) {
			const profileUrl = await scrobbler.getProfileUrl();
			if (profileUrl) {
				const profileBtn = $('<a class="card-link" href="#"/>')
					.attr('i18n', 'accountsProfile')
					.click(() => {
						browser.tabs.create({ url: profileUrl });
					});
				buttons.append(profileBtn);
			}
			const logoutBtn = $('<a class="card-link" href="#"/>')
				.attr('i18n', 'accountsSignOut')
				.click(async () => {
					await requestSignOut(scrobbler);
					createAccountView(scrobbler);
				});
			buttons.append(logoutBtn);
		}

		accountBody.empty().append(label, authStr, buttons);
	}

	function initDialog(scrobbler) {
		const modal = $('#scrobbler-props');
		const title = $('#scrobbler-props-title');

		const body = $('#scrobbler-props-body').empty();
		const props = scrobblerPropertiesMap[scrobbler.getLabel()];

		for (const prop in props) {
			const { placeholder, title, type } = props[prop];

			const formGroup = $('<div class="form-group"/>');
			const label = $('<label/>').attr('i18n', title);
			const input = $('<input class="form-control">')
				.attr('id', prop)
				.attr('i18n-placeholder', placeholder)
				.val(scrobbler[prop]);
			if (type) {
				input.attr('type', type);
			}

			formGroup.append(label, input);
			body.append(formGroup);
		}

		title.text(browser.i18n.getMessage(
			'accountsScrobblerPropsTitle', scrobbler.getLabel()));
		modal.data('label', scrobbler.getLabel());
		modal.modal('show');
	}

	function setupDialog() {
		$('#scrobbler-ok').click(async () => {
			const modal = $('#scrobbler-props');
			const label = modal.data('label');
			const scrobbler = ScrobbleService.getScrobblerByLabel(label);

			const userProps = {};
			const scrobblerProps = scrobblerPropertiesMap[label];

			for (const prop in scrobblerProps) {
				const input = $(`#${prop}`);
				const value = input.val() || null;

				userProps[prop] = value;
			}
			await requestApplyUserProps(scrobbler, userProps);
			createAccountView(scrobbler);

			modal.modal('hide');
		});
	}

	function requestAuthenticate(scrobbler) {
		browser.runtime.sendMessage({
			type: 'REQUEST_AUTHENTICATE',
			data: { label: scrobbler.getLabel() },
		});
	}

	function requestApplyUserProps(scrobbler, userProps) {
		// FIXME Called for local instance update
		scrobbler.applyUserProperties(userProps);

		const label = scrobbler.getLabel();
		return browser.runtime.sendMessage({
			type: 'REQUEST_APPLY_USER_OPTIONS', data: { label, userProps },
		});
	}

	function requestSignOut(scrobbler) {
		// FIXME Called for local instance update
		scrobbler.signOut();

		const label = scrobbler.getLabel();
		return browser.runtime.sendMessage({
			type: 'REQUEST_SIGN_OUT', data: { label },
		});
	}

	return { initialize };
});
