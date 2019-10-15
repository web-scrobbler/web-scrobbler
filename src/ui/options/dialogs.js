'use strict';

define((require) => {
	const Util = require('util/util');
	const browser = require('webextension-polyfill');
	const CustomPatterns = require('storage/custom-patterns');
	const BrowserStorage = require('storage/browser-storage');

	const sortedConnectors = Util.getSortedConnectors();
	const localCache = BrowserStorage.getStorage(BrowserStorage.LOCAL_CACHE);

	function initialize() {
		initAddPatternDialog();
		initViewEditedDialog();
	}

	function initAddPatternDialog() {
		$('body').on('click', 'a.conn-config', async(e) => {
			e.preventDefault();

			const modal = $('#conn-conf-modal');
			const index = $(e.currentTarget).data('conn');
			const connector = sortedConnectors[index];

			modal.data('conn', index);
			modal.find('.modal-title').html(connector.label);

			const allPatterns = await CustomPatterns.getAllPatterns();
			const patterns = allPatterns[connector.id] || [];

			const inputs = $('<ul class="list-unstyled" id="conn-conf-list"></ul>');
			for (const value of patterns) {
				inputs.append(createNewConfigInput(value));
			}

			modal.find('.conn-conf-patterns').html(inputs);
			modal.modal('show');
		});

		$('button#conn-conf-ok').click(function() {
			const modal = $(this).closest('#conn-conf-modal');

			const index = modal.data('conn');
			const connector = sortedConnectors[index];

			const patterns = [];
			$('#conn-conf-list').find('input:text').each(function() {
				const pattern = $(this).val();
				if (pattern.length > 0) {
					patterns.push(pattern);
				}
			});

			if (patterns.length > 0) {
				CustomPatterns.setPatterns(connector.id, patterns);
			} else {
				CustomPatterns.resetPatterns(connector.id);
			}

			modal.modal('hide');
		});

		$('button#add-pattern').click(() => {
			$('#conn-conf-list').append(createNewConfigInput());
		});

		$('button#conn-conf-reset').click(function() {
			const modal = $(this).closest('#conn-conf-modal');

			const index = modal.data('conn');
			const connector = sortedConnectors[index];

			CustomPatterns.resetPatterns(connector.id);

			modal.modal('hide');
		});
	}

	function initViewEditedDialog() {
		$('#view-edited').click(async(e) => {
			e.preventDefault();

			function addNoEditedLabel(node) {
				node.append($('<li>').attr('i18n', 'noItemsInCache'));
			}

			const modal = $('#edited-track-modal');
			const cacheDom = $('#edited-track-content');
			cacheDom.empty();

			const data = await localCache.get();
			const cacheSize = Object.keys(data).length;

			if (cacheSize === 0) {
				addNoEditedLabel(cacheDom);
			} else {
				for (const songId in data) {
					const { artist, track, album } = data[songId];

					const item = $(`<li>${artist} — ${track}</li>`);
					const removeBtn = $(
						`<button type="button" class="close close-btn">
							&times;
						</button>`);

					if (album) {
						item.attr('title', browser.i18n.getMessage('albumTooltip', album));
					}
					removeBtn.click(async function() {
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
			}

			const poputTitle = browser.i18n.getMessage(
				'optionsEditedTracksPopupTitle', cacheSize.toString());
			$('#edited-track-modal .modal-title').text(poputTitle);

			$('#clear-cache').click(() => {
				localCache.clear();
				modal.modal('hide');
			});

			modal.modal('show');
		});
	}

	function createNewConfigInput(value) {
		const containerEl = $('<div class="input-group"/>');
		const appendEl = $('<div class="input-group-append"/>');

		const inputEl = $('<input type="text" class="form-control">');
		inputEl.val(value);

		const closeEl = $(`
			<button class="btn btn-outline-secondary" type="button">
				&times;
			</button>
		`);
		closeEl.click(function(ev) {
			ev.preventDefault();
			$(this).parent().parent().remove();
		});

		appendEl.append(closeEl);
		containerEl.append(inputEl, appendEl);

		return containerEl;
	}

	return { initialize };
});
