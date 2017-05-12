'use strict';

require([
	'jquery',
	'config',
	'connectors',
	'customPatterns',
	'storage/chromeStorage',
	'wrappers/chrome',
	'scrobblers/lastfm',
	'scrobblers/librefm',
	'util',
	'bootstrap'
], function ($, config, connectors, customPatterns, ChromeStorage, chrome, LastFM, LibreFM, Util) {
	/**
	 * Object that maps options to their element IDs.
	 * @type {Object}
	 */
	const optionsUiMap = {
		disableGa: '#disable-ga',
		forceRecognize: '#force-recognize',
		useAutocorrect: '#use-autocorrect',
		useNotifications: '#use-notifications',
		useUnrecognizedSongNotifications: '#use-unrecognized-song-notifications'
	};
	const connectorsOptionsUiMap = {
		YouTube: {
			scrobbleMusicOnly: '#yt-music-only',
			scrobbleEntertainmentOnly: '#yt-entertainment-only'
		}
	};

	const options = ChromeStorage.getLocalStorage('Options');
	const connectorsOptions = ChromeStorage.getLocalStorage('Connectors');

	$(function () {
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

		$('input#toggle').click(function () {
			var negatedCheckState = !$(this).is(':checked');

			// First set each to the negated value and then trigger click
			$('input[id^="conn"]').each(function (index, connector) {
				$(connector).prop('checked', negatedCheckState);
				$(connector).trigger('click');
			});
		});

		$('button#add-pattern').click(function() {
			$('#conn-conf-list').append(createNewConfigInput());
		});

		// generate connectors and their checkboxes
		createConnectors();

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
		createAccountView(LastFM).then(() => {
			return createAccountView(LibreFM);
		});
	}

	function createAccountView(scrobbler) {
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
				scrobbler: scrobbler.getLabel(),
				notify: false
			});
		});
		let $authStr = $('<p/>').text('You\'re not signed in. ').append($authUrl);

		$account.append($label, $authStr);
	}

	function getAccountViewId(scrobbler) {
		return scrobbler.getLabel().replace('.', '');
	}

	function toggleInitState() {
		var checkedState = true;

		$('input[id^="conn"]').each(function () {
			if (!$(this).is(':checked')) {
				checkedState = false;
				return false;
			}
		});

		$('input#toggle').prop('checked', checkedState);

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

	function listConnectors() {
		// prevent mutation of original
		var conns = connectors.slice(0);

		// sort alphabetically
		conns.sort(function (a, b) {
			return a.label.localeCompare(b.label);
		});

		return conns;
	}

	function createNewConfigInput(value) {
		value = typeof value === 'undefined' ? '' : value;

		var newElt = $('<li></li>');

		var input = $('<input type="text">').val(value);

		newElt.append(input);

		var closeBtn = $(
			'<a href="#" class="conn-conf-del-input" tabindex="-1">' +
		'<i class="icon-remove icon-fixed-width"></i>' +
		'</a>').click(function(ev) {
			ev.preventDefault();

			$(this).closest('li').remove();
		});

		newElt.append(closeBtn);

		return newElt;
	}

	function createConnectors() {
		var parent = $('ul#connectors');

		var conns = listConnectors();

		options.get().then((data) => {
			let disabledConnectors = data.disabledConnectors;

			conns.forEach((connector, index) => {
				var newEl = $('<li>\r\n' +
				'<a href="#" class="conn-config" data-conn="' + index + '">\r\n' +
				'<i class="icon-gear icon-fixed-width"></i>\r\n' +
				'</a>\r\n' +
				'<input type="checkbox" id="conn-' + index + '">\r\n' +
				'<label for="conn-' + index + '">' + connector.label + '</label>\r\n' +
				'</li>');

				var domEl = newEl.appendTo(parent);
				var checkbox = domEl.find('input');

				checkbox.click(function () {
					config.setConnectorEnabled(connector.label, this.checked);
				});
				let isConnectorEnabled = disabledConnectors.indexOf(connector.label) === -1;
				checkbox.attr('checked', isConnectorEnabled);
			});
		});

		$('button#conn-conf-ok').click(function() {
			var modal = $(this).closest('#conn-conf-modal');

			var index = modal.data('conn');
			var connector = conns[index];

			var patterns = [];
			$('#conn-conf-list').find('input:text').each(function() {
				var pattern = $(this).val();
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

		$('button#conn-conf-reset').click(function() {
			var modal = $('#conn-conf-modal');

			var index = modal.data('conn');
			var connector = conns[index];

			customPatterns.resetPatterns(connector.label);

			modal.modal('hide');
		});

		$('body').on('click', '#view-edited', function(event) {
			event.preventDefault();

			const localCache = ChromeStorage.getStorage(ChromeStorage.LOCAL_CACHE);
			console.log(localCache);

			let cache = $('<ul class="list-unstyled"></ul>');
			localCache.get().then((data) => {
				if (Object.keys(data).length === 0) {
					cache.append($('<li>').text('No items in the cache.'));
				} else {
					$.each(data, function(cachedKey, cachedData) {
						let { artist, track } = cachedData;
						cache.append($('<li>').text(`${artist} — ${track}`));
					});
				}
			});

			let modal = $('#edited-track-modal');

			modal.find('.edited-track-contents').html(cache);

			modal.modal('show');
		});

		$('body').on('click', 'a.conn-config', function(event) {
			event.preventDefault();

			var modal = $('#conn-conf-modal');
			var index = $(event.currentTarget).data('conn');
			var connector = conns[index];

			modal.data('conn', index);
			modal.find('.conn-conf-title').html(connector.label);

			customPatterns.getAllPatterns().then((allPatterns) => {
				var patterns = allPatterns[connector.label] || [];

				var inputs = $('<ul class="list-unstyled" id="conn-conf-list"></ul>');
				for (var i = 0; i < patterns.length; i++) {
					var value = patterns[i];
					var input = createNewConfigInput(value);

					inputs.append(input);
				}

				modal.find('.conn-conf-patterns').html(inputs);

				modal.modal('show');
			});
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
