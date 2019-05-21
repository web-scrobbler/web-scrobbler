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

		const data = await options.get();
		const disabledConnectors = data.disabledConnectors;
		const toggleCheckboxState =
			disabledConnectors.length !== sortedConnectors.length;

		sortedConnectors.forEach((connector, index) => {
			const newEl = $(`
				<li>
					<a href="#" class="conn-config" data-conn="${index}">
						<i class="fa fa-gear fa-fw"></i>
					</a>
					<input type="checkbox" id="conn-${index}">
					<label for="conn-${index}">${connector.label}</label>
				</li>
			`);

			const domEl = newEl.appendTo(parent);
			const checkbox = domEl.find('input');

			checkbox.click(function() {
				Config.setConnectorEnabled(connector.label, this.checked);
			});
			const isConnectorEnabled = !disabledConnectors.includes(connector.label);
			checkbox.attr('checked', isConnectorEnabled);
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
