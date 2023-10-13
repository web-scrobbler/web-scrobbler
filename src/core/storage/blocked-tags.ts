import * as BrowserStorage from '@/core/storage/browser-storage';
import { BaseSong } from '../object/song';
import { BlockedTagType, BlockedTagsReference } from './wrapper';

export default class BlockedTags {
	private storage = BrowserStorage.getStorage(BrowserStorage.BLOCKED_TAGS);
	private isReady: Promise<true>;

	constructor() {
		this.isReady = this.init();
	}

	/**
	 * Sets default values to blocklist if necessary
	 */
	private async setupDefaultBlocklist() {
		let data = await this.storage.getLocking();
		if (!data) {
			data = {};
		}
		await this.storage.setLocking(data);
	}

	/**
	 * Initializes the blocklist with default values
	 */
	private async init(): Promise<true> {
		await this.setupDefaultBlocklist();
		return true;
	}

	/**
	 * Adds a channel ID to blocklist
	 *
	 * @param type - type of tag to block
	 * @param song - song to add
	 */
	public async addToBlocklist(
		type: BlockedTagType,
		song: BaseSong,
	): Promise<void> {
		await this.isReady;
		const data = await this.storage.getLocking();
		const artist = song.getArtist();
		const track = song.getTrack();
		if (!data || !artist || !track) {
			this.storage.unlock();
			return;
		}
		if (!data[artist]) {
			data[artist] = {
				tracks: {},
				albums: {},
			};
		}
		switch (type) {
			case 'artist': {
				data[artist].disabled = true;
				break;
			}
			case 'album': {
				const album = song.getAlbum();
				const albumArtist = song.getAlbumArtist() || artist;
				if (!album) {
					this.storage.unlock();
					return;
				}
				if (!data[albumArtist]) {
					data[albumArtist] = {
						tracks: {},
						albums: {},
					};
				}
				data[albumArtist].albums[album] = true;
				break;
			}
			case 'track': {
				data[artist].tracks[track] = true;
				break;
			}
		}
		await this.storage.setLocking(data);
	}

	/**
	 * Removes a channel ID from blocklist
	 *
	 * @param tags - Tags to remove
	 */
	async removeFromBlocklist(tags: BlockedTagsReference): Promise<void> {
		const data = await this.storage.getLocking();
		if (!data) {
			this.storage.unlock();
			return;
		}
		switch (tags.type) {
			case 'artist': {
				delete data[tags.artist]?.disabled;
				break;
			}
			case 'album': {
				delete data[tags.artist]?.albums[tags.album];
				break;
			}
			case 'track': {
				delete data[tags.artist]?.tracks[tags.track];
				break;
			}
		}

		await this.storage.setLocking(data);
	}

	/**
	 * @param song - song to check
	 *
	 * @returns true if song isn't blocklisted; false if it is
	 */
	public async shouldScrobbleSong(song: BaseSong): Promise<boolean> {
		await this.isReady;
		const data = await this.storage.get();
		const artist = song.getArtist();
		if (!data || !artist || !data[artist]) {
			return true;
		}
		if (data[artist].disabled) {
			return false;
		}
		const track = song.getTrack();
		if (!track || !data[artist].tracks[track]) {
			return true;
		}
		if (data[artist].tracks[track]) {
			return false;
		}
		const albumArtist = song.getAlbumArtist() || artist;
		const album = song.getAlbum();
		if (!album) {
			return true;
		}
		return Boolean(data[albumArtist]?.albums[album]);
	}
}
