import StorageWrapper from '@/core/storage/wrapper';
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

type EditWrapper = StorageWrapper<
	typeof BrowserStorage.REGEX_EDITS | typeof BrowserStorage.LOCAL_CACHE
>;
type EditSetter = Setter<
	| {
			[key: string]: Options.SavedEdit;
	  }
	| {
			[key: string]: RegexEdit[];
	  }
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
			class={styles.editButton}
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
			class={styles.editButton}
			onClick={() => downloadEdits(props.editWrapper, props.filename)}
		>
			<Upload />
			{t('optionsExportEdited')}
		</button>
	);
}

/**
 * Compiles all the users track edits from storage and downloads them
 */
async function downloadEdits(editWrapper: EditWrapper, filename: string) {
	const edits = await editWrapper.get();
	if (!edits) return;
	const data = `data:text/json;charset=UTF-8,${encodeURIComponent(
		JSON.stringify(edits)
	)}`;
	const a = document.createElement('a');
	a.download = filename;
	a.href = data;
	a.click();
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
		<button class={styles.editButton} onClick={() => ref()?.click()}>
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
	mutate: EditSetter
) {
	const file = e.currentTarget.files?.[0];
	if (!file) return;
	const reader = new FileReader();
	reader.addEventListener('load', async (e) => {
		const edits = JSON.parse(e.target?.result as string);
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
	});
	reader.readAsText(file);
}
