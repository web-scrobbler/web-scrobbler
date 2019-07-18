'use strict';

define((require) => {
	const Util = require('util/util');
	const Options = require('storage/options');

	const sortedConnectors = Util.getSortedConnectors();

	async function initialize() {
		await initConnectorsList();
	}

	async function initConnectorsList() {
		const parent = $('ul#connectors');

		const disabledConnectors =
			await Options.getOption(Options.DISABLED_CONNECTORS);
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
				Options.setConnectorEnabled(connector.label, this.checked);
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
			Options.setAllConnectorsEnabled(this.checked);
		});
	}

	return { initialize };
});
