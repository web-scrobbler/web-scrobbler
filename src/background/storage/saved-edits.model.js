import MD5 from 'blueimp-md5';

import Song from '@/background/object/song';
import CustomStorage from '@/background/storage/custom-storage';

/**
 * A model to load/save song info to a storage.
 */
export default class SavedEditsModel extends CustomStorage {
	/**
	 * Public functions.
	 */

	/**
	 * Apply edited song info to a given song object.
	 *
	 * @param {Object} song Song instance
	 *
	 * @return {Boolean} True if data is loaded; false otherwise
	 */
	async loadSongInfo(song) {
		let songId = SavedEditsModel.getSongId(song);
		const storageData = await this.getData();

		if (!(songId in storageData)) {
			songId = SavedEditsModel.makeSongId(song, [
				'artist',
				'track',
				'album',
			]);
		}

		if (!(songId in storageData)) {
			songId = SavedEditsModel.makeSongId(song, ['artist', 'track']);
		}

		if (songId in storageData) {
			const loadedInfo = storageData[songId];
			SavedEditsModel.applyLoadedInfo(song, loadedInfo);

			return true;
		}

		return false;
	}

	/**
	 * Save custom song info to the storage.
	 *
	 * @param {Object} song Song instance
	 * @param {Object} dataToSave User data
	 */
	async saveSongInfo(song, dataToSave) {
		const songId = SavedEditsModel.getSongId(song);
		const storageData = await this.getData();

		if (!storageData[songId]) {
			storageData[songId] = {};
		}

		for (const field in dataToSave) {
			storageData[songId][field] = dataToSave[field];
		}

		await this.saveData(storageData);
	}

	/**
	 * Remove song info from the storage.
	 *
	 * @param {Object} song Song object
	 */
	async removeSongInfo(song) {
		const songId = SavedEditsModel.getSongId(song);
		const storageData = await this.getData();

		delete storageData[songId];
		await this.saveData(storageData);
	}

	/**
	 * Static functions.
	 */

	/**
	 * Apply loaded info to a given song.
	 *
	 * @param {Object} song Song instance
	 * @param {Object} loadedInfo Object containing loaded song info
	 */
	static applyLoadedInfo(song, loadedInfo) {
		for (const field in loadedInfo) {
			song.processed[field] = loadedInfo[field];
		}
	}

	/**
	 * Get a song ID. If a song internal unique ID is missing,
	 * generate a new unique ID.
	 *
	 * @param {Object} song Song instance
	 *
	 * @return {String} Song unique ID
	 */
	static getSongId(song) {
		const uniqueId = song.getUniqueId();
		if (uniqueId) {
			return uniqueId;
		}

		return SavedEditsModel.makeSongId(song, Song.BASE_FIELDS);
	}

	/**
	 * Create an unique ID for a song based on song properties.
	 *
	 * @param {Object} song Song instance
	 * @param {Array} properties Array of properties
	 *
	 * @return {String} Generated unique ID
	 */
	static makeSongId(song, properties) {
		let inputStr = '';

		for (const field of properties) {
			if (song.parsed[field]) {
				inputStr += song.parsed[field];
			}
		}
		if (inputStr) {
			return MD5(inputStr);
		}

		throw new Error('Empty song');
	}
}
