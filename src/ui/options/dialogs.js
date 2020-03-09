'use strict';

define((require) => {
	const browser = require('webextension-polyfill');
	const CustomPatterns = require('storage/custom-patterns');
	const SavedEdits = require('storage/saved-edits');

	const { getSortedConnectors } = require('util/util-connector');
	const sortedConnectors = getSortedConnectors();

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

			const inputs = $('<ul class="list-unstyled patterns-list" id="conn-conf-list"></ul>');
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

			const modal = $('#edited-track-modal');

			initEditedTracks();
			initEditedArtistAlbums();

			// const cacheSize = Object.keys(data).length;

			// const poputTitle = browser.i18n.getMessage(
			// 	'optionsEditedTracksPopupTitle', cacheSize.toString());
			// $('#edited-track-modal .modal-title').text(poputTitle);

			// $('#clear-cache').click(() => {
			// 	// localCache.clear();
			// 	modal.modal('hide');
			// });

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

	async function initEditedTracks() {
		const cacheDom = $('#edited-track-content');
		cacheDom.empty();

		const storageData = await SavedEdits.getSongInfoStorage();
		const editedSongsCount = Object.keys(storageData).length;

		if (editedSongsCount === 0) {
			addNoEditedLabel(cacheDom);
		} else {
			for (const songId in storageData) {
				const { artist, track, album } = storageData[songId];

				const item = $(`<li>${artist} — ${track}</li>`);
				const removeBtn = makeRemoveBtn(async(node) => {
					await SavedEdits.removeSongInfoById(songId);
					$(node).remove();

					// if (Object.keys(data).length === 0) {
					// 	addNoEditedLabel(cacheDom);
					// }
				});

				if (album) {
					item.attr('title', browser.i18n.getMessage('albumTooltip', album));
				}

				item.append(removeBtn);
				cacheDom.append(item);
			}
		}
	}

	async function initEditedArtistAlbums() {
		const cacheDom = $('#edited-artists-content');
		cacheDom.empty();

		const storageData = await SavedEdits.getArtistAlbumStorage();
		const editedArtistsCount = Object.keys(storageData).length;

		if (editedArtistsCount === 0) {
			addNoEditedLabel(cacheDom);
		} else {
			for (const entry in storageData) {
				const { name, albums } = storageData[entry];

				const artistItem = $(`<li>${name}</li>`);
				const albumList = $('<ul/>');

				const removeBtn = makeRemoveBtn((node) => {
					console.log(node);
				});

				for (const entry in albums) {
					const album = albums[entry];
					const albumItem = $(`<li>${album}</li>`);
					albumList.append(albumItem);
				}

				artistItem.append(removeBtn);
				artistItem.append(albumList);

				cacheDom.append(artistItem);
			}
		}
	}

	function addNoEditedLabel(node) {
		node.append($('<li>').attr('i18n', 'noItemsInCache'));
	}

	function makeRemoveBtn(onClick) {
		return $(
			'<button type="button" class="close close-btn">&times;</button>'
		).click(function() {
			onClick(this.parentNode);
		});
	}

	return { initialize };
});
