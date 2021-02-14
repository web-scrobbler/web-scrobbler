import { Controller } from '@/background/object/controller';

import type { ConnectorEntry } from '@/common/connector-entry';
import type { ControllerFactory } from '@/background/object/controller/ControllerFactory';
import type { ScrobblerManager } from '@/background/scrobbler/ScrobblerManager';
import type { SongPipeline } from '@/background/pipeline/SongPipeline';

export class ControllerFactoryImpl implements ControllerFactory {
	constructor(
		private scrobblerManager: ScrobblerManager,
		private songPipeline: SongPipeline
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
