import ClonedSong from '@/core/object/cloned-song';
import { ManagerTab } from '@/core/storage/wrapper';
import { Resource, Show, createMemo, createSignal } from 'solid-js';
import styles from './popup.module.scss';
import optionComponentStyles from '../options/components/components.module.scss';
import { t } from '@/util/i18n';
import MusicOff from '@suid/icons-material/MusicOffOutlined';
import Send from '@suid/icons-material/Send';
import { sendBackgroundMessage } from '@/util/communication';

export default function Disallowed(props: { tab: Resource<ManagerTab> }) {
	const [isLoading, setLoading] = createSignal(false);
	const song = createMemo(() => {
		const rawTab = props.tab();
		if (!rawTab) return null;
		const rawSong = rawTab.song;
		if (!rawSong) return null;
		return new ClonedSong(rawSong, rawTab.tabId);
	});

	return (
		<Show when={!isLoading()} fallback={<></>}>
			<div class={styles.alertPopup}>
				<MusicOff class={styles.bigIcon} />
				<h1>{t('disallowedHeader')}</h1>
				<p>
					{t('disallowedDesc1', [
						song()?.getArtist() ?? '???',
						song()?.getTrack() ?? '???',
					])}
				</p>
				<p>{t('disallowedDesc2')}</p>
				<button
					class={`${optionComponentStyles.resetButton} ${styles.centered}`}
					onClick={() => {
						setLoading(true);
						sendBackgroundMessage(props.tab()?.tabId ?? -1, {
							type: 'forceScrobbleSong',
							payload: undefined,
						});
					}}
				>
					<Send />
					{t('disallowedButton')}
				</button>
			</div>
		</Show>
	);
}
