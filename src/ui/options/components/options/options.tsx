import * as BrowserStorage from '@/core/storage/browser-storage';
import { t } from '@/util/i18n';
import { Setter, createResource } from 'solid-js';
import GlobalOptionsList from './global-options';
import ConnectorOptionsList from './connector-options';
import ScrobbleBehavior from './scrobble-behavior';
import EditedTracks from './edited-tracks';
import ConnectorOverrideOptions from './connector-override';

const globalOptions = BrowserStorage.getStorage(BrowserStorage.OPTIONS);

export default function OptionsComponent(props: {
	setActiveModal: Setter<string>;
	modal: HTMLDialogElement | undefined;
}) {
	const { setActiveModal, modal } = props;
	const [options, setOptions] = createResource(
		globalOptions.get.bind(globalOptions)
	);
	return (
		<>
			<h1>{t('optionsOptions')}</h1>
			<GlobalOptionsList options={options} setOptions={setOptions} />
			<ConnectorOptionsList />
			<ScrobbleBehavior options={options} setOptions={setOptions} />
			<EditedTracks setActiveModal={setActiveModal} modal={modal} />
			<ConnectorOverrideOptions />
		</>
	);
}
