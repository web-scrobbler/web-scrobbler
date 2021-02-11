import {
	clearNowPlaying,
	showNowPlaying,
	showSongNotRecognized,
} from '@/background/browser/notifications';
import { NowPlayingListener } from '@/background/object/controller/NowPlayingListener';
import { Controller } from '@/background/object/controller';
import { openTab } from '@/common/util-browser';

export class NotificationDisplayer implements NowPlayingListener {
	onReset(ctrl: Controller): void {
		// const song = ctrl.getCurrentSong();
		// if (song) {
		// 	clearNowPlaying(song);
		// }
	}

	onNowPlaying(ctrl: Controller): void {
		// const song = ctrl.getCurrentSong();
		// if (song.flags.isReplaying) {
		// 	return;
		// }
		// if (song.isValid()) {
		// 	const { label } = ctrl.getConnector();
		// 	showNowPlaying(song, label, () => {
		// 		openTab(ctrl.tabId);
		// 	});
		// } else {
		// 	showSongNotRecognized(song, () => {
		// 		openTab(ctrl.tabId);
		// 	});
		// }
	}
}
