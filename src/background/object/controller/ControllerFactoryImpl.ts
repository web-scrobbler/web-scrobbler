import { Controller } from '@/background/object/controller';

import type { ConnectorEntry } from '@/common/connector-entry';
import type { ControllerFactory } from '@/background/object/controller/ControllerFactory';
import type { Processor } from '@/background/pipeline/Processor';
import type { ScrobblerManager } from '@/background/scrobbler/ScrobblerManager';
import type { Song } from '@/background/model/song/Song';

export class ControllerFactoryImpl implements ControllerFactory {
	constructor(
		private scrobblerManager: ScrobblerManager,
		private songPipeline: Processor<Song>
	) {}

	createController(
		tabId: number,
		connector: ConnectorEntry,
		isEnabled: boolean
	): Controller {
		return new Controller(
			tabId,
			connector,
			isEnabled,
			this.scrobblerManager,
			this.songPipeline
		);
	}
}
