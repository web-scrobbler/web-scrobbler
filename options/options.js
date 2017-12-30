'use strict';

require([
	'config',
	'connectors',
	'customPatterns',
	'storage/chromeStorage',
	'wrappers/chrome',
	'services/scrobbleService',
	'util',
	'bootstrap'
], function(config, connectors, customPatterns, ChromeStorage, chrome, ScrobbleService, Util) {
	const EXPORT_FILENAME = 'local-cache.json';

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
	const localCache = ChromeStorage.getStorage(ChromeStorage.LOCAL_CACHE);
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
		let scrobblers = ScrobbleService.getRegisteredScrobblers();
		let factoryFunctions = scrobblers.map((scrobbler) => {
			return () => {
				return createAccountView(scrobbler);
			};
		});

		return Util.queuePromises(factoryFunctions);
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

		let $label = $('<h4/>').text(scrobbler.getLabel());
		let $authStr = $('<p/>').text(chrome.i18n.getMessage('accountsSignedInAs', session.sessionName));
		let $controls = $('<div/>').addClass('controls');

		let $profileBtn = $('<a href="#"/>').attr('i18n', 'accountsProfile').click(() => {
			scrobbler.getProfileUrl().then((profileUrl) => {
				if (profileUrl) {
					chrome.tabs.create({ url: profileUrl });
				}
			});
		});
		let $logoutBtn = $('<a href="#"/>').attr('i18n', 'accountsSignOut').click(() => {
			scrobbler.signOut().then(() => {
				createUnauthorizedAccountView(scrobbler);
			});
		});

		$controls.append($profileBtn, ' • ', $logoutBtn);
		$account.append($label, $authStr, $controls);
	}

	function createUnauthorizedAccountView(scrobbler) {
		let $account = $(`#${getAccountViewId(scrobbler)}`);
		$account.empty();

		let $label = $('<h4/>').text(scrobbler.getLabel());
		let $authUrl = $('<a href="#"/>').attr('i18n', 'accountsSignIn').click(() => {
			chrome.runtime.sendMessage({
				type: 'v2.authenticate',
				scrobbler: scrobbler.getLabel()
			});
		});
		let $authStr = $('<span/>').attr('i18n', 'accountsNotSignedIn');
		let $placeholder = $('<span/>').html('&nbsp;');

		$account.append($label, $authStr, $placeholder, $authUrl);
	}

	function createEmptyView(scrobbler) {
		let elementId = getAccountViewId(scrobbler);
		if ($(`#${elementId}`).length === 0) {
			let $account = $('<div/>').attr('id', elementId);
			$('#accounts-wrapper').append($account);
		}
	}

	function getAccountViewId(scrobbler) {
		return scrobbler.getLabel().replace('.', '');
	}

	function toggleInitState() {
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
		let inputEl = $('<input type="text">');
		inputEl.val(value);

		let closeEl = $('<span id="modal-connector-remove" class="add-on"><i class="fa fa-remove fa-fw close-btn"></i></span>');
		closeEl.click(function(ev) {
			ev.preventDefault();
			$(this).parent().remove();
		});

		let input = $('<div class="input-append"</div>');
		input.append(inputEl);
		input.append(closeEl);

		return input;
	}

	function initConnectorsList() {
		let parent = $('ul#connectors');

		options.get().then((data) => {
			let disabledConnectors = data.disabledConnectors;
			let toggleCheckboxState = false;

			sortedConnetors.forEach((connector, index) => {
				let newEl = $(`${'<li>\r\n' +
					'<a href="#" class="conn-config" data-conn="'}${index}">\r\n` +
					'<i class="fa fa-gear fa-fw"></i>\r\n' +
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
			function addNoEditedLabel(node) {
				node.append($('<li>').attr('i18n', 'noItemsInCache'));
			}

			let modal = $('#edited-track-modal');
			let cacheDom = $('#edited-track-content');

			localCache.get().then((data) => {
				cacheDom.empty();

				if (Object.keys(data).length === 0) {
					addNoEditedLabel(cacheDom);
				} else {
					for (let songId in data) {
						let { artist, track, album } = data[songId];

						let item = $(`<li>${artist} — ${track}</li>`);
						let removeBtn = $('<button type="button" class="close-btn"><i class="fa fa-times fa-fw"></i></button>');

						if (album) {
							item.attr('title', chrome.i18n.getMessage('albumTooltip', album));
						}
						removeBtn.click(function() {
							localCache.get().then((data) => {
								delete data[songId];
								localCache.set(data).then(() => {
									$(this.parentNode).remove();
									if (Object.keys(data).length === 0) {
										addNoEditedLabel(cacheDom);
									}
								});
							});
						});

						item.append(removeBtn);
						cacheDom.append(item);
					}
				}
			});

			$('#clear-cache').click(() => {
				localCache.clear();
				modal.modal('hide');
			});

			modal.modal('show');
		});

		$('#export-edited').click((e) => {
			e.preventDefault();
			exportLocalCache();
		});

		$('#import-edited').click((e) => {
			e.preventDefault();
			importLocalStorage();
		});
	}

	function updateReleaseNotesUrl() {
		let extVersion = chrome.runtime.getManifest().version;
		let releaseNotesUrl = `https://github.com/web-scrobbler/web-scrobbler/releases/tag/v${extVersion}`;
		$('a#latest-release').attr('href', releaseNotesUrl);
	}

	/**
	 * Export content of LocalCache storage to a file.
	 */
	function exportLocalCache() {
		localCache.get().then((data) => {
			let dataStr = JSON.stringify(data, null, 2);
			let blob = new Blob([dataStr], { 'type': 'application/octet-stream' });
			let url = URL.createObjectURL(blob);

			let a = document.createElement('a');
			a.href = url;
			a.download = EXPORT_FILENAME;
			a.dispatchEvent(new MouseEvent('click'));
			a.remove();

			URL.revokeObjectURL(url);
		});
	}

	/**
	 * Import LocalCache storage from a file.
	 */
	function importLocalStorage() {
		let fileInput = document.createElement('input');

		fileInput.style.display = 'none';
		fileInput.type = 'file';
		fileInput.accept = '.json';
		fileInput.acceptCharset = 'utf-8';

		document.body.appendChild(fileInput);
		fileInput.initialValue = fileInput.value;
		fileInput.onchange = readFile;
		fileInput.click();

		function readFile() {
			if (fileInput.value !== fileInput.initialValue) {
				let file = fileInput.files[0];

				const reader = new FileReader();
				reader.onloadend = (event) => {
					let dataStr = event.target.result;
					let data = JSON.parse(dataStr);

					localCache.set(data);
					fileInput.remove();
				};
				reader.readAsText(file, 'utf-8');
			}
		}
	}
});
