import StorageWrapper, {
	BlockedTags,
	Blocklists,
} from '@/core/storage/wrapper';
import * as Options from '@/core/storage/options';
import * as BrowserStorage from '@/core/storage/browser-storage';
import {
	VisibilityOutlined,
	UploadOutlined,
	DownloadOutlined,
} from '@/ui/components/icons';
import styles from '../components.module.scss';
import { t } from '@/util/i18n';
import { Setter, createSignal } from 'solid-js';
import { RegexEdit } from '@/util/regex';
import { ModalType } from '../navigator';
import { ConnectorMeta } from '@/core/connectors';

type EditWrapper = StorageWrapper<
	| typeof BrowserStorage.REGEX_EDITS
	| typeof BrowserStorage.LOCAL_CACHE
	| typeof BrowserStorage.BLOCKED_TAGS
>;
type EditSetter = Setter<
	| {
			[key: string]: Options.SavedEdit;
	  }
	| RegexEdit[]
	| BlockedTags
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
			<VisibilityOutlined />
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
			<VisibilityOutlined />
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
			<UploadOutlined />
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
			<UploadOutlined />
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
			<DownloadOutlined />
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
export function ImportEdits(props: { editWrapper: EditWrapper }) {
	const [ref, setRef] = createSignal<HTMLInputElement>();
	return (
		<button
			class={`${styles.button} ${styles.shiftLeft}`}
			onClick={() => ref()?.click()}
		>
			<DownloadOutlined />
			{t('optionsImportEdited')}
			<input
				hidden={true}
				ref={setRef}
				type="file"
				accept=".json"
				onChange={(e) => pushEdits(e, props.editWrapper)}
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
				const edits = JSON.parse(e.target?.result as string) as
					| RegexEdit[]
					| BlockedTags
					| Record<string, Options.SavedEdit>;

				const oldEdits = await editWrapper.get();

				if (oldEdits instanceof Array && edits instanceof Array) {
					const newEdits = [...(oldEdits ?? []), ...edits];
					editWrapper.set(newEdits);
				} else if (isSavedEdits(oldEdits) && isSavedEdits(edits)) {
					const newEdits = { ...(oldEdits || {}), ...edits };
					editWrapper.set(newEdits);
				} else if (isBlockedTags(oldEdits) && isBlockedTags(edits)) {
					const newEdits = { ...oldEdits };
					for (const [artist, value] of Object.entries(edits)) {
						if (!(artist in newEdits)) {
							newEdits[artist] = value;
							continue;
						}
						newEdits[artist].albums = {
							...newEdits[artist].albums,
							...edits[artist].albums,
						};
						newEdits[artist].tracks = {
							...newEdits[artist].tracks,
							...edits[artist].tracks,
						};
						if (
							newEdits[artist].disabled ||
							edits[artist].disabled
						) {
							newEdits[artist].disabled = true;
						}
					}
					editWrapper.set(newEdits);
				}
			})(arg),
	);
	reader.readAsText(file);
}

function isSavedEdits(
	edits: BlockedTags | Record<string, Options.SavedEdit> | RegexEdit[] | null,
): edits is Record<string, Options.SavedEdit> {
	if (edits === null || edits instanceof Array) {
		return false;
	}
	const keys = Object.keys(edits);
	// if no keys we cannot know which it is but it also doesn't matter, just allow it to be both, it won't error
	if (keys.length === 0) {
		return true;
	}
	if ('artist' in edits[keys[0]]) {
		return true;
	}
	return false;
}

function isBlockedTags(
	edits: BlockedTags | Record<string, Options.SavedEdit> | RegexEdit[] | null,
): edits is BlockedTags {
	if (edits === null || edits instanceof Array) {
		return false;
	}
	const keys = Object.keys(edits);
	// if no keys we cannot know which it is but it also doesn't matter, just allow it to be both, it won't error
	if (keys.length === 0) {
		return true;
	}
	if ('albums' in edits[keys[0]]) {
		return true;
	}
	return false;
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
