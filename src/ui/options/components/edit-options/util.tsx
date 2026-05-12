import type { BlockedTags, Blocklists } from '@/core/storage/wrapper';
import type StorageWrapper from '@/core/storage/wrapper';
import type * as Options from '@/core/storage/options';
import type * as BrowserStorage from '@/core/storage/browser-storage';
import {
	VisibilityOutlined,
	UploadOutlined,
	DownloadOutlined,
} from '@/ui/components/icons';
import styles from '../components.module.scss';
import { t } from '@/util/i18n';
import type { JSX, Setter } from 'solid-js';
import { createSignal } from 'solid-js';
import type { ModalType } from '../modal-type';
import type { ConnectorMeta } from '@/core/connectors';

type EditKeys =
	| typeof BrowserStorage.REGEX_EDITS
	| typeof BrowserStorage.LOCAL_CACHE
	| typeof BrowserStorage.BLOCKED_TAGS;
type EditWrapper = { [P in EditKeys]: StorageWrapper<P> }[EditKeys];

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
export function ImportEdits(props: {
	editWrapper: EditWrapper;
	setUploadStatus: Setter<JSX.Element>;
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
				onChange={async (e) => {
					const file = e.currentTarget.files?.[0];
					if (!file) {
						return;
					}
					try {
						const fileText = await readInputFile(file);
						const edits = JSON.parse(fileText);
						await pushEdits(edits, props.editWrapper);
						void props.setUploadStatus(<p>{t('importSuccess')}</p>);
					} catch (err) {
						void props.setUploadStatus(
							<p>{t('importError', `${err}`)}</p>,
						);
						throw err;
					}
				}}
			/>
		</button>
	);
}

/**
 * Reads an imported .json file and import the edits to storage
 */
async function pushEdits(edits: unknown, editWrapper: EditWrapper) {
	switch (editWrapper.namespace) {
		case 'BlockedTags': {
			assertIsBlockedTags(edits);
			const oldEdits = await editWrapper.getLocking();
			const newEdits = oldEdits ?? {};
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
				if (newEdits[artist].disabled || edits[artist].disabled) {
					newEdits[artist].disabled = true;
				}
			}
			await editWrapper.setLocking(newEdits);
			break;
		}
		case 'RegexEdits': {
			if (!(edits instanceof Array)) {
				throw new Error('file not top-level Array');
			}
			const oldEdits = await editWrapper.getLocking();
			const newEdits = [...(oldEdits ?? []), ...edits];
			await editWrapper.setLocking(newEdits);
			break;
		}
		case 'LocalCache': {
			assertIsSavedEdits(edits);
			const oldEdits = await editWrapper.getLocking();
			const newEdits = { ...(oldEdits || {}), ...edits };
			await editWrapper.setLocking(newEdits);
		}
	}
}

function assertIsSavedEdits(
	edits: unknown,
): asserts edits is Record<string, Options.SavedEdit> {
	const errorMsg = 'Saved Edits import data malformed';
	if (edits === null || edits instanceof Array) {
		throw new Error(errorMsg);
	}
	const keys = Object.keys(edits);
	// if no keys we cannot know which it is but it also doesn't matter, just allow it to be both, it won't error
	if (keys.length === 0) {
		return;
	}
	if ('artist' in edits[keys[0]]) {
		return;
	}
	throw new Error(errorMsg);
}

function assertIsBlockedTags(edits: unknown): asserts edits is BlockedTags {
	const errorMsg = 'Blocked Tags import data malformed';
	if (edits === null || edits instanceof Array) {
		throw new Error(errorMsg);
	}
	const keys = Object.keys(edits);
	// if no keys we cannot know which it is but it also doesn't matter, just allow it to be both, it won't error
	if (keys.length === 0) {
		return;
	}
	if ('albums' in edits[keys[0]]) {
		return;
	}
	throw new Error(errorMsg);
}

/**
 * Reads an imported .json file and import the blocklist to storage
 */
async function pushBlocklist(
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
	const fileText = await readInputFile(file);
	const newBlocklist = JSON.parse(fileText);
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
	await blocklistWrapper.set(blocklists);
	mutate(blocklists);
}

/**
 * Reads an imported .json file
 */
function readInputFile(file: File): Promise<string> {
	return new Promise<string>((res, rej) => {
		const reader = new FileReader();
		reader.addEventListener('load', () => {
			// we call readAsText so it **will** be a string on 'load'
			res(reader.result as string);
		});
		reader.addEventListener('error', () => {
			// it **will** be a DOMException on 'error'
			const readError = reader.error!;
			const errorMessage = t('uploadFailed', [
				readError.name,
				readError.message,
			]);
			rej(new Error(errorMessage));
		});
		reader.readAsText(file);
	});
}
