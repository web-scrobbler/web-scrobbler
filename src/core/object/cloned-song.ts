import { sendBackgroundMessage } from '@/util/communication';
import {
	BaseSong,
	CloneableSong,
	Flags,
	Metadata,
	ParsedSongData,
	ProcessedSongData,
} from './song';
import { ConnectorMeta } from '../connectors';

/**
 * This class is used to create a song object from a cloned song.
 */
export default class ClonedSong extends BaseSong {
	public parsed: ParsedSongData;
	public processed: ProcessedSongData;
	public noRegex: ProcessedSongData;
	public flags: Flags;
	public metadata: Metadata;
	public connector: ConnectorMeta;
	public controllerTabId: number;

	constructor(song: CloneableSong, controllerTabId: number) {
		super();
		this.parsed = song.parsed;
		this.processed = song.processed;
		this.noRegex = song.noRegex;
		this.flags = song.flags;
		this.metadata = song.metadata;
		this.connector = song.connector;
		this.controllerTabId = controllerTabId;
	}

	public resetData(): void {
		sendBackgroundMessage(this.controllerTabId, {
			type: 'resetData',
			payload: undefined,
		});
	}

	public resetInfo(): void {
		sendBackgroundMessage(this.controllerTabId, {
			type: 'resetInfo',
			payload: undefined,
		});
	}
}
