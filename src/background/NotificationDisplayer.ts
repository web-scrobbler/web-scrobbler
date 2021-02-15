import { openTab } from '@/common/util-browser';

import type { Controller } from '@/background/object/controller';
import type { Notifications } from '@/background/browser/notifications/Notifications';
import type { NowPlayingListener } from '@/background/object/controller/NowPlayingListener';

export class NotificationDisplayer implements NowPlayingListener {
	private timeoutId: NodeJS.Timeout = null;

	constructor(private notifications: Notifications) {}

	onReset(ctrl: Controller): void {
		const song = ctrl.getCurrentSong();
		if (song) {
			this.notifications.clearNotification(song);
		}
	}

	onNowPlaying(ctrl: Controller): void {
		const song = ctrl.getCurrentSong();
		if (song.getFlag('isReplaying')) {
			return;
		}

		const onClickedFn = () => {
			openTab(ctrl.tabId);
		};

		if (song.isValid()) {
			const { label } = ctrl.getConnector();

			this.clearTimeout();
			this.timeoutId = setTimeout(() => {
				this.notifications.showNowPlayingNotification(
					song,
					label,
					onClickedFn
				);
			}, nowPlayingNotificationDelay);
		} else {
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
