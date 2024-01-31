import * as BrowserStorage from '@/core/storage/browser-storage';
import { BaseSong } from '../object/song';
import { BlockedTagType } from './wrapper';

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
	 * Adds a set of tags to blocklist
	 *
	 * @param type - type of tag to block
	 * @param song - song to add
	 */
	public async addToBlocklist(
		type: BlockedTagType,
		song: BaseSong | undefined,
	): Promise<void> {
		if (!song) {
			return;
		}
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
	 * Removes a set of tags from blocklist
	 *
	 * @param tags - Tags to remove
	 */
	async removeFromBlocklist(
		type: BlockedTagType,
		song: BaseSong | undefined,
	): Promise<void> {
		if (!song) {
			return;
		}
		const artist = song.getArtist();
		const track = song.getTrack();
		if (!artist || !track) {
			return;
		}
		const data = await this.storage.getLocking();
		if (!data) {
			this.storage.unlock();
			return;
		}
		switch (type) {
			case 'artist': {
				delete data[artist]?.disabled;
				break;
			}
			case 'album': {
				const albumArtist = song.getAlbumArtist() || artist;
				const album = song.getAlbum();
				if (!album) {
					return;
				}
				delete data[albumArtist]?.albums[album];
				break;
			}
			case 'track': {
				delete data[artist]?.tracks[track];
				break;
			}
		}

		await this.storage.setLocking(data);
	}

	/**
	 * @param song - song to check
	 * @returns object of booleans saying whether each tag type is blocked for the song.
	 */
	public async getBlockedTypes(song: BaseSong | undefined): Promise<{
		artist: boolean;
		album: boolean;
		track: boolean;
	}> {
		const result = {
			artist: false,
			album: false,
			track: false,
		};
		if (!song) {
			return result;
		}

		await this.isReady;
		const data = await this.storage.get();
		const artist = song.getArtist();
		const track = song.getTrack();

		if (!data || !artist || !data[artist] || !track) {
			return result;
		}
		if (data[artist].disabled) {
			result.artist = true;
		}
		if (data[artist].tracks[track]) {
			result.track = true;
		}
		const albumArtist = song.getAlbumArtist() || artist;
		const album = song.getAlbum();
		if (!album || !data[albumArtist]?.albums[album]) {
			return result;
		}
		result.album = true;
		return result;
	}

	/**
	 * @param song - song to check
	 *
	 * @returns true if song is blocklisted; false if it isn't
	 */
	public async hasBlockedTag(song: BaseSong): Promise<boolean> {
		const res = await this.getBlockedTypes(song);
		return res.artist || res.album || res.track;
	}
}
