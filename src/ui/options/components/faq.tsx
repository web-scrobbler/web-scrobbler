import { t } from '@/util/i18n';

/**
 * Component that shows some frequently asked questions
 */
export default function FAQ() {
	return (
		<>
			<h1>{t('faqTitle')}</h1>

			<h2>{t('faqQuestion1')}</h2>
			<p>{t('faqAnswer1a')}</p>
			<p>{t('faqAnswer1b')}</p>

			<h2>{t('faqQuestion2')}</h2>
			<p>{t('faqAnswer2a')}</p>
			<p>{t('faqAnswer2b')}</p>

			<h2>{t('faqQuestion3')}</h2>
			<p>{t('faqAnswer3a')}</p>
			<p>{t('faqAnswer3b')}</p>

			<h2>{t('faqQuestion4')}</h2>
			<p>{t('faqAnswer4a')}</p>
			<p>{t('faqAnswer4b')}</p>
			<ol>
				<li>{t('faqAnswer4b1')}</li>
				<li>{t('faqAnswer4b2')}</li>
				<li>{t('faqAnswer4b3')}</li>
				<li>{t('faqAnswer4b4')}</li>
			</ol>
			{/* eslint-disable-next-line */}
			<p innerHTML={t('faqAnswer4c')} />

			<h2>{t('faqQuestion5')}</h2>
			{/* eslint-disable-next-line */}
			<p innerHTML={t('faqAnswer5')} />

			<h2>{t('faqQuestion6')}</h2>
			<p>{t('faqAnswer6')}</p>

			<h2>{t('faqQuestion7')}</h2>
			<p>{t('faqAnswer7')}</p>
		</>
	);
}
