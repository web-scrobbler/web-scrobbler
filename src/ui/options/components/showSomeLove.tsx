import { t } from '@/util/i18n';
import VolunteerActivism from '@suid/icons-material/VolunteerActivismOutlined';
import styles from './components.module.scss';

/**
 * Component that allows the user to donate to development
 */
export default function ShowSomeLove() {
	return (
		<>
			<h1>{t('showSomeLoveTitle')}</h1>
			<p>{t('showSomeLoveText1')}</p>
			<p>{t('showSomeLoveText2')}</p>
			<a
				class={styles.linkButton}
				href="https://opencollective.com/web-scrobbler/donate"
				target="_blank"
				rel="noopener noreferrer"
			>
				<VolunteerActivism />
				<span>{t('donationButtonLabel')}</span>
			</a>
		</>
	);
}
