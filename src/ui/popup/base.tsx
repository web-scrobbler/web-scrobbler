import { t } from '@/util/i18n';
import MusicNote from '@suid/icons-material/MusicNoteOutlined';
import styles from './popup.module.scss';
import ExpandMore from '@suid/icons-material/ExpandMoreOutlined';
import { TPopupAnchor } from '../components/util';

/**
 * Info to be shown on a recognized website before anything is played.
 */
export default function Base() {
	return (
		<div class={styles.alertPopup}>
			<MusicNote class={styles.bigIcon} />
			<h1>{t('getStartedHeader')}</h1>
			<details class={styles.alreadyPlaying}>
				<summary>
					<ExpandMore class={styles.expandVector} />
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
