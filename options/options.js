'use strict';

require([
	'jquery',
	'config',
	'connectors',
	'legacy/scrobbler',
	'customPatterns',
	'chromeStorage',
	'wrappers/chrome',
	'bootstrap'
], function ($, config, connectors, legacyScrobbler, customPatterns, ChromeStorage, chrome) {

	$(function () {
		var connectorsOptions = ChromeStorage.getNamespace('Connectors');

		// preload values and attach listeners

		$('#use-notifications')
			.attr('checked', (localStorage.useNotifications === '1'))
			.click(function () {
				localStorage.useNotifications = this.checked ? 1 : 0;
			});

		$('#use-autocorrect')
			.attr('checked', (localStorage.useAutocorrect === '1'))
			.click(function () {
				localStorage.useAutocorrect = this.checked ? 1 : 0;
			});

		$('#disable-ga')
			.attr('checked', (localStorage.disableGa === '1'))
			.click(function () {
				localStorage.disableGa = this.checked ? 1 : 0;
			});

		$('#yt-music-only')
			.click(function () {
				var checked = this.checked;
				connectorsOptions.get(function(data) {
					if (!data.YouTube) {
						data.YouTube = {};
					}

					data.YouTube.scrobbleMusicOnly = checked;
					connectorsOptions.set(data);
				});
			});


		$('button#authorize').click(function () {
			legacyScrobbler.authorize();
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
			if (data && data.YouTube) {
				$('#yt-music-only').attr('checked', data.YouTube.scrobbleMusicOnly);
			}
		});

		bindDataDialogs();
	});

	function bindDataDialogs() {
		$('a[data-dialog]').click(function() {
			var url = chrome.extension.getURL('/dialogs/help/' + $(this).data('dialog') + '.html');
			window.open(url, 'help', 'width=400,height=400');
			return false;
		});
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
			(connector.version === 2 ? ' <a href="#" data-dialog="v2_connectors" class="v2">v2</a>' : '') +
			'</li>');

			var domEl = newEl.appendTo(parent);
			var checkbox = domEl.find('input');

			checkbox.attr('checked', config.isConnectorEnabled(connector.label));

			checkbox.click(function () {
				var box = $(this);
				var disabledArray = JSON.parse(localStorage.disabledConnectors);

				// always remove, to prevent duplicates
				var index = disabledArray.indexOf(connector.label);
				if (index > -1) {
					disabledArray.splice(index, 1);
				}

				if (!box.is(':checked')) {
					disabledArray.push(connector.label);
				}

				localStorage.disabledConnectors = JSON.stringify(disabledArray);
				console.log(localStorage.disabledConnectors);
			});
		});

		bindDataDialogs();

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

			customPatterns.getAllPatterns(function(allPatterns) {
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

});
