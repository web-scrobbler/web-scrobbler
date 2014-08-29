'use strict';

require([
	'jquery',
	'config',
	'connectors',
	'legacy/scrobbler',
	'bootstrap'
], function ($, config, connectors, legacyScrobbler) {

	$(function () {

		// preload values and attach listeners

		$('#use-notifications')
			.attr('checked', (localStorage.useNotifications == 1))
			.click(function () {
				localStorage.useNotifications = this.checked ? 1 : 0;
			});

		$('#use-autocorrect')
			.attr('checked', (localStorage.useAutocorrect == 1))
			.click(function () {
				localStorage.useAutocorrect = this.checked ? 1 : 0;
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

		// generate connectors and their checkboxes
		createConnectors();

		// Set the toggle init state
		toggleInitState();
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
	}

	function createConnectors() {
		var parent = $('ul#connectors');

		// prevent mutation of original
		var conns = connectors.slice(0);

		// sort alphabetically
		conns.sort(function (a, b) {
			return a.label.localeCompare(b.label);
		});

		conns.forEach(function (connector, index) {

			var newEl = $('<li>\r\n<input type="checkbox" id="conn-' + index + '">\r\n' +
			'<label for="conn-' + index + '">' + connector.label + '</label>\r\n' +
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
	}

});
