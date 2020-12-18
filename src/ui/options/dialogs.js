'use strict';

define((require) => {
	const browser = require('webextension-polyfill');
	const SavedEdits = require('storage/saved-edits');
	const CustomPatterns = require('storage/custom-patterns');

	const { getSortedConnectors } = require('util/util-connector');

	const sortedConnectors = getSortedConnectors();

	function initialize() {
		initAddPatternDialog();
		initViewEditedDialog();
	}

	function initAddPatternDialog() {
		$('body').on('click', 'a.conn-config', async (e) => {
			e.preventDefault();

			const modal = $('#conn-conf-modal');
			const index = $(e.currentTarget).data('conn');
			const connector = sortedConnectors[index];

			modal.data('conn', index);
			modal.find('.modal-title').text(connector.label);

			const allPatterns = await CustomPatterns.getAllPatterns();
			const patterns = allPatterns[connector.id] || [];

			const inputsContainer = $('#conn-conf-list');
			inputsContainer.empty();
			for (const value of patterns) {
				inputsContainer.append(createNewConfigInput(value));
			}

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
		$('#view-edited').click(async (e) => {
			e.preventDefault();

			function addNoEditedLabel(node) {
				node.append($('<li>').attr('i18n', 'noItemsInCache'));
			}

			const modal = $('#edited-track-modal');
			const cacheDom = $('#edited-track-content');
			cacheDom.empty();

			const data = await SavedEdits.getSongInfoStorage();
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
						await SavedEdits.removeSongInfoById(songId);

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
				modal.modal('hide');
				SavedEdits.clear();
			});

			modal.modal('show');
		});
	}

	function createNewConfigInput(value) {
		const containerEl = $('<li class="input-group"/>');
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
