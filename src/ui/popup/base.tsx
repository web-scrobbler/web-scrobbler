import { t } from '@/util/i18n';
import { ExpandMoreOutlined, MusicNoteOutlined } from '@/ui/components/icons';
import styles from './popup.module.scss';
import { TPopupAnchor } from '../components/util';

/**
 * Info to be shown on a recognized website before anything is played.
 */
export default function Base() {
	return (
		<div class={styles.alertPopup}>
			<MusicNoteOutlined class={styles.bigIcon} />
			<h1>{t('getStartedHeader')}</h1>
			<details class={styles.alreadyPlaying}>
				<summary>
					<ExpandMoreOutlined class={styles.expandVector} />
					{t('getStartedSubheader')}
				</summary>
				<p>{t('getStartedSiteChanged')}</p>
				<p>
					<TPopupAnchor messageName="getStartedSubmitIssue" />
				</p>
			</details>
		</div>
	);
}
