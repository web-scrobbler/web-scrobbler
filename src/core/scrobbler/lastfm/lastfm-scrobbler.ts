'use strict';

import ClonedSong from '@/core/object/cloned-song';
import { ServiceCallResult } from '@/core/object/service-call-result';
import { BaseSong } from '@/core/object/song';
import AudioScrobbler, {
	AudioScrobblerParams,
} from '@/core/scrobbler/audio-scrobbler/audio-scrobbler';
import { ScrobblerSongInfo } from '@/core/scrobbler/base-scrobbler';
import { LastFmTrackInfo } from '@/core/scrobbler/lastfm/lastfm.types';
import { sendBackgroundMessage } from '@/util/communication';

/**
 * Module for all communication with Last.FM
 */
export default class LastFmScrobbler extends AudioScrobbler {
	/** @override */
	getApiUrl(): string {
		return 'https://ws.audioscrobbler.com/2.0/';
	}

	/** @override */
	getApiKey(): string {
		return 'd9bb1870d3269646f740544d9def2c95';
	}

	/** @override */
	getApiSecret(): string {
		return '2160733a567d4a1a69a73fad54c564b2';
	}

	/** @override */
	getBaseAuthUrl(): string {
		return 'https://www.last.fm/api/auth/';
	}

	/** @override */
	getBaseProfileUrl(): string {
		return 'https://last.fm/user/';
	}

	/** @override */
	getId(): string {
		return 'lastfm';
	}

	/** @override */
	getLabel(): 'Last.fm' {
		return 'Last.fm';
	}

	/** @override */
	getStatusUrl(): string {
		return 'http://status.last.fm/';
	}

	/** @override */
	getStorageName(): 'LastFM' {
		return 'LastFM';
	}

	/** @override */
	async getSongInfo(song: ClonedSong): Promise<ScrobblerSongInfo> {
		const params: AudioScrobblerParams = {
			track: song.getTrack(),
			artist: song.getArtist(),
			method: 'track.getinfo',
		};

		try {
			const { sessionName } = await this.getSession();
			params.username = sessionName;
		} catch (e) {
			// Do nothing
		}

		if (song.getAlbum()) {
			params.album = song.getAlbum();
		}

		const responseData = await this.sendRequest<LastFmTrackInfo>(
			{ method: 'GET' },
			params,
			false
		);

		const result = this.processResponse(responseData);
		if (result !== ServiceCallResult.RESULT_OK) {
			throw new Error('Unable to load song info');
		}

		const data = this.parseSongInfo(responseData);

		if (this.canLoveSong() && data) {
			sendBackgroundMessage(song.controllerTabId, {
				type: 'updateLove',
				payload: {
					isLoved: data.userloved || false,
				},
			});
		}

		return data;
	}

	/** @override */
	canLoadSongInfo(): boolean {
		return true;
	}

	/**
	 * Parse service response and return parsed data.
	 * @param responseData - Last.fm track.getInfo response data
	 * @returns Parsed song info
	 */
	public parseSongInfo(responseData: LastFmTrackInfo): ScrobblerSongInfo {
		const songInfo: Partial<ScrobblerSongInfo> = {};

		const trackInfo = responseData.track;
		const albumInfo = responseData.track.album;
		const artistInfo = responseData.track.artist;
		const userlovedStatus = trackInfo.userloved;

		if (userlovedStatus) {
			songInfo.userloved = userlovedStatus === '1';
		} else {
			songInfo.userloved = undefined;
		}

		songInfo.artist = artistInfo.name;
		songInfo.artistUrl = artistInfo.url;

		songInfo.track = trackInfo.name;
		songInfo.trackUrl = trackInfo.url;

		songInfo.duration = parseInt(trackInfo.duration) / 1000 || null;

		if (albumInfo) {
			songInfo.album = albumInfo.title;
			songInfo.albumUrl = albumInfo.url;
			songInfo.albumMbId = albumInfo.mbid;

			if (Array.isArray(albumInfo.image)) {
				/*
				 * Convert an array from response to an object.
				 * Format is the following: { size: "url", ... }.
				 */
				const images = albumInfo.image.reduce((result, image) => {
					result[image.size] = image['#text'];
					return result;
				}, {} as Record<string, string>);

				const imageSizes = ['extralarge', 'large', 'medium'];

				for (const imageSize of imageSizes) {
					const url = images[imageSize];
					if (url) {
						songInfo.trackArtUrl = url;
						break;
					}
				}
			}
		}

		songInfo.userPlayCount = parseInt(trackInfo.userplaycount) || 0;

		return songInfo as ScrobblerSongInfo;
	}

	/** @override */
	applyFilter(song: BaseSong): BaseSong {
		/**
		 * Last.fm rejects track if album artist contains more then just "Various Artists"
		 */
		if (song.getAlbumArtist()) {
			const albumArtist = song.getAlbumArtist() || '';

			song.parsed.albumArtist = albumArtist.includes('Various Artists')
				? 'Various Artists'
				: albumArtist;
		}

		return song;
	}
}
