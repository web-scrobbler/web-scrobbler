import { currentChangelog, t } from '@/util/i18n';

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
