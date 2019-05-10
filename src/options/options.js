'use strict';

require([
	'storage/config',
	'connectors',
	'storage/custom-patterns',
	'storage/chrome-storage',
	'wrapper/chrome',
	'service/scrobble-service',
	'util/util',
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
		GoogleMusic: {
			scrobblePodcasts: '#gm-podcasts'
		},
		YouTube: {
			scrobbleMusicOnly: '#yt-music-only',
			scrobbleEntertainmentOnly: '#yt-entertainment-only'
		}
	};

	const options = ChromeStorage.getStorage(ChromeStorage.OPTIONS);
	const localCache = ChromeStorage.getStorage(ChromeStorage.LOCAL_CACHE);
	const connectorsOptions = ChromeStorage.getStorage(ChromeStorage.CONNECTORS_OPTIONS);

	const sortedConnectors = getConnectors();

	$(function() {
		initConnectorsList();
		initOptions();

		initAddPatternDialog();
		initViewEditedDialog();

		toggleInitState();
		createAccountViews();
		setupChromeListeners();
	});

	function initOptions() {
		// preload values and attach listeners
		for (let option in optionsUiMap) {
			let optionId = optionsUiMap[option];
			$(optionId).click(async function() {
				const data = await options.get();
				data[option] = this.checked;

				await options.set(data);
			});
		}

		for (let connector in connectorsOptionsUiMap) {
			for (let option in connectorsOptionsUiMap[connector]) {
				let optionId = connectorsOptionsUiMap[connector][option];
				$(optionId).click(async function() {
					const data = await connectorsOptions.get();
					if (!data[connector]) {
						data[connector] = {};
					}

					data[connector][option] = this.checked;
					await connectorsOptions.set(data);
				});
			}
		}
	}

	async function setupChromeListeners() {
		const tab = await Util.getCurrentTab();
		chrome.tabs.onActivated.addListener((activeInfo) => {
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
		createEmptyView(scrobbler);

		try {
			const session = await scrobbler.getSession();
			await createAuthorizedAccountView(scrobbler, session);
		} catch (e) {
			createUnauthorizedAccountView(scrobbler);
		}
	}

	function createAuthorizedAccountView(scrobbler, session) {
		let $account = $(`#${getAccountViewId(scrobbler)}`);
		$account.empty();

		let $label = $('<h4/>').text(scrobbler.getLabel());
		let $authStr = $('<p/>').text(chrome.i18n.getMessage('accountsSignedInAs', session.sessionName));
		let $controls = $('<div/>').addClass('controls');

		let $profileBtn = $('<a href="#"/>').attr('i18n', 'accountsProfile').click(async() => {
			const profileUrl = await scrobbler.getProfileUrl();
			if (profileUrl) {
				chrome.tabs.create({ url: profileUrl });
			}
		});
		let $logoutBtn = $('<a href="#"/>').attr('i18n', 'accountsSignOut').click(async() => {
			await scrobbler.signOut();
			createUnauthorizedAccountView(scrobbler);
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
				type: 'REQUEST_AUTHENTICATE',
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

	async function toggleInitState() {
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
		const data1 = await options.get();
		for (let option in optionsUiMap) {
			let optionId = optionsUiMap[option];
			$(optionId).attr('checked', data1[option]);
		}

		const data2 = await connectorsOptions.get();
		for (let connector in connectorsOptionsUiMap) {
			for (let option in connectorsOptionsUiMap[connector]) {
				if (data2[connector]) {
					let optionId = connectorsOptionsUiMap[connector][option];
					$(optionId).attr('checked', data2[connector][option]);
				}
			}
		}

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

	async function initConnectorsList() {
		let parent = $('ul#connectors');

		const data = await options.get();
		let disabledConnectors = data.disabledConnectors;
		let toggleCheckboxState = false;

		sortedConnectors.forEach((connector, index) => {
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
	}

	function initAddPatternDialog() {
		$('body').on('click', 'a.conn-config', async(e) => {
			e.preventDefault();

			let modal = $('#conn-conf-modal');
			let index = $(e.currentTarget).data('conn');
			let connector = sortedConnectors[index];

			modal.data('conn', index);
			modal.find('.conn-conf-title').html(connector.label);

			const allPatterns = await customPatterns.getAllPatterns();
			let patterns = allPatterns[connector.label] || [];

			let inputs = $('<ul class="list-unstyled" id="conn-conf-list"></ul>');
			for (let value of patterns) {
				inputs.append(createNewConfigInput(value));
			}

			modal.find('.conn-conf-patterns').html(inputs);
			modal.modal('show');
		});

		$('button#conn-conf-ok').click(function() {
			let modal = $(this).closest('#conn-conf-modal');

			let index = modal.data('conn');
			let connector = sortedConnectors[index];

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
			let connector = sortedConnectors[index];

			customPatterns.resetPatterns(connector.label);

			modal.modal('hide');
		});
	}

	function initViewEditedDialog() {
		$('#view-edited').click(async() => {
			function addNoEditedLabel(node) {
				node.append($('<li>').attr('i18n', 'noItemsInCache'));
			}

			let modal = $('#edited-track-modal');
			let cacheDom = $('#edited-track-content');
			cacheDom.empty();

			const data = await localCache.get();
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
					removeBtn.click(async() => {
						const data = await localCache.get();
						delete data[songId];

						await localCache.set(data);
						$(this.parentNode).remove();

						if (Object.keys(data).length === 0) {
							addNoEditedLabel(cacheDom);
						}
					});

					item.append(removeBtn);
					cacheDom.append(item);
				}

				let cacheSizeStr = Object.keys(data).length.toString();
				let poputTitle = chrome.i18n.getMessage('optionsEditedTracksPopupTitle', cacheSizeStr);
				$('#edited-track-modal .modal-title').text(poputTitle);
			}

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
	async function exportLocalCache() {
		const data = await localCache.get();
		let dataStr = JSON.stringify(data, null, 2);
		let blob = new Blob([dataStr], { 'type': 'application/octet-stream' });
		let url = URL.createObjectURL(blob);

		let a = document.createElement('a');
		a.href = url;
		a.download = EXPORT_FILENAME;
		a.dispatchEvent(new MouseEvent('click'));
		a.remove();

		URL.revokeObjectURL(url);
		URL.revokeObjectURL(url);
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

					localCache.update(data).then(fileInput.remove);

				};
				reader.readAsText(file, 'utf-8');
			}
		}
	}
});
