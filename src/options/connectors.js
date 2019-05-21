'use strict';

define((require) => {
	const Util = require('util/util');
	const Config = require('storage/config');
	const ChromeStorage = require('storage/chrome-storage');

	const options = ChromeStorage.getStorage(ChromeStorage.OPTIONS);
	const sortedConnectors = Util.getSortedConnectors();

	async function initialize() {
		await initConnectorsList();
	}

	async function initConnectorsList() {
		const parent = $('ul#connectors');

		let toggleCheckboxState = false;
		const data = await options.get();
		const disabledConnectors = data.disabledConnectors;

		sortedConnectors.forEach((connector, index) => {
			const newEl = $(`${'<li>\r\n' +
				'<a href="#" class="conn-config" data-conn="'}${index}">\r\n` +
				'<i class="fa fa-gear fa-fw"></i>\r\n' +
				'</a>\r\n' +
				`<input type="checkbox" id="conn-${index}">\r\n` +
				`<label for="conn-${index}">${connector.label}</label>\r\n` +
				'</li>'
			);

			const domEl = newEl.appendTo(parent);
			const checkbox = domEl.find('input');

			checkbox.click(function() {
				Config.setConnectorEnabled(connector.label, this.checked);
			});
			const isConnectorEnabled = !disabledConnectors.includes(connector.label);
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
			Config.setAllConnectorsEnabled(this.checked);
		});
	}

	return { initialize };
});
