import { getStorage } from '@/core/storage/browser-storage';
import { OPTIONS } from '@/core/storage/storage-constants';
import { t } from '@/util/i18n';
import { createResource } from 'solid-js';
import GlobalOptionsList from './global-options';
import ConnectorOptionsList from './connector-options';
import ScrobbleBehavior from './scrobble-behavior';

const globalOptions = getStorage(OPTIONS);

const [options, setOptions] = createResource(
	globalOptions.get.bind(globalOptions),
);

/**
 * Component that shows options to the user
 */
export default function OptionsComponent() {
	return (
		<>
			<h1>{t('optionsOptions')}</h1>
			<GlobalOptionsList options={options} setOptions={setOptions} />
			<ConnectorOptionsList />
			<ScrobbleBehavior options={options} setOptions={setOptions} />
		</>
	);
}
