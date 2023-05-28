import { t } from '@/util/i18n';
import MusicOff from '@suid/icons-material/MusicOffOutlined';
import styles from './popup.module.scss';
import browser from 'webextension-polyfill';
import Settings from '@suid/icons-material/SettingsOutlined';
import optionComponentStyles from '../options/components/components.module.scss';
import { PopupAnchor } from '../components/util';

/**
 * Information to be shown on a website where web scrobbler has been disabled
 */
export default function Disabled() {
	return (
		<div class={styles.alertPopup}>
			<MusicOff class={styles.bigIcon} />
			<h1>{t('disabledSiteHeader')}</h1>
			<p>{t('disabledSiteDesc')}</p>
			<PopupAnchor
				href={browser.runtime.getURL('src/ui/options/index.html')}
				class={`${optionComponentStyles.linkButton} ${styles.centered}`}
			>
				<Settings />
				{t('disabledSiteButton')}
			</PopupAnchor>
		</div>
	);
}
