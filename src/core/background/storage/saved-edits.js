'use strict';

define((require) => {
	const BrowserStorage = require('storage/browser-storage');
	const SavedEditsModel = require('storage/saved-edits.model');

	class SavedEditsImpl extends SavedEditsModel {
		constructor() {
			super();

			this.songInfoStorage = BrowserStorage.getStorage(BrowserStorage.LOCAL_CACHE);
			this.artistAlbumStorage = BrowserStorage.getStorage(BrowserStorage.EDITED_ARTIST_ALBUMS);

			this.songInfoStorage.debugLog();
			this.artistAlbumStorage.debugLog();

			// this.artistAlbumStorage.clear();
		}

		/** @override */
		async getSongInfoStorage() {
			return await this.songInfoStorage.get();
		}

		/** @override */
		async getArtistAlbumStorage() {
			return await this.artistAlbumStorage.get();
		}

		/** @override */
		async saveSongInfoToStorage(data) {
			return await this.songInfoStorage.set(data);
		}

		/** @override */
		async saveArtistAlbumToStorage(data) {
			return await this.artistAlbumStorage.set(data);
		}
	}

	return new SavedEditsImpl();
});
