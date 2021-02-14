import { openTab } from '@/common/util-browser';

import type { Controller } from '@/background/object/controller';
import type { Notifications } from '@/background/browser/notifications/Notifications';
import type { NowPlayingListener } from '@/background/object/controller/NowPlayingListener';

export class NotificationDisplayer implements NowPlayingListener {
	constructor(private notifications: Notifications) {}

	onReset(ctrl: Controller): void {
		const song = ctrl.getCurrentSong();
		if (song) {
			this.notifications.clearNowPlaying(song);
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

			this.notifications.showNowPlayingNotification(
				song,
				label,
				onClickedFn
			);
		} else {
			this.notifications.showSongNotRecognized(song, onClickedFn);
		}
	}
}
