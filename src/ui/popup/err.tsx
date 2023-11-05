import { t } from '@/util/i18n';
import Error from '@suid/icons-material/ErrorOutlined';
import styles from './popup.module.scss';
import browser from 'webextension-polyfill';
import Settings from '@suid/icons-material/SettingsOutlined';
import optionComponentStyles from '../options/components/components.module.scss';
import { PopupAnchor, TPopupAnchor } from '../components/util';

/**
 * Info to be shown when an error occurs when submitting scrobbles to a service
 */
export default function Err() {
	return (
		<div class={styles.alertPopup}>
			<Error class={styles.bigIcon} />
			<h1>{t('serviceErrorHeader')}</h1>
			<p>
				<TPopupAnchor messageName="serviceErrorDesc" />
			</p>
			<PopupAnchor
				href={browser.runtime.getURL(
					'src/ui/options/index.html?p=accounts',
				)}
				class={`${optionComponentStyles.button} ${optionComponentStyles.centered}`}
			>
				<Settings />
				{t('disabledSiteButton')}
			</PopupAnchor>
		</div>
	);
}
