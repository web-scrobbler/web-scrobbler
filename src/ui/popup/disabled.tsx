import { t } from '@/util/i18n';
import { MusicOffOutlined, SettingsOutlined } from '@/ui/components/icons';
import styles from './popup.module.scss';
import browser from 'webextension-polyfill';
import optionComponentStyles from '../options/components/components.module.scss';
import { PopupAnchor } from '../components/util';

/**
 * Information to be shown on a website where web scrobbler has been disabled
 */
export default function Disabled() {
	return (
		<div class={styles.alertPopup}>
			<MusicOffOutlined class={styles.bigIcon} />
			<h1>{t('disabledSiteHeader')}</h1>
			<p>{t('disabledSiteDesc')}</p>
			<PopupAnchor
				href={browser.runtime.getURL(
					'src/ui/options/index.html?p=connectors',
				)}
				class={`${optionComponentStyles.button} ${optionComponentStyles.centered}`}
			>
				<SettingsOutlined />
				{t('disabledSiteButton')}
			</PopupAnchor>
		</div>
	);
}
