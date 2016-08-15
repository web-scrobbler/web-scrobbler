'use strict';

define(['chromeStorage'], function(ChromeStorage) {
	const storage = ChromeStorage.getNamespace('LocalCache');
	const fieldMap = {
		'artist': 'userArtist',
		'track': 'userTrack'
	};

	function saveSongMetadataToStorage(song, cb) {
		let songId = song.parsed.uniqueID;
		if (!songId) {
			cb();
			return;
		}

		storage.get(chromeData => {
			let isChanged = false;

			if (!chromeData[songId]) {
				chromeData[songId] = {};
			}

			for (let field in fieldMap) {
				let userField = fieldMap[field];
				if (song.metadata.attr(userField)) {
					chromeData[songId][field] = song.metadata.attr(userField);
					isChanged = true;
				}
			}

			if (isChanged) {
				storage.set(chromeData);
			}

			cb();
		});
	}

	function fillSongData(song, cb) {
		let isChanged = false;

		// currently just transforms user data from metadata to processed data,
		// which makes it source data for next pipeline steps
		for (let field in fieldMap) {
			let userField = fieldMap[field];
			if (song.metadata.attr(userField)) {
				song.processed.attr(field, song.metadata.attr(userField));
				isChanged = true;
			}
		}

		if (isChanged) {
			song.flags.attr('isCorrectedByUser', true);
			saveSongMetadataToStorage(song, cb);
		} else {
			cb();
		}
	}

	return {
		loadData: fillSongData
	};
});
