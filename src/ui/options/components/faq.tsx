import { CUSTOM_URLS_DOCS_URL, ISSUES_URL, REPO_URL, t } from '@/util/i18n';

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
			<p>
				{t('faqAnswer4c1')}
				<a
					id="docs-custom-urls"
					target="_blank"
					href={CUSTOM_URLS_DOCS_URL}
				>
					{t('faqAnswer4c2_docs-custom-urls-url')}
				</a>
				{t('faqAnswer4c3')}
			</p>

			<h2>{t('faqQuestion5')}</h2>
			<p>
				{t('faqAnswer5a')}
				<a id="gh-issues" target="_blank" href={ISSUES_URL}>
					{t('faqAnswer5b_issues-url')}
				</a>
				{t('faqAnswer5c')}
				<a id="gh-repo" target="_blank" href={REPO_URL}>
					{t('faqAnswer5d_repo-url')}
				</a>
				{t('faqAnswer5e')}
			</p>

			<h2>{t('faqQuestion6')}</h2>
			<p>{t('faqAnswer6')}</p>

			<h2>{t('faqQuestion7')}</h2>
			<p>{t('faqAnswer7')}</p>
		</>
	);
}
