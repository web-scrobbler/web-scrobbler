import {
	currentChangelog,
	t,
	CONTRIBUTING_URL,
	CONTRIBUTORS_URL,
	RELEASES_URL,
} from '@/util/i18n';
import { getExtensionVersion } from '@/util/util-browser';

/**
 * Component that shows basic information about the extension
 */
export default function InfoComponent() {
	return (
		<>
			<h1>{t('optionsAbout')}</h1>
			<p>{t('aboutExtensionDesc')}</p>
			<p>
				{t('aboutChangelog1')}
				<a
					id="latest-release"
					target="_blank"
					href={currentChangelog()}
				>
					{t('aboutChangelog2_latest-release-url')}
				</a>
				{t('aboutChangelog3')}
				<a id="all-releases" target="_blank" href={RELEASES_URL}>
					{t('aboutChangelog4_all-releases-url')}
				</a>
				{t('aboutChangelog5')}
			</p>
			<h2>{t('versionTitle')}</h2>
			<p>{t('versionText', getExtensionVersion())}</p>
			<h2>{t('contributorsTitle')}</h2>
			<p>
				{t('contributorsText1')}
				<a id="contributors" href={CONTRIBUTORS_URL}>
					{t('contributorsText2_contributors-url')}
				</a>
				{t('contributorsText3')}
			</p>
			// #v-ifdef !VITE_SAFARI
			<p>
				{t('contributorsContribute1')}
				<a
					id="contributing"
					target="_blank"
					href={CONTRIBUTING_URL}
					rel="noopener noreferrer"
				>
					{t('contributorsContribute2_contributing-url')}
				</a>
				{t('contributorsContribute3')}
			</p>
			// #v-endif
		</>
	);
}
