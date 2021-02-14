import Logger from 'js-logger';

import { Song } from '@/background/model/song/Song';
import { isStateEmpty } from '@/background/util/util';

import type { ConnectorState } from '@/background/model/ConnectorState';

/**
 * Helper that processes the connector state and updates/creates the song
 * based on last state received.
 */
export class ConnectorStateWorker {
	private currentState: ConnectorState = null;
	private currentSong: Song = null;

	private logger = Logger.get('ConnectorStateWorker');

	constructor(private listener: SongUpdateListener2) {}

	/**
	 * Get current song created/or updated with last connector state received.
	 *
	 * @return Song
	 */
	getSong(): Song {
		return this.currentSong;
	}

	/**
	 * Process the given connector state. Depending on the state value
	 * a new song will be created, or the existing song will be updated.
	 *
	 * @param newState Connector state
	 */
	process(newState: ConnectorState): void {
		if (isStateEmpty(newState)) {
			this.processEmptyState(newState);
		} else if (this.isSongChanged(newState)) {
			this.processNewState(newState);
		} else {
			this.processCurrentState(newState);
		}

		this.currentState = newState;
	}

	private processEmptyState(state: ConnectorState): void {
		this.setSong(null);

		/* @ifdef DEVELOPMENT */
		/* istanbul ignore next */
		if (state.isPlaying) {
			const stateStr = JSON.stringify(state, null, 2);
			this.logger.warn(`${devWarning}: ${stateStr}`);
		}
		/* @endif */
	}

	private processNewState(newState: ConnectorState): void {
		if (newState.isPlaying) {
			this.setSong(new Song(newState));
		} else {
			this.setSong(null);
		}
	}

	private processCurrentState(newState: ConnectorState): void {
		const { currentTime, isPlaying, trackArt, duration } = newState;

		this.currentSong.setCurrentTime(currentTime);
		this.currentSong.setTrackArt(trackArt);

		const isDurationChanged =
			duration && this.currentSong.getDuration() !== duration;
		if (isDurationChanged) {
			this.currentSong.setDuration(duration);

			this.listener.onSongDurationChanged(duration);
		}

		const isPlayingStateChanged =
			this.currentSong.isPlaying() !== isPlaying;
		if (isPlayingStateChanged) {
			this.currentSong.setPlaying(isPlaying);

			this.listener.onPlayingStateChanged(isPlaying);
		}
	}

	private setSong(song: Song): void {
		this.currentSong = song;

		this.listener.onSongChanged(song);
	}

	private isSongChanged(newState: ConnectorState): boolean {
		if (!this.currentSong) {
			return true;
		}

		for (const field of fieldsToCheckSongChange) {
			if (newState[field] !== this.currentState[field]) {
				return true;
			}
		}

		return false;
	}
}

/**
 * List of `ConnectorState` fields used to check if song is changed. If any of
 * these fields is changed, it means the new song is playing.
 */
const fieldsToCheckSongChange = [
	'artist',
	'track',
	'album',
	'uniqueID',
] as const;

const devWarning =
	"Connector state doesn't contain enough information about the track";

export interface SongUpdateListener2 {
	/**
	 * Called when song duration is updated.
	 *
	 * @param duration New song duration
	 */
	onSongDurationChanged(duration: number): void;

	/**
	 * Called when the playing state is changed.
	 *
	 * @param isPlaying New playing state
	 */
	onPlayingStateChanged(isPlaying: boolean): void;

	/**
	 * Called when the song is changed. If state contains no information,
	 * the `song` parameter will be `null`.
	 *
	 * @param song Song
	 */
	onSongChanged(song: Song): void;
}
