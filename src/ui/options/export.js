'use strict';

define((require) => {
	const BrowserStorage = require('storage/browser-storage');

	const EXPORT_FILENAME = 'local-cache.json';

	const exportBtnId = 'export-edited';
	const importBtnId = 'import-edited';

	const localCache = BrowserStorage.getStorage(BrowserStorage.LOCAL_CACHE);

	async function initialize() {
		const exportButton = document.getElementById(exportBtnId);
		const importButton = document.getElementById(importBtnId);

		exportButton.addEventListener('click', (e) => {
			e.preventDefault();
			exportLocalCache();
		});

		importButton.addEventListener('click', (e) => {
			e.preventDefault();
			importLocalStorage();
		});
	}

	/**
	 * Export content of LocalCache storage to a file.
	 */
	async function exportLocalCache() {
		const data = await localCache.get();
		const dataStr = JSON.stringify(data, null, 2);
		const blob = new Blob([dataStr], { 'type': 'application/octet-stream' });
		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = EXPORT_FILENAME;
		a.dispatchEvent(new MouseEvent('click'));
		a.remove();

		URL.revokeObjectURL(url);
	}

	/**
	 * Import LocalCache storage from a file.
	 */
	function importLocalStorage() {
		const fileInput = document.createElement('input');

		fileInput.style.display = 'none';
		fileInput.type = 'file';
		fileInput.accept = '.json';
		fileInput.acceptCharset = 'utf-8';

		document.body.appendChild(fileInput);
		fileInput.initialValue = fileInput.value;
		fileInput.onchange = readFile;
		fileInput.click();

		function readFile() {
			if (fileInput.value !== fileInput.initialValue) {
				const file = fileInput.files[0];

				const reader = new FileReader();
				reader.onloadend = (event) => {
					const dataStr = event.target.result;
					const data = JSON.parse(dataStr);

					localCache.update(data).then(() => {
						fileInput.remove();
					});

				};
				reader.readAsText(file, 'utf-8');
			}
		}
	}

	return { initialize };
});
