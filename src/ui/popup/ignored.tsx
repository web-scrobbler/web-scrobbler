import { ManagerTab } from '@/core/storage/wrapper';
import { Resource, createMemo } from 'solid-js';
import styles from './popup.module.scss';
import { t } from '@/util/i18n';
import { PopupAnchor } from '../components/util';
import { CancelScheduleSendOutlined } from '@/ui/components/icons';
import ClonedSong from '@/core/object/cloned-song';

export default function Ignored(props: { tab: Resource<ManagerTab> }) {
	const clonedSong = createMemo(() => {
		const cloneable = props.tab()?.song;
		if (cloneable) {
			return new ClonedSong(cloneable, -1);
		}
	});
	return (
		<div class={styles.alertPopup}>
			<CancelScheduleSendOutlined class={styles.bigIcon} />
			<h1>{t('ignoredHeader')}</h1>
			<p>
				{t('ignoredDesc', [
					clonedSong()?.getArtist() ?? '????',
					clonedSong()?.getTrack() ?? '????',
				])}
			</p>
			<PopupAnchor
				href="https://support.last.fm/t/track-filter-list-unknown-scrobbles/776"
				title={t('ignoredDescReadMore')}
			>
				{t('ignoredDescReadMore')}
			</PopupAnchor>
		</div>
	);
}
