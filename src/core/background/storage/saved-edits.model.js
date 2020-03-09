'use strict';

/**
 * A model to load/save song info to a storage.
 */

class SavedEditsModel {
	/**
	 * Public functions.
	 */

	/**
	 * Apply edited song info to a given song object.
	 * @param  {Object} song Song instance
	 * @return {Boolean} True if data is loaded; false otherwise
	 */
	async loadSongInfo(song) {
		const songId = song.getUniqueId();
		const storageData = await this.getSongInfoStorage();

		// let isLoaded = false;
		if (songId in storageData) {
			const loadedInfo = storageData[songId];
			this.applyLoadedInfo(song, loadedInfo);

			return true;

			// TODO Remove
			// const itemCount = Object.keys(loadedInfo).length;
			// if (itemCount > 1) {
			// 	return true;
			// }

			// isLoaded = true;
		}

		return this.loadSongArtistAlbum(song) /* || isLoaded */;
	}

	/**
	 * Save custom song info to the storage.
	 * @param  {Object} song Song instance
	 * @param  {Object} dataToSave User data
	 */
	async saveSongInfo(song, dataToSave) {
		const songId = song.getUniqueId();
		const storageData = await this.getSongInfoStorage();

		if (dataToSave.track !== song.getTrack()) {
			if (!storageData[songId]) {
				storageData[songId] = {};
			}

			for (const field in dataToSave) {
				storageData[songId][field] = dataToSave[field];
			}
		}
		// if (dataToSave.track) {
		// 	storageData[songId] = { track: dataToSave.track };
		// } else {
		// 	// TODO Remove
		// 	delete storageData[songId];
		// }

		await this.saveArtistAlbum(song, dataToSave);
		await this.saveSongInfoToStorage(storageData);
	}

	/**
	 * Remove song info from the storage.
	 * @param  {Object} song Song object
	 */
	async removeSongInfo(song) {
		const songId = song.getUniqueId();
		await this.removeSongInfoById(songId);
	}

	/**
	 * Remove song info from the storage.
	 * @param  {Object} songId Song ID
	 */
	async removeSongInfoById(songId) {
		const storageData = await this.getSongInfoStorage();

		delete storageData[songId];
		await this.saveSongInfoToStorage(storageData);
	}

	/**
	 * Functions must be implemented (overriden).
	 */

	/**
	 * Return data of the song info storage.
	 *
	 * @return {Object} Storage data
	 */
	async getSongInfoStorage() {
		throw new Error('This function should be overriden!');
	}

	/**
	 * Return data of the arists and albums info storage.
	 *
	 * @return {Object} Storage data
	 */
	async getArtistAlbumStorage() {
		throw new Error('This function should be overriden!');
	}

	/**
	 * Save data to the song info storage.
	 *
	 * @return {Object} Storage data
	 */
	async saveSongInfoToStorage(/* data */) {
		throw new Error('This function should be overriden!');
	}

	/**
	 * Save data to the arists and albums info storage.
	 *
	 * @return {Object} Storage data
	 */
	async saveArtistAlbumToStorage(/* data */) {
		throw new Error('This function should be overriden!');
	}

	/**
	 * Private functions.
	 */

	async loadSongArtistAlbum(song) {
		const storageData = await this.getArtistAlbumStorage();
		const artist = song.parsed.artist;

		if (!(artist in storageData)) {
			return false;
		}

		const album = song.parsed.album;
		const { name, albums } = storageData[artist];
		const loadedInfo = { artist: name };

		if (albums && album in albums) {
			loadedInfo.album = albums[album];
		}

		this.applyLoadedInfo(song, loadedInfo);
		return true;
	}

	async saveArtistAlbum(song, dataToSave) {
		const storageData = await this.getArtistAlbumStorage();
		const artist = song.parsed.artist;
		const album = song.parsed.album;

		if (!(artist in storageData)) {
			storageData[artist] = { /* Empty */ };
		}

		if (dataToSave.artist !== song.getArtist()) {
			storageData[artist].name = dataToSave.artist;
		}
		if (dataToSave.album && dataToSave.album !== song.getAlbum()) {
			if (!storageData[artist].albums) {
				storageData[artist].albums = {};
			}

			storageData[artist].albums[album] = dataToSave.album;
		}

		await this.saveArtistAlbumToStorage(storageData);
	}

	applyLoadedInfo(song, loadedInfo) {
		for (const field in loadedInfo) {
			song.processed[field] = loadedInfo[field];
		}
	}
}

define(() => SavedEditsModel);
