import {
	ConnectorStateContext,
	isGeneralContext,
	isYouTubeContext,
} from '@/background/model/ConnectorStateContext';

import type { ConnectorsOptions } from '@/background/repository/connectors-options/ConnectorsOptions';
import type { ExtensionOptions } from '@/background/repository/extension-options/ExtensionOptions';

/**
 * Helper to process ConnectorStateContext contents.
 */
export class ConnectorStateContextWorker {
	constructor(
		private extensionOptions: ExtensionOptions,
		private connectorsOptions: ConnectorsOptions
	) {}

	/**
	 * Check if the song should be skipped based on the given context.
	 *
	 * @param context Connector state context
	 *
	 * @return Check result
	 */
	async shouldSongBeSkipped(
		context: ConnectorStateContext
	): Promise<boolean> {
		if (isYouTubeContext(context)) {
			return this.isVideoCategoryAllowed(context.videoCategory);
		}

		if (isGeneralContext(context)) {
			return context.isPodcast && (await this.isPodcastAllowed());
		}

		return false;
	}

	private async isVideoCategoryAllowed(
		videoCategory: string
	): Promise<boolean> {
		const isMusicCategoryAllowed = await this.connectorsOptions.getOption(
			'youtube',
			'scrobbleMusicOnly'
		);
		const isEntertainmentCategoryAllowed = await this.connectorsOptions.getOption(
			'youtube',
			'scrobbleEntertainmentOnly'
		);

		switch (videoCategory) {
			case 'Music':
				return isMusicCategoryAllowed;

			case 'Entertainment':
				return isEntertainmentCategoryAllowed;

			default:
				return !(
					isMusicCategoryAllowed && isEntertainmentCategoryAllowed
				);
		}
	}

	private async isPodcastAllowed(): Promise<boolean> {
		return this.extensionOptions.getOption('scrobblePodcasts');
	}
}
