import { sendBackgroundMessage } from '@/util/communication';
import {
	BaseSong,
	CloneableSong,
	Flags,
	Metadata,
	ParsedSongData,
	ProcessedSongData,
} from './song';

export default class ClonedSong extends BaseSong {
	public parsed: ParsedSongData;
	public processed: ProcessedSongData;
	public flags: Flags;
	public metadata: Metadata;
	public connectorLabel: string;
	public controllerTabId: number;

	constructor(song: CloneableSong, controllerTabId: number) {
		super();
		this.parsed = song.parsed;
		this.processed = song.processed;
		this.flags = song.flags;
		this.metadata = song.metadata;
		this.connectorLabel = song.connectorLabel;
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
