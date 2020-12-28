import {
	createFilter,
	createFilterSetForFields,
	MetadataFilter,
	replaceNbsp,
} from 'metadata-filter';

import {
	ConnectorProp,
	ConnectorPropValue,
	ConnectorState,
} from '@/background/model/ConnectorState';
import { Stateful } from '@/content/connector/Stateful';
import { StateProcessor } from '@/content/processor/StateProcessor';
import { getObjectKeys } from '#/helpers/util';

const defaultFilter = createFilter(
	createFilterSetForFields(
		['artist', 'track', 'album', 'albumArtist'],
		[(text) => text.trim(), replaceNbsp]
	)
);

/**
 * Default values of state properties.
 * @type {Object}
 */
const defaultState: ConnectorState = {
	/* Required fields */

	/**
	 * Track name.
	 * @type {String}
	 */
	track: null,

	/**
	 * Artist name.
	 * @type {String}
	 */
	artist: null,

	/* Optional fields */

	/**
	 * Album name.
	 * @type {String}
	 */
	album: null,

	/**
	 * Album artist.
	 *
	 * @type {String}
	 */
	albumArtist: null,

	/**
	 * Track unique ID.
	 * @type {String}
	 */
	uniqueID: null,

	/**
	 * Track duration.
	 * @type {Number}
	 */
	duration: null,

	/**
	 * Current time.
	 * @type {Number}
	 */
	currentTime: null,

	/**
	 * Playing/pause state.
	 * @type {Boolean}
	 */
	isPlaying: true,

	/**
	 * URL to track art image.
	 * @type {String}
	 */
	trackArt: null,

	/**
	 * Whether the current track is a podcast episode.
	 * @type {String}
	 */
	isPodcast: false,

	/**
	 * Origin URL.
	 * @type {String}
	 */
	originUrl: null,
};

/* @ifdef DEVELOPMENT */
/**
 * List of song fields used to check if song is changed. If any of
 * these fields are changed, the new song is playing.
 */
const fieldsToCheckSongChange = [
	'artist',
	'track',
	'album',
	'albumArtist',
	'uniqueID',
];
/* @endif */

export class ConnectorStateProcessor implements StateProcessor {
	private filter: MetadataFilter = defaultFilter;
	private currentState: ConnectorState = { ...defaultState };
	private filteredState: ConnectorState = { ...defaultState };

	constructor(private connector: Stateful<ConnectorState>) {}

	applyFilter(filter: MetadataFilter): void {
		this.filter = filter.extend(defaultFilter);
	}

	processState(): void {
		// if (!this.isScrobblingAllowed()) {
		// 	this.resetState();
		// 	return;
		// }

		// isStateReset = false;

		const changedFields = [];
		const newState = this.connector.getState();

		for (const key of getObjectKeys(this.currentState)) {
			let newValue: ConnectorPropValue;
			if (newState[key] || newState[key] === false) {
				newValue = newState[key];
			} else {
				newValue = defaultState[key];
			}
			const oldValue = this.currentState[key];

			if (newValue !== oldValue) {
				// @ts-ignore
				this.currentState[key] = newValue;
				changedFields.push(key);
			}
		}

		if (changedFields.length === 0) {
			return;
		}

		this.filterState(changedFields);

		// if (this.reactorCallback !== null) {
		// 	this.reactorCallback(filteredState, changedFields);
		// }

		// @ifdef DEVELOPMENT
		if (changedFields.includes('isPlaying')) {
			// Util.debugLog(`isPlaying state changed to ${newState.isPlaying}`);
		}

		for (const field of fieldsToCheckSongChange) {
			if (changedFields.includes(field)) {
				Util.debugLog(JSON.stringify(this.filteredState, null, 2));
				break;
			}
		}
		// @endif
	}

	private filterState(changedFields: ConnectorProp[]): void {
		for (const field of changedFields) {
			let fieldValue = this.currentState[field];

			switch (field) {
				case 'albumArtist': {
					if (fieldValue === this.currentState.artist) {
						fieldValue = defaultState[field];
					}
				}
				// eslint-disable-next-line no-fallthrough
				case 'artist':
				case 'track':
				case 'album': {
					fieldValue =
						this.filter.filterField(field, fieldValue as string) ||
						defaultState[field];
					break;
				}
				case 'currentTime':
				case 'duration': {
					fieldValue =
						Util.escapeBadTimeValues(fieldValue) ||
						defaultState[field];
					break;
				}
				// case 'trackArt':
				// 	if (
				// 		fieldValue &&
				// 		this.isTrackArtDefault(fieldValue as string)
				// 	) {
				// 		fieldValue = null;
				// 	}
				// 	break;
			}

			// @ts-ignore
			this.filteredState[field] = fieldValue;
		}
	}
}
