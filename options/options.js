'use strict';

require([
	'jquery',
	'config',
	'connectors',
	'customPatterns',
	'storage/chromeStorage',
	'wrappers/chrome',
	'services/scrobbleService',
	'util',
	'bootstrap'
], function($, config, connectors, customPatterns, ChromeStorage, chrome, ScrobbleService, Util) {
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
		YouTube: {
			scrobbleMusicOnly: '#yt-music-only',
			scrobbleEntertainmentOnly: '#yt-entertainment-only'
		}
	};

	const options = ChromeStorage.getStorage(ChromeStorage.OPTIONS);
	const connectorsOptions = ChromeStorage.getStorage(ChromeStorage.CONNECTORS_OPTIONS);

	const sortedConnetors = getConnectors();

	$(function() {
		// preload values and attach listeners
		for (let option in optionsUiMap) {
			let optionId = optionsUiMap[option];
			$(optionId).click(function() {
				options.get().then((data) => {
					data[option] = this.checked;
					options.set(data);
				});
			});
		}

		for (let connector in connectorsOptionsUiMap) {
			for (let option in connectorsOptionsUiMap[connector]) {
				let optionId = connectorsOptionsUiMap[connector][option];
				$(optionId).click(function() {
					connectorsOptions.get().then((data) => {
						if (!data[connector]) {
							data[connector] = {};
						}

						data[connector][option] = this.checked;
						connectorsOptions.set(data);
					});
				});
			}
		}

		// Generate connectors and their checkboxes
		initConnectorsList();

		initAddPatternDialog();
		initViewEditedDialog();

		// Set the toggle init state
		toggleInitState();
		createAccountViews();
		setupChromeListeners();
	});

	function setupChromeListeners() {
		Util.getCurrentTab().then((tab) => {
			chrome.tabs.onActivated.addListener((activeInfo) => {
				if (tab.id === activeInfo.tabId) {
					createAccountViews();
				}
			});
		});
	}

	function createAccountViews() {
		ScrobbleService.getRegisteredScrobblers().forEach(createAccountView);
	}

	function createAccountView(scrobbler) {
		createEmptyView(scrobbler);

		return scrobbler.getSession().then((session) => {
			createAuthorizedAccountView(scrobbler, session);
		}).catch(() => {
			createUnauthorizedAccountView(scrobbler);
		});
	}

	function createAuthorizedAccountView(scrobbler, session) {
		let $account = $(`#${getAccountViewId(scrobbler)}`);
		$account.empty();

		let $label = $('<h3/>').text(scrobbler.getLabel());
		let $authStr = $('<p/>').text(`You're signed in as ${session.sessionName}.`);
		let $controls = $('<div/>').addClass('controls');

		let $profileBtn = $('<a href="#"/>').text('Profile').click(() => {
			scrobbler.getProfileUrl().then((profileUrl) => {
				if (profileUrl) {
					chrome.tabs.create({ url: profileUrl });
				}
			});
		});
		let $reauthBtn = $('<a href="#"/>').text('Reauthenticate').click(() => {
			chrome.runtime.sendMessage({
				type: 'v2.authenticate',
				scrobbler: scrobbler.getLabel(),
				notify: false
			});
			createAccountView(scrobbler);
		});
		let $logoutBtn = $('<a href="#"/>').text('Sign out').click(() => {
			scrobbler.signOut().then(() => {
				createAccountView(scrobbler);
			});
		});

		$controls.append($profileBtn, ' • ', $reauthBtn, ' • ', $logoutBtn);
		$account.append($label, $authStr, $controls);
	}

	function createUnauthorizedAccountView(scrobbler) {
		let $account = $(`#${getAccountViewId(scrobbler)}`);
		$account.empty();

		let $label = $('<h3/>').text(scrobbler.getLabel());
		let $authUrl = $('<a href="#"/>').text('Sign in').click(() => {
			chrome.runtime.sendMessage({
				type: 'v2.authenticate',
				scrobbler: scrobbler.getLabel()
			});
		});
		let $authStr = $('<p/>').text('You\'re not signed in. ').append($authUrl);

		$account.append($label, $authStr);
	}

	function createEmptyView(scrobbler) {
		let elementId = getAccountViewId(scrobbler);
		if ($(`#${elementId}`).length === 0) {
			let $account = $('<div/>').attr('id', elementId);
			$('#accounts div').append($account);
		}
	}

	function getAccountViewId(scrobbler) {
		return scrobbler.getLabel().replace('.', '');
	}

	function toggleInitState() {
		switch (getElementIdFromLocation()) {
			case 'accounts':
				// Expand 'Accounts' section and collapse 'Contacts' one.
				$('#accounts').addClass('in');
				$('#contact').removeClass('in');
				break;
		}

		// preload async values from storage
		options.get().then((data) => {
			for (let option in optionsUiMap) {
				let optionId = optionsUiMap[option];
				$(optionId).attr('checked', data[option]);
			}
		});
		connectorsOptions.get().then((data) => {
			for (let connector in connectorsOptionsUiMap) {
				for (let option in connectorsOptionsUiMap[connector]) {
					if (data[connector]) {
						let optionId = connectorsOptionsUiMap[connector][option];
						$(optionId).attr('checked', data[connector][option]);
					}
				}
			}
		});

		updateReleaseNotesUrl();
	}

	/**
	 * Return sorted array of connectors.
	 * @return {Array} Array of connectors
	 */
	function getConnectors() {
		return connectors.slice(0).sort((a, b) => {
			return a.label.localeCompare(b.label);
		});
	}

	function createNewConfigInput(value) {
		let newElt = $('<li></li>');
		let input = $('<input type="text">').val(value || '');

		let closeBtn = $(
			'<a href="#" class="conn-conf-del-input" tabindex="-1">' +
			'<i class="icon-remove icon-fixed-width"></i>' +
			'</a>'
		).click(function(ev) {
			ev.preventDefault();
			$(this).closest('li').remove();
		});

		newElt.append(input);
		newElt.append(closeBtn);

		return newElt;
	}

	function initConnectorsList() {
		let parent = $('ul#connectors');

		options.get().then((data) => {
			let disabledConnectors = data.disabledConnectors;
			let toggleCheckboxState = false;

			sortedConnetors.forEach((connector, index) => {
				let newEl = $(`${'<li>\r\n' +
					'<a href="#" class="conn-config" data-conn="'}${index}">\r\n` +
					'<i class="icon-gear icon-fixed-width"></i>\r\n' +
					'</a>\r\n' +
					`<input type="checkbox" id="conn-${index}">\r\n` +
					`<label for="conn-${index}">${connector.label}</label>\r\n` +
					'</li>'
				);

				let domEl = newEl.appendTo(parent);
				let checkbox = domEl.find('input');

				checkbox.click(function() {
					config.setConnectorEnabled(connector.label, this.checked);
				});
				let isConnectorEnabled = !disabledConnectors.includes(connector.label);
				checkbox.attr('checked', isConnectorEnabled);

				if (isConnectorEnabled) {
					toggleCheckboxState = true;
				}
			});

			$('input#toggle').attr('checked', toggleCheckboxState);
			$('input#toggle').click(function() {
				// First set each to the negated value and then trigger click
				$('input[id^="conn"]').each((index, connector) => {
					$(connector).prop('checked', this.checked);
				});
				config.setAllConnectorsEnabled(this.checked);
			});
		});
	}

	function initAddPatternDialog() {
		$('body').on('click', 'a.conn-config', (e) => {
			e.preventDefault();

			let modal = $('#conn-conf-modal');
			let index = $(e.currentTarget).data('conn');
			let connector = sortedConnetors[index];

			modal.data('conn', index);
			modal.find('.conn-conf-title').html(connector.label);

			customPatterns.getAllPatterns().then((allPatterns) => {
				let patterns = allPatterns[connector.label] || [];

				let inputs = $('<ul class="list-unstyled" id="conn-conf-list"></ul>');
				for (let value of patterns) {
					inputs.append(createNewConfigInput(value));
				}

				modal.find('.conn-conf-patterns').html(inputs);
				modal.modal('show');
			});
		});

		$('button#conn-conf-ok').click(function() {
			let modal = $(this).closest('#conn-conf-modal');

			let index = modal.data('conn');
			let connector = sortedConnetors[index];

			let patterns = [];
			$('#conn-conf-list').find('input:text').each(function() {
				let pattern = $(this).val();
				if (pattern.length > 0) {
					patterns.push(pattern);
				}
			});

			if (patterns.length > 0) {
				customPatterns.setPatterns(connector.label, patterns);
			} else {
				customPatterns.resetPatterns(connector.label);
			}

			modal.modal('hide');
		});

		$('button#add-pattern').click(() => {
			$('#conn-conf-list').append(createNewConfigInput());
		});

		$('button#conn-conf-reset').click(function() {
			let modal = $(this).closest('#conn-conf-modal');

			let index = modal.data('conn');
			let connector = sortedConnetors[index];

			customPatterns.resetPatterns(connector.label);

			modal.modal('hide');
		});
	}

	function initViewEditedDialog() {
		$('#view-edited').click(() => {
			let localCache = ChromeStorage.getStorage(ChromeStorage.LOCAL_CACHE);

			let cacheDom = $('<div></div>');

			let cache = $('<ul class="list-unstyled"></ul>');

			localCache.get().then((data) => {
				if (Object.keys(data).length === 0) {
					cache.append($('<li>').text('No items in the cache.'));
				} else {
					for (let songId in data) {
						let { artist, track } = data[songId];
						cache.append($('<li>').text(`${artist} — ${track}`));
					}
				}
			});

			cacheDom.append(cache);

			let cacheClearButton = $('<button>Clear Cache</button>');

			cacheClearButton.click(() => {
				localCache.clear();
				modal.modal('hide');
			});

			cacheDom.append(cacheClearButton);

			let modal = $('#edited-track-modal');

			modal.find('.edited-track-contents').html(cacheDom);
			modal.modal('show');
		});
	}

	function updateReleaseNotesUrl() {
		let extVersion = chrome.runtime.getManifest().version;
		let releaseNotesUrl = `https://github.com/david-sabata/web-scrobbler/releases/tag/v${extVersion}`;
		$('a#latest-release').attr('href', releaseNotesUrl);
	}

	function getElementIdFromLocation() {
		let url = window.location.href;
		let match = /#(.+?)$/.exec(url);
		if (match) {
			return match[1];
		}
		return null;
	}
});
