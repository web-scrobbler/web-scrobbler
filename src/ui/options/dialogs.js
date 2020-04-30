'use strict';

define((require) => {
	const browser = require('webextension-polyfill');
	const SavedEdits = require('storage/saved-edits');
	const CustomPatterns = require('storage/custom-patterns');

	const { getSortedConnectors } = require('util/util-connector');

	const sortedConnectors = getSortedConnectors();

	const patternsModalOkBtnId = 'conn-conf-ok';
	const patternsModalAddBtnId = 'add-pattern';
	const patternsModalResetBtnId = 'conn-conf-reset';

	const patternsListId = 'conn-conf-list';
	const patternsModalId = 'conn-conf-modal';
	const patternsModalTitleId = 'url-patterns-title';

	const editedModalId = 'edited-track-modal';
	const editedModalListId = 'edited-track-content';
	const editedModalClearBtnId = 'clear-cache';

	function initialize() {
		initAddPatternDialog();
		initViewEditedDialog();
	}

	function initAddPatternDialog() {
		// const modalDialog = document.getElementById(patternsModalId);
		$('#conn-conf-modal').on('show.bs.modal', (event) => {
			const button = event.relatedTarget;
			const connectorIndex = button.getAttribute('data-conn');

			initPatternsList(connectorIndex);
		});

		const okButton = document.getElementById(patternsModalOkBtnId);
		okButton.addEventListener('click', savePatterns);

		const addButton = document.getElementById(patternsModalAddBtnId);
		addButton.addEventListener('click', addNewPatternInput);

		const resetButton = document.getElementById(patternsModalResetBtnId);
		resetButton.addEventListener('click', resetPatterns);
	}

	function initViewEditedDialog() {
		// const modalDialog = document.getElementById(patternsModalId);
		$('#edited-track-modal').on('show.bs.modal', () => {
			fillViewEditedDialog();
		});

		const clearButton = document.getElementById(editedModalClearBtnId);
		clearButton.addEventListener('click', () => {
			clearLocalCache();
		});
	}

	async function initPatternsList(index) {
		const connector = sortedConnectors[index];

		const modalDialog = document.getElementById(patternsModalId);
		modalDialog.setAttribute('data-conn', index);

		const modalTitle = document.getElementById(patternsModalTitleId);
		modalTitle.textContent = connector.label;

		const allPatterns = await CustomPatterns.getAllPatterns();
		const patterns = allPatterns[connector.id] || [];

		const patternsList = document.getElementById(patternsListId);
		patternsList.innerHTML = '';

		for (const value of patterns) {
			patternsList.append(createNewInputContainer(value));
		}
	}

	async function fillViewEditedDialog() {
		// const modal = document.getElementById(editedModalId);
		const cacheDom = document.getElementById(editedModalListId);
		cacheDom.innerHTML = '';

		const data = await SavedEdits.getSongInfoStorage();
		const cacheSize = Object.keys(data).length;

		if (cacheSize === 0) {
			cacheDom.appendChild(createNoEditedLabel());
		} else {
			for (const songId in data) {
				const { artist, track, album } = data[songId];
				const liItem = createTrackItem(artist, track, album);

				const removeButton = liItem.getElementsByTagName('button')[0];
				removeButton.addEventListener('click', async () => {
					await SavedEdits.removeSongInfoById(songId);

					const cacheSize = Object.keys(data).length;

					if (cacheSize === 0) {
						cacheDom.appendChild(createNoEditedLabel());
					}
					updateViewEditedDialogTitle(cacheSize);
				});

				cacheDom.appendChild(liItem);
			}
		}

		updateViewEditedDialogTitle(cacheSize);
	}

	async function updateViewEditedDialogTitle(cacheSize) {
		const title = browser.i18n.getMessage(
			'optionsEditedTracksPopupTitle', cacheSize.toString());

		const modal = document.getElementById(editedModalId);
		modal.querySelector('.modal-title').textContent = title;
	}

	function savePatterns() {
		const modalDialog = document.getElementById(patternsModalId);
		const patternsList = document.getElementById(patternsListId);
		const connector = getConnectorAttachedTo(modalDialog);

		const patterns = [];

		const inputs = patternsList.getElementsByTagName('input');
		for (const input of inputs) {
			const pattern = input.value;
			if (pattern.length > 0) {
				patterns.push(pattern);
			}
		}

		if (patterns.length > 0) {
			CustomPatterns.setPatterns(connector.id, patterns);
		} else {
			CustomPatterns.resetPatterns(connector.id);
		}
	}

	function addNewPatternInput() {
		const patternsList = document.getElementById(patternsListId);
		const inputContainer = createNewInputContainer();

		patternsList.appendChild(inputContainer);
		inputContainer.getElementsByTagName('input')[0].focus();
	}

	function resetPatterns() {
		const modalDialog = document.getElementById(patternsModalId);
		const connector = getConnectorAttachedTo(modalDialog);

		CustomPatterns.resetPatterns(connector.id);
	}

	function createNewInputContainer(value) {
		const container = document.createElement('li');

		const input = document.createElement('input');
		input.setAttribute('type', 'text');
		input.classList.add('form-control');
		input.value = value || '';

		const closeButton = createCloseButton(container);
		closeButton.classList.add('btn', 'btn-outline-secondary');

		const inputAppend = document.createElement('div');
		inputAppend.classList.add('input-group-append');
		inputAppend.appendChild(closeButton);

		container.classList.add('input-group');
		container.appendChild(input);
		container.appendChild(inputAppend);

		return container;
	}

	function createTrackItem(artist, track, album) {
		const liItem = document.createElement('li');
		liItem.textContent = `${artist} — ${track}`;

		const removeBtn = createCloseButton(liItem);
		removeBtn.classList.add('close', 'close-btn');

		if (album) {
			const title = browser.i18n.getMessage('albumTooltip', album);
			liItem.setAttribute('title', title);
		}

		liItem.appendChild(removeBtn);
		return liItem;
	}

	function createCloseButton(parent) {
		const closeButton = document.createElement('button');
		closeButton.setAttribute('type', 'button');
		closeButton.innerHTML = '&times;';
		closeButton.addEventListener('click', () => {
			parent.remove();
		});

		return closeButton;
	}

	function createNoEditedLabel() {
		const label = document.createElement('li');
		label.setAttribute('i18n', 'noItemsInCache');

		return label;
	}

	function getConnectorAttachedTo(modalDialog) {
		const index = modalDialog.getAttribute('data-conn');
		return sortedConnectors[index];
	}

	function clearLocalCache() {
		SavedEdits.clear();
	}

	return { initialize };
});
