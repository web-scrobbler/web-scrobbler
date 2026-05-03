import { TAnchor } from '@/ui/components/util';
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
			<p
				innerHTML={t('aboutChangelog', [
					currentChangelog(),
					RELEASES_URL,
				])}
			></p>
			<h2>{t('versionTitle')}</h2>
			<p innerHTML={t('versionText', getExtensionVersion())}></p>
			<h2>{t('contributorsTitle')}</h2>
			<TAnchor
				messageName="contributorsText"
				substitutions={CONTRIBUTORS_URL}
				target="_blank"
			/>
			// #v-ifdef !VITE_SAFARI
			<TAnchor
				messageName="contributorsContribute"
				substitutions={CONTRIBUTING_URL}
				target="_blank"
			/>
			// #v-endif
		</>
	);
}
