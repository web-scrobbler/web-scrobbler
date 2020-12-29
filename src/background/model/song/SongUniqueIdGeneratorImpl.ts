import md5 from 'blueimp-md5';

import {
	ConnectorProp,
	ConnectorState,
} from '@/background/model/ConnectorState';
import {
	SongUniqueIdGenerator,
	UniqueIdGenerator,
} from '@/background/model/song/SongUniqueIdGenerator';

export class SongUniqueIdGeneratorImpl implements SongUniqueIdGenerator {
	constructor(private state: ConnectorState) {}

	/**
	 * Return a generator generates all possible unique IDs for a song.
	 *
	 * Some connectors don't implement `Connector.getUniqueId` function, so we
	 * need to generate the ID key manually by using song info as a seed value.
	 *
	 * Since unique IDs are created with song info, there could be a case,
	 * when this info is changed (e.g. a new getter was added to a connector),
	 * and we can't calculate the same ID again, since the song info is not
	 * the same.
	 *
	 * @yields Unique ID
	 */
	*generateUniqueId(): UniqueIdGenerator {
		// Base unique ID
		yield this.createUniqueId(['artist', 'track', 'album', 'albumArtist']);

		// Fallback value 1 (no `artist album` property)
		yield this.createUniqueId(['artist', 'track', 'album']);

		// Fallback value 2 (no `album` property)
		yield this.createUniqueId(['artist', 'track']);
	}

	private createUniqueId(properties: ConnectorProp[]): string {
		let inputStr = '';

		for (const field of properties) {
			const rawPropertyValue = this.state[field];

			if (rawPropertyValue) {
				inputStr += rawPropertyValue;
			}
		}

		if (inputStr) {
			return md5(inputStr);
		}

		throw new Error('Unable to create a repository key for the empty song');
	}
}
