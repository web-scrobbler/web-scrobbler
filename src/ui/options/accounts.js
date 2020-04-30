'use strict';

const propsModalId = 'scrobbler-props';
const propsModalBodyId = 'scrobbler-props-body';
const propsModalTitleId = 'scrobbler-props-title';
const propsModalOkBtnId = 'scrobbler-ok';

define((require) => {
	const { getCurrentTab } = require('util/util-browser');
	const { i18n, runtime, tabs } = require('webextension-polyfill');
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
	};

	async function initialize() {
		await createAccountViews();
		setupEventListeners();
		setupDialog();
	}

	async function setupEventListeners() {
		const tab = await getCurrentTab();
		tabs.onActivated.addListener((activeInfo) => {
			if (tab.id === activeInfo.tabId) {
				createAccountViews();
			}
		});
	}

	async function createAccountViews() {
		const scrobblers = ScrobbleService.getRegisteredScrobblers();
		for (const scrobbler of scrobblers) {
			createAccountContainer(scrobbler);
			fillAccountContainer(scrobbler);
		}
	}

	function createAccountContainer(scrobbler) {
		const containerId = scrobbler.getId();
		if (document.getElementById(containerId) !== null) {
			return;
		}

		const accountContainer = document.createElement('li');
		accountContainer.id = containerId;
		accountContainer.classList.add('list-group-item');

		const accountsList = document.getElementById('accounts-wrapper');
		accountsList.appendChild(accountContainer);
	}

	async function fillAccountContainer(scrobbler) {
		const accountBody = document.getElementById(scrobbler.getId());

		let session = null;
		try {
			session = await scrobbler.getSession();
		} catch (err) {
			// Do nothing
		}

		const label = document.createElement('h4');
		label.classList.add('cart-title');
		label.textContent = scrobbler.getLabel();

		const buttons = document.createElement('div');

		const authStr = document.createElement('span');
		authStr.classList.add('card-text');

		if (session) {
			const userName = session.sessionName || 'anonimous';
			const authText = i18n.getMessage('accountsSignedInAs', userName);

			authStr.textContent = authText;
		} else {
			authStr.textContent = i18n.getMessage('accountsNotSignedIn');
		}

		if (!session) {
			const signInBtn = createButton('accountsSignIn');
			signInBtn.addEventListener('click', () => {
				requestAuthenticate(scrobbler);
			});

			buttons.append(signInBtn);
		}

		if (scrobbler.getUsedDefinedProperties().length > 0) {
			const propsBtn = createButton('accountsScrobblerProps');
			propsBtn.setAttribute('data-toggle', 'modal');
			propsBtn.setAttribute('data-label', scrobbler.getLabel());
			propsBtn.setAttribute('href', '#scrobbler-props');

			buttons.append(propsBtn);
		}

		if (session) {
			const profileUrl = await scrobbler.getProfileUrl();
			if (profileUrl) {
				const profileBtn = createButton('accountsProfile');
				profileBtn.addEventListener('click', () => {
					tabs.create({ url: profileUrl });
				});

				buttons.append(profileBtn);
			}

			const logoutBtn = createButton('accountsSignOut');
			logoutBtn.addEventListener('click', async () => {
				await requestSignOut(scrobbler);
				fillAccountContainer(scrobbler);
			});

			buttons.append(logoutBtn);
		}

		accountBody.innerHTML = '';
		accountBody.appendChild(label);
		accountBody.appendChild(authStr);
		accountBody.appendChild(buttons);
	}

	function fillPropsDialog(scrobbler) {
		const scrobblerLabel = scrobbler.getLabel();

		const modal = document.getElementById(propsModalId);
		const title = document.getElementById(propsModalTitleId);

		const body = document.getElementById(propsModalBodyId);
		body.innerHTML = '';

		const props = scrobblerPropertiesMap[scrobblerLabel];
		for (const propId in props) {
			const { placeholder, title, type } = props[propId];
			const value = scrobbler[propId];

			body.append(createPropConainer({
				propId, placeholder, title, type, value,
			}));
		}

		title.textContent = i18n.getMessage(
			'accountsScrobblerPropsTitle', scrobblerLabel);
		modal.setAttribute('data-label', scrobblerLabel);
	}

	function setupDialog() {
		// const modalDialog = document.getElementById(propsModalId);
		$('#scrobbler-props').on('show.bs.modal', (event) => {
			const button = event.relatedTarget;
			const label = button.getAttribute('data-label');

			fillPropsDialog(ScrobbleService.getScrobblerByLabel(label));
		});

		const okButton = document.getElementById(propsModalOkBtnId);
		okButton.addEventListener('click', onOkButtonClick);
	}

	async function onOkButtonClick() {
		const modal = document.getElementById(propsModalId);
		const label = modal.getAttribute('data-label');
		const scrobbler = ScrobbleService.getScrobblerByLabel(label);

		const userProps = {};
		const scrobblerProps = scrobblerPropertiesMap[label];

		for (const propId in scrobblerProps) {
			const input = document.getElementById(propId);
			const value = input.value || null;

			userProps[propId] = value;
		}
		await requestApplyUserProps(scrobbler, userProps);
		fillAccountContainer(scrobbler);
	}

	function createButton(labelId) {
		const button = document.createElement('a');
		button.classList.add('card-link');
		button.setAttribute('href', '#');
		button.setAttribute('i18n', labelId);
		return button;
	}

	function createPropConainer(prop) {
		const { propId, placeholder, title, type, value } = prop;

		const formGroup = document.createElement('div');
		formGroup.className = 'form-group';

		const label = document.createElement('label');
		label.setAttribute('i18n', title);

		const input = document.createElement('input');
		input.setAttribute('i18n-placeholder', placeholder);
		input.className = 'form-control';
		input.value = value || null;
		input.id = propId;
		if (type) {
			input.type = type;
		}

		formGroup.appendChild(label);
		formGroup.appendChild(input);
		return formGroup;
	}

	function requestAuthenticate(scrobbler) {
		runtime.sendMessage({
			type: 'REQUEST_AUTHENTICATE',
			data: { label: scrobbler.getLabel() },
		});
	}

	function requestApplyUserProps(scrobbler, userProps) {
		// FIXME Called for local instance update
		scrobbler.applyUserProperties(userProps);

		const label = scrobbler.getLabel();
		return runtime.sendMessage({
			type: 'REQUEST_APPLY_USER_OPTIONS', data: { label, userProps },
		});
	}

	function requestSignOut(scrobbler) {
		// FIXME Called for local instance update
		scrobbler.signOut();

		const label = scrobbler.getLabel();
		return runtime.sendMessage({
			type: 'REQUEST_SIGN_OUT', data: { label },
		});
	}

	return { initialize };
});
