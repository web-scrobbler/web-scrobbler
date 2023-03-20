import { t } from '@/util/i18n';
import SentimentDissatisfied from '@suid/icons-material/SentimentDissatisfiedOutlined';
import styles from './popup.module.scss';

export default function Unsupported() {
	return (
		<div class={styles.alertPopup}>
			<SentimentDissatisfied class={styles.bigIcon} />
			<h1>{t('unsupportedWebsiteHeader')}</h1>
			<p>{t('unsupportedWebsiteDesc')}</p>
			<p>
				<span>{t('unsupportedWebsiteDesc2')} </span>
				<a
					target="_blank"
					rel="noopener noreferrer"
					href="https://cloud.google.com/docs/chrome-enterprise/policies/?policy=ExtensionSettings"
				>
					{t('learnMoreLabel')}
				</a>
			</p>
		</div>
	);
}
