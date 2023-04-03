import { t } from '@/util/i18n';
import Error from '@suid/icons-material/ErrorOutlined';
import styles from './popup.module.scss';
import browser from 'webextension-polyfill';
import Settings from '@suid/icons-material/SettingsOutlined';
import optionComponentStyles from '../options/components/components.module.scss';

/**
 * Info to be shown when an error occurs when submitting scrobbles to a service
 */
export default function Err() {
	return (
		<div class={styles.alertPopup}>
			<Error class={styles.bigIcon} />
			<h1>{t('serviceErrorHeader')}</h1>
			{/* eslint-disable-next-line */}
			<p innerHTML={t('serviceErrorDesc')} />
			<a
				href={browser.runtime.getURL('src/ui/options/index.html')}
				class={`${optionComponentStyles.linkButton} ${styles.centered}`}
				target="_blank"
				rel="noopener noreferrer"
			>
				<Settings />
				{t('disabledSiteButton')}
			</a>
		</div>
	);
}
