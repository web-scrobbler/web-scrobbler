import * as BrowserStorage from '@/core/storage/browser-storage';
import { t } from '@/util/i18n';
import { createResource } from 'solid-js';
import GlobalOptionsList from './global-options';
import ConnectorOptionsList from './connector-options';
import ScrobbleBehavior from './scrobble-behavior';

const globalOptions = BrowserStorage.getStorage(BrowserStorage.OPTIONS);

const [options, setOptions] = createResource(
	globalOptions.get.bind(globalOptions)
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
