import { openTab } from '@/common/util-browser';

import type { Controller } from '@/background/object/controller';
import type {
	Notifications,
	OnNotificationClickedListener,
} from '@/background/browser/notifications/Notifications';
import type { Song } from '@/background/model/song/Song';
import type { ExtensionOptions } from '@/background/repository/extension-options/ExtensionOptions';

export class NotificationDisplayer {
	private timeoutId: NodeJS.Timeout = null;

	constructor(
		private notifications: Notifications,
		private options: ExtensionOptions
	) {}

	/**
	 * Hide last now playing notification for the given controller.
	 *
	 * @param ctrl Controller
	 */
	hideNotification(ctrl: Controller): void {
		const song = ctrl.getCurrentSong();
		if (song) {
			this.notifications.clearNotification(song);
		}
	}

	/**
	 * Show now playing notification for the given controller.
	 *
	 * @param ctrl Controller
	 */
	showNotification(ctrl: Controller): void {
		const song = ctrl.getCurrentSong();
		if (song.getFlag('isReplaying')) {
			return;
		}

		const onClickedFn = () => {
			openTab(ctrl.tabId);
		};

		if (song.isValid()) {
			const { label } = ctrl.getConnector();

			this.showNowPlayingNotification(song, label, onClickedFn);
		} else {
			this.showNotRecognizedNotification(song, onClickedFn);
		}
	}

	private async showNowPlayingNotification(
		song: Song,
		label: string,
		onClickedFn: OnNotificationClickedListener
	): Promise<void> {
		if (await this.options.getOption('useNotifications')) {
			this.clearTimeout();

			this.timeoutId = setTimeout(() => {
				this.notifications.showNowPlayingNotification(
					song,
					label,
					onClickedFn
				);
			}, nowPlayingNotificationDelay);
		}
	}

	private async showNotRecognizedNotification(
		song: Song,
		onClickedFn: OnNotificationClickedListener
	): Promise<void> {
		if (await this.options.getOption('useUnrecognizedSongNotifications')) {
			this.notifications.showNotRecognizedNotification(song, onClickedFn);
		}
	}

	private clearTimeout(): void {
		if (this.timeoutId !== null) {
			clearTimeout(this.timeoutId);

			this.timeoutId = null;
		}
	}
}

const nowPlayingNotificationDelay = 5000;
