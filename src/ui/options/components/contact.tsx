import browser from 'webextension-polyfill';
import githubIcon from './icons/github-mark.svg';
import twitterBird from './icons/twitter-logo.svg';
import { LockOutlined } from '@/ui/components/icons';
import { t } from '@/util/i18n';
import styles from './components.module.scss';

/**
 * Component that displays links to various places to get in touch with web scrobbler maintainers
 */
export default function ContactComponent() {
	return (
		<>
			<h1>{t('contactTitle')}</h1>
			<ul class={`${styles.contactList} ${styles.optionList}`}>
				<a
					href="https://github.com/web-scrobbler/web-scrobbler/issues"
					target="_blank"
					rel="noopener noreferrer"
				>
					<li
						class={`${styles.contactEntry} ${styles.contactGithub}`}
					>
						<img
							class={styles.invertImg}
							src={githubIcon as string}
							alt=""
							width={32}
							height={32}
						/>
						<img
							class={styles.invertImg}
							src={browser.runtime.getURL('img/GitHub_Logo.png')}
							alt="GitHub"
							width={78}
							height={32}
						/>
						<span class={styles.desc}>
							{t('contactGitHubDesc')}
						</span>
					</li>
				</a>
				<a
					href="https://twitter.com/web_scrobbler"
					target="_blank"
					rel="noopener noreferrer"
				>
					<li
						class={`${styles.contactEntry} ${styles.contactTwitter}`}
					>
						<img
							src={twitterBird as string}
							alt=""
							width={32}
							height={32}
						/>
						<span class={styles.brandText}>Twitter</span>
						<span class={styles.desc}>
							{t('contactTwitterDesc')}
						</span>
					</li>
				</a>
				<a
					href={t('contactPrivacyPolicyUrl')}
					target="_blank"
					rel="noopener noreferrer"
				>
					<li
						class={`${styles.contactEntry} ${styles.contactPrivacy}`}
					>
						<LockOutlined />
						<span class={styles.brandText}>Privacy</span>
						<span class={styles.desc}>
							{t('contactPrivacyPolicyDesc')}
						</span>
					</li>
				</a>
			</ul>
		</>
	);
}
