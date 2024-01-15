'use strict';
import LastFmScrobbler from '@/core/scrobbler/lastfm/lastfm-scrobbler';
import LibreFmScrobbler from '@/core/scrobbler/librefm-scrobbler';
import ListenBrainzScrobbler from '@/core/scrobbler/listenbrainz/listenbrainz-scrobbler';
import MalojaScrobbler from '@/core/scrobbler/maloja/maloja-scrobbler';
import WebhookScrobbler from '@/core/scrobbler/webhook-scrobbler';
import PleromaScrobbler from '@/core/scrobbler/pleroma/pleroma-scrobbler';
import { ServiceCallResult } from '@/core/object/service-call-result';
import { BaseSong } from '@/core/object/song';
import { ScrobblerSongInfo } from '@/core/scrobbler/base-scrobbler';
import ClonedSong from './cloned-song';
import { debugLog } from '../content/util';

/**
 * Service to handle all scrobbling behavior.
 */

export type Scrobbler =
	| LastFmScrobbler
	| LibreFmScrobbler
	| ListenBrainzScrobbler
	| MalojaScrobbler
	| WebhookScrobbler
	| PleromaScrobbler;

/**
 * Scrobblers that are registered and that can be bound.
 */
const registeredScrobblers = [
	new LastFmScrobbler(),
	new LibreFmScrobbler(),
	new ListenBrainzScrobbler(),
	new MalojaScrobbler(),
	new WebhookScrobbler(),
	new PleromaScrobbler(),
];

export type ScrobblerLabel =
	| 'Last.fm'
	| 'ListenBrainz'
	| 'Libre.fm'
	| 'Maloja'
	| 'Webhook'
	| 'Pleroma';

/**
 * Check if scrobbler is in given array of scrobblers.
 * @param scrobbler - Scrobbler instance
 * @param array - Array of scrobblers
 * @returns True if scrobbler is in array, false otherwise
 */
function isScrobblerInArray(scrobbler: Scrobbler, array: Scrobbler[]) {
	return array.some((s) => {
		return s.getLabel() === scrobbler.getLabel();
	});
}

class ScrobbleService {
	/**
	 * Scrobblers that are bound, meaning they have valid session IDs.
	 */
	private boundScrobblers: Scrobbler[] = [];

	/**
	 * Bind all registered scrobblers.
	 * @returns Array of bound scrobblers
	 */
	async bindAllScrobblers(): Promise<Scrobbler[]> {
		for (const scrobbler of registeredScrobblers) {
			try {
				await scrobbler.getSession();
				this.bindScrobbler(scrobbler);
			} catch (e) {
				debugLog(`Unable to bind ${scrobbler.getLabel()}`, 'warn');
			}
		}

		return this.boundScrobblers;
	}

	/**
	 * Bind given scrobbler.
	 * @param scrobbler - Scrobbler instance
	 */
	bindScrobbler(scrobbler: Scrobbler): void {
		if (!isScrobblerInArray(scrobbler, this.boundScrobblers)) {
			this.boundScrobblers.push(scrobbler);
			debugLog(`Bind ${scrobbler.getLabel()} scrobbler`);
		}
	}

	/**
	 * Unbind given scrobbler.
	 * @param scrobbler - Scrobbler instance
	 */
	unbindScrobbler(scrobbler: Scrobbler): void {
		if (isScrobblerInArray(scrobbler, this.boundScrobblers)) {
			const index = this.boundScrobblers.indexOf(scrobbler);
			this.boundScrobblers.splice(index, 1);

			debugLog(`Unbind ${scrobbler.getLabel()} scrobbler`);
		} else {
			debugLog(`${scrobbler.getLabel()} is not bound`, 'error');
		}
	}

	/**
	 * Retrieve song info using scrobbler APIs.
	 * @param song - Song instance
	 * @returns Promise resolved with array of song info objects
	 */
	getSongInfo(
		song: ClonedSong,
	): Promise<(Record<string, never> | ScrobblerSongInfo | null)[]> {
		const scrobblers = registeredScrobblers.filter((scrobbler) => {
			return scrobbler.canLoadSongInfo();
		});

		debugLog(`Send "get info" request: ${scrobblers.length}`);

		return Promise.all(
			scrobblers.map(async (scrobbler) => {
				try {
					return await scrobbler.getSongInfo(song);
				} catch {
					debugLog(
						`Unable to get song info from ${scrobbler.getLabel()}`,
						'warn',
					);
					return null;
				}
			}),
		);
	}

	/**
	 * Send now playing notification to each bound scrobbler.
	 * @param song - Song instance
	 * @returns Promise that will be resolved then the task will complete
	 */
	sendNowPlaying(song: BaseSong): Promise<ServiceCallResult[]> {
		debugLog(`Send "now playing" request: ${this.boundScrobblers.length}`);

		return Promise.all(
			this.boundScrobblers.map(async (scrobbler) => {
				// Forward result (including errors) to caller
				try {
					return await scrobbler.sendNowPlaying(
						scrobbler.applyFilter(song),
					);
				} catch (result) {
					return this.processErrorResult(
						scrobbler,
						result as ServiceCallResult,
					);
				}
			}),
		);
	}

	/**
	 * Send now playing notification to each bound scrobbler.
	 * @param song - Song instance
	 * @returns Promise that will be resolved then the task will complete
	 */
	sendPaused(song: BaseSong): Promise<ServiceCallResult[]> {
		const supportedBoundScrobblers = this.boundScrobblers.filter(
			(scrobbler) => typeof scrobbler.sendPaused === 'function',
		);
		if (supportedBoundScrobblers.length === 0) {
			return Promise.resolve([ServiceCallResult.RESULT_OK]);
		}
		debugLog(`Send "paused" request: ${supportedBoundScrobblers.length}`);

		return Promise.all(
			supportedBoundScrobblers.map(async (scrobbler) => {
				// Forward result (including errors) to caller
				try {
					return await scrobbler.sendPaused(
						scrobbler.applyFilter(song),
					);
				} catch (result) {
					return this.processErrorResult(
						scrobbler,
						result as ServiceCallResult,
					);
				}
			}),
		);
	}

	/**
	 * Send now playing notification to each bound scrobbler.
	 * @param song - Song instance
	 * @returns Promise that will be resolved then the task will complete
	 */
	sendResumedPlaying(song: BaseSong): Promise<ServiceCallResult[]> {
		const supportedBoundScrobblers = this.boundScrobblers.filter(
			(scrobbler) => typeof scrobbler.sendResumedPlaying === 'function',
		);
		if (supportedBoundScrobblers.length === 0) {
			return Promise.resolve([ServiceCallResult.RESULT_OK]);
		}
		debugLog(`Send "paused" request: ${supportedBoundScrobblers.length}`);

		return Promise.all(
			supportedBoundScrobblers.map(async (scrobbler) => {
				// Forward result (including errors) to caller
				try {
					return await scrobbler.sendResumedPlaying(
						scrobbler.applyFilter(song),
					);
				} catch (result) {
					return this.processErrorResult(
						scrobbler,
						result as ServiceCallResult,
					);
				}
			}),
		);
	}

	/**
	 * Scrobble song to each bound scrobbler.
	 * @param song - Song instance
	 * @returns Promise that will be resolved then the task will complete
	 */
	scrobble(song: BaseSong): Promise<ServiceCallResult[]> {
		debugLog(`Send "scrobble" request: ${this.boundScrobblers.length}`);

		return Promise.all(
			this.boundScrobblers.map(async (scrobbler) => {
				// Forward result (including errors) to caller
				try {
					return await scrobbler.scrobble(
						scrobbler.applyFilter(song),
					);
				} catch (result) {
					return this.processErrorResult(
						scrobbler,
						result as ServiceCallResult,
					);
				}
			}),
		);
	}

	/**
	 * Toggle song love status.
	 * @param song - Song instance
	 * @param flag - Flag indicates song is loved
	 * @returns Promise that will be resolved then the task will complete
	 */
	async toggleLove(
		song: ClonedSong,
		flag: boolean,
	): Promise<(ServiceCallResult | Record<string, never>)[]> {
		const scrobblers = registeredScrobblers.filter((scrobbler) => {
			return scrobbler.canLoveSong();
		});
		const requestName = flag ? 'love' : 'unlove';
		debugLog(`Send "${requestName}" request: ${scrobblers.length}`);

		return Promise.all(
			scrobblers.map(async (scrobbler) => {
				// Forward result (including errors) to caller
				try {
					return await scrobbler.toggleLove(song, flag);
				} catch (result) {
					return this.processErrorResult(
						scrobbler,
						result as ServiceCallResult,
					);
				}
			}),
		);
	}

	/**
	 * Get all registered scrobblers.
	 * @returns Array of bound scrobblers
	 */
	getRegisteredScrobblers(): Scrobbler[] {
		return registeredScrobblers;
	}

	/**
	 * Get scrobbler by label.
	 * @param label - Scrobbler label
	 * @returns Found scrobbler object
	 */
	getScrobblerByLabel(label: ScrobblerLabel): Scrobbler | null {
		for (const scrobbler of registeredScrobblers) {
			if (scrobbler.getLabel() === label) {
				return scrobbler;
			}
		}

		return null;
	}

	/**
	 * Process result received from scrobbler.
	 * @param scrobbler - Scrobbler instance
	 * @param result - API call result
	 * @returns Promise resolved with result object
	 */
	async processErrorResult(
		scrobbler: Scrobbler,
		result: ServiceCallResult,
	): Promise<ServiceCallResult> {
		const isOtherError = result === ServiceCallResult.ERROR_OTHER;
		const isAuthError = result === ServiceCallResult.ERROR_AUTH;

		if (!(isOtherError || isAuthError)) {
			throw new Error(`Invalid result: ${result}`);
		}

		if (isAuthError) {
			// Don't unbind scrobblers which have tokens
			const isReady = await scrobbler.isReadyForGrantAccess();
			if (!isReady) {
				this.unbindScrobbler(scrobbler);
			}
		}

		// Forward result
		return result;
	}
}

export default new ScrobbleService();
