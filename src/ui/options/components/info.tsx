import { currentChangelog, t } from '@/util/i18n';
import { getExtensionVersion } from '@/util/util-browser';

/**
 * Component that shows basic information about the extension
 */
export default function InfoComponent() {
	return (
		<>
			<h1>{t('optionsAbout')}</h1>
			<p>{t('aboutExtensionDesc')}</p>
			{/* eslint-disable-next-line */}
			<p innerHTML={t('aboutChangelog', currentChangelog())}></p>
			<h2>{t('versionTitle')}</h2>
			{/* eslint-disable-next-line */}
			<p innerHTML={t('versionText', getExtensionVersion())}></p>
			<h2>{t('contributorsTitle')}</h2>
			{/* eslint-disable-next-line */}
			<p innerHTML={t('contributorsText')}></p>
			// #v-ifdef !VITE_SAFARI
			{/* eslint-disable-next-line */}
			<p innerHTML={t('contributorsContribute')}></p>
			// #v-endif
		</>
	);
}
