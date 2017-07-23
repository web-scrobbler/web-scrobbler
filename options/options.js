'use strict';

require([
	'jquery',
	'config',
	'connectors',
	'notifications',
	'services/lastfm',
	'customPatterns',
	'chromeStorage',
	'wrappers/chrome',
	'bootstrap'
], function ($, config, connectors, Notifications, LastFM, customPatterns, ChromeStorage, chrome) {
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
			scrobbleMusicOnly: {
				selector: '#yt-music-only',
				conflictsWith: ['scrobbleAll'],
				defaultValue: true,
			},
			scrobbleEntertainmentOnly: {
				selector: '#yt-entertainment-only',
				conflictsWith: ['scrobbleAll'],
				defaultValue: false,
			},
			scrobbleAll: {
				selector: '#yt-scrobble-all',
				conflictsWith: [
					'scrobbleEntertainmentOnly',
					'scrobbleMusicOnly',
				],
				defaultValue: false,
			},
		}
	};

	$(function () {
		var connectorsOptions = ChromeStorage.getNamespace('Connectors');

		// preload values and attach listeners
		for (let option in optionsUiMap) {
			let optionId = optionsUiMap[option];
			$(optionId).attr('checked', localStorage[option] === '1').click(function() {
				localStorage[option] = this.checked ? 1 : 0;
			});
		}

		for (let connector in connectorsOptionsUiMap) {
			for (let option in connectorsOptionsUiMap[connector]) {
				let optionObject = connectorsOptionsUiMap[connector][option];
				let optionId = optionObject.selector;
				$(optionId).change(function() {
					connectorsOptions.get((data) => {
						if (!data[connector]) {
							data[connector] = {};
						}

						data[connector][option] = this.checked;

						if (this.checked) {
							for (let conflicting of optionObject.conflictsWith) {
								let curOptionObject = connectorsOptionsUiMap[connector][conflicting];
								$(curOptionObject.selector).prop('checked', false);
								data[connector][conflicting] = false;
							}
						}

						connectorsOptions.set(data);
					});
				});
			}
		}

		$('button#authorize').click(function () {
			LastFM.getAuthUrl().then((url) => {
				chrome.tabs.create({ url });
			});
		});


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

		// preload async values from storage
		connectorsOptions.get(function (data) {
			for (let connector in connectorsOptionsUiMap) {
				for (let option in connectorsOptionsUiMap[connector]) {
					if (data[connector]) {
						let optionObject = connectorsOptionsUiMap[connector][option];
						let optionId = optionObject.selector;
						if (!data[connector].hasOwnProperty(option)) {
							data[connector][option] = optionObject.defaultValue;
						}
						$(optionId).attr('checked', data[connector][option]);
					}
				}
			}
		});
	});

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
			case 'reauth':
				// Expand 'Options' section and collapse 'Contacts' one.
				console.log('expand');
				$('#options').addClass('in');
				$('#contact').removeClass('in');
				break;
		}

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

		conns.forEach(function (connector, index) {

			var newEl = $('<li>\r\n' +
			'<a href="#" class="conn-config" data-conn="' + index + '">\r\n' +
			'<i class="icon-gear icon-fixed-width"></i>\r\n' +
			'</a>\r\n' +
			'<input type="checkbox" id="conn-' + index + '">\r\n' +
			'<label for="conn-' + index + '">' + connector.label + '</label>\r\n' +
			'</li>');

			var domEl = newEl.appendTo(parent);
			var checkbox = domEl.find('input');

			checkbox.attr('checked', config.isConnectorEnabled(connector.label));

			checkbox.click(function () {
				config.setConnectorEnabled(connector.label, this.checked);
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

	function scrollToElement(selector) {
		var aTag = $(selector);
		console.log(aTag);
		console.log(aTag.offset());
		$('html,body').animate({ scrollTop: aTag.offset().top }, 'fast');
	}

	function getElementIdFromLocation() {
		let url = window.location.href;
		let match = /#(.+?)$/.exec(url);
		if (match) {
			return match[1];
		}
		return null;
	}

	$(document).ready(() => {
		let elementId = getElementIdFromLocation();
		switch (elementId) {
			case 'reauth':
				console.log('scroll');
				scrollToElement('#reauth');
				break;
		}
	});
});
