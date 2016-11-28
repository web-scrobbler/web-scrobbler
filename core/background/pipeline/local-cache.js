'use strict';

define(['chromeStorage'], function(ChromeStorage) {
	const storage = ChromeStorage.getNamespace('LocalCache');
	const fieldsToSave = ['artist', 'track', 'album'];

	function loadData(song) {
		return new Promise((resolve) => {
			if (!song.parsed.uniqueID) {
				resolve();
				return;
			}

			storage.get((chromeData) => {
				let songId = song.parsed.uniqueID;

				if (chromeData[songId]) {
					let isChanged = false;
					let savedMetadata = chromeData[songId];

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

				resolve();
			});
		});


	}

	function removeSongFromStorage(song, cb) {
		let songId = song.parsed.uniqueID;
		if (!songId) {
			return cb();
		}

		storage.get((data) => {
			delete data[songId];
			storage.set(data, cb);
		});
	}

	return { loadData, removeSongFromStorage };
});
