'use strict';

define(['storage/chromeStorage'], function(ChromeStorage) {
	const storage = ChromeStorage.getStorage(ChromeStorage.LOCAL_CACHE);
	const fieldsToSave = ['artist', 'track', 'album'];

	function loadData(song) {
		let songId = song.parsed.uniqueID;
		if (!songId) {
			return Promise.resolve();
		}

		return storage.get().then((data) => {
			if (data[songId]) {
				let isChanged = false;
				let savedMetadata = data[songId];

				for (let field of fieldsToSave) {
					if (savedMetadata[field]) {
						isChanged = true;
						song.processed.attr(field, savedMetadata[field]);
					}
				}

				if (isChanged) {
					song.flags.attr('isCorrectedByUser', true);
				}
			}
		});
	}

	function removeSongFromStorage(song) {
		let songId = song.parsed.uniqueID;
		if (!songId) {
			return Promise.resolve();
		}

		return storage.get().then((data) => {
			delete data[songId];
			return storage.set(data);
		});
	}

	return { loadData, removeSongFromStorage };
});
