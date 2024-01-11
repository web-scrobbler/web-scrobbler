import StorageWrapper, { Blocklists } from '@/core/storage/wrapper';
import * as Options from '@/core/storage/options';
import * as BrowserStorage from '@/core/storage/browser-storage';
import Visibility from '@suid/icons-material/VisibilityOutlined';
import Upload from '@suid/icons-material/UploadOutlined';
import Download from '@suid/icons-material/DownloadOutlined';
import styles from '../components.module.scss';
import { t } from '@/util/i18n';
import { Setter, createSignal } from 'solid-js';
import { RegexEdit } from '@/util/regex';
import { ModalType } from '../navigator';
import { ConnectorMeta } from '@/core/connectors';

type EditWrapper = StorageWrapper<
	typeof BrowserStorage.REGEX_EDITS | typeof BrowserStorage.LOCAL_CACHE
>;
type EditSetter = Setter<
	| {
			[key: string]: Options.SavedEdit;
	  }
	| RegexEdit[]
	| null
	| undefined
>;

/**
 * Button that allows the user to open the modal that shows them their track edits
 */
export function ViewEdits(props: {
	setActiveModal: Setter<ModalType>;
	modal: HTMLDialogElement | undefined;
	type: ModalType;
}) {
	return (
		<button
			class={`${styles.button} ${styles.shiftLeft}`}
			onClick={(e) => {
				e.stopImmediatePropagation();
				props.setActiveModal(props.type);
				props.modal?.showModal();
			}}
		>
			<Visibility />
			{t('optionsViewEdited')}
		</button>
	);
}

/**
 * Button that allows the user to open the modal that shows them their track edits
 */
export function ViewBlocklist(props: {
	setActiveModal: Setter<ModalType>;
	modal: HTMLDialogElement | undefined;
	type: ModalType;
}) {
	return (
		<button
			class={`${styles.button} ${styles.shiftLeft}`}
			onClick={(e) => {
				e.stopImmediatePropagation();
				props.setActiveModal(props.type);
				props.modal?.showModal();
			}}
		>
			<Visibility />
			{t('optionsViewEdited')}
		</button>
	);
}

/**
 * Button that exports edits for the user
 */
export function ExportEdits(props: {
	editWrapper: EditWrapper;
	filename: string;
}) {
	return (
		<button
			class={`${styles.button} ${styles.shiftLeft}`}
			onClick={() =>
				void downloadEdits(props.editWrapper, props.filename)
			}
		>
			<Upload />
			{t('optionsExportEdited')}
		</button>
	);
}

/**
 * Button that exports blocklist for the user
 */
export function ExportBlocklist(props: {
	blocklistWrapper: StorageWrapper<typeof BrowserStorage.BLOCKLISTS>;
	connector: ConnectorMeta;
	filename: string;
}) {
	return (
		<button
			class={`${styles.button} ${styles.shiftLeft}`}
			onClick={() =>
				void downloadBlocklist(
					props.blocklistWrapper,
					props.connector,
					props.filename,
				)
			}
		>
			<Upload />
			{t('optionsExportEdited')}
		</button>
	);
}

/**
 * Compiles all the users track edits from storage and downloads them
 */
async function downloadBlocklist(
	blocklistWrapper: StorageWrapper<typeof BrowserStorage.BLOCKLISTS>,
	connector: ConnectorMeta,
	filename: string,
) {
	const blocklists = await blocklistWrapper.get();
	if (!blocklists || !blocklists[connector.id]) {
		return;
	}
	const data = `data:text/json;charset=UTF-8,${encodeURIComponent(
		JSON.stringify(blocklists[connector.id]),
	)}`;
	const a = document.createElement('a');
	a.download = filename;
	a.href = data;
	a.click();
}

/**
 * Compiles all the users track edits from storage and downloads them
 */
async function downloadEdits(editWrapper: EditWrapper, filename: string) {
	const edits = await editWrapper.get();
	if (!edits) {
		return;
	}
	const data = `data:text/json;charset=UTF-8,${encodeURIComponent(
		JSON.stringify(edits),
	)}`;
	const a = document.createElement('a');
	a.download = filename;
	a.href = data;
	a.click();
}

/**
 * Button that allows the user to upload a .json file and get blocklist from it.
 */
export function ImportBlocklist(props: {
	blocklistWrapper: StorageWrapper<typeof BrowserStorage.BLOCKLISTS>;
	connector: ConnectorMeta;
	mutate: Setter<Blocklists | null | undefined>;
}) {
	const [ref, setRef] = createSignal<HTMLInputElement>();
	return (
		<button
			class={`${styles.button} ${styles.shiftLeft}`}
			onClick={() => ref()?.click()}
		>
			<Download />
			{t('optionsImportEdited')}
			<input
				hidden={true}
				ref={setRef}
				type="file"
				accept=".json"
				onChange={(e) =>
					pushBlocklist(
						e,
						props.blocklistWrapper,
						props.connector,
						props.mutate,
					)
				}
			/>
		</button>
	);
}

/**
 * Button that allows the user to upload a .json file and get edits from it.
 */
export function ImportEdits(props: {
	editWrapper: EditWrapper;
	mutate: EditSetter;
}) {
	const [ref, setRef] = createSignal<HTMLInputElement>();
	return (
		<button
			class={`${styles.button} ${styles.shiftLeft}`}
			onClick={() => ref()?.click()}
		>
			<Download />
			{t('optionsImportEdited')}
			<input
				hidden={true}
				ref={setRef}
				type="file"
				accept=".json"
				onChange={(e) => pushEdits(e, props.editWrapper, props.mutate)}
			/>
		</button>
	);
}

/**
 * Reads an imported .json file and import the edits to storage
 */
function pushEdits(
	e: Event & {
		currentTarget: HTMLInputElement;
		target: Element;
	},
	editWrapper: EditWrapper,
	mutate: EditSetter,
) {
	const file = e.currentTarget.files?.[0];
	if (!file) {
		return;
	}
	const reader = new FileReader();
	reader.addEventListener(
		'load',
		(arg) =>
			void (async (e) => {
				const edits = JSON.parse(
					e.target?.result as string,
				) as RegexEdit[];
				const oldEdits = await editWrapper.get();
				const newEdits =
					oldEdits instanceof Array
						? [...(oldEdits ?? []), ...edits]
						: {
								...oldEdits,
								...edits,
							};
				editWrapper.set(newEdits);
				mutate(newEdits);
			})(arg),
	);
	reader.readAsText(file);
}

/**
 * Reads an imported .json file and import the blocklist to storage
 */
function pushBlocklist(
	e: Event & {
		currentTarget: HTMLInputElement;
		target: Element;
	},
	blocklistWrapper: StorageWrapper<typeof BrowserStorage.BLOCKLISTS>,
	connector: ConnectorMeta,
	mutate: Setter<Blocklists | null | undefined>,
) {
	const file = e.currentTarget.files?.[0];
	if (!file) {
		return;
	}
	const reader = new FileReader();
	reader.addEventListener(
		'load',
		(arg) =>
			void (async (e) => {
				const newBlocklist = JSON.parse(
					e.target?.result as string,
				) as Record<string, string>;
				let blocklists = await blocklistWrapper.get();
				if (!blocklists) {
					blocklists = {};
				}
				if (!blocklists[connector.id]) {
					blocklists[connector.id] = {};
				}
				blocklists[connector.id] = {
					...blocklists[connector.id],
					...newBlocklist,
				};
				blocklistWrapper.set(blocklists);
				mutate(blocklists);
			})(arg),
	);
	reader.readAsText(file);
}
