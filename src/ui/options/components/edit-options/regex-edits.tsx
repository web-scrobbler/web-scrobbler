import { t } from '@/util/i18n';
import { For, Setter, createResource, createSignal } from 'solid-js';
import * as BrowserStorage from '@/core/storage/browser-storage';
import styles from '../components.module.scss';
import Download from '@suid/icons-material/DownloadOutlined';
import Upload from '@suid/icons-material/UploadOutlined';
import Visibility from '@suid/icons-material/VisibilityOutlined';
import Delete from '@suid/icons-material/DeleteOutlined';
import { FieldType, RegexEdit, pascalCaseField } from '@/util/regex';

const regexEdits = BrowserStorage.getStorage(BrowserStorage.REGEX_EDITS);

/**
 * Component that allows the user to see, import, and export track metadata edits.
 */
export default function RegexEdits(props: {
	setActiveModal: Setter<string>;
	modal: HTMLDialogElement | undefined;
}) {
	return (
		<>
			<h2>{t('optionsRegexEdits')}</h2>
			<p>{t('optionsRegexEditsDesc')}</p>
			<div class={styles.buttonContainer}>
				<ViewEdits
					setActiveModal={props.setActiveModal}
					modal={props.modal}
				/>
				<ExportEdits />
				<ImportEdits />
			</div>
		</>
	);
}

const [edits, { mutate }] = createResource(regexEdits.get.bind(regexEdits));

/**
 * Component that shows all the currently registered track edits and allows the user to delete them.
 * To be displayed in a modal.
 */
export function RegexEditsModal() {
	return (
		<>
			<h1>
				{t(
					'optionsRegexEditsPopupTitle',
					(edits() ?? []).length.toString()
				)}
			</h1>
			<ul>
				<For each={[...(edits() ?? []).entries()]}>
					{([index, edit]) => (
						<EditInfo index={index} edit={edit} mutate={mutate} />
					)}
				</For>
			</ul>
		</>
	);
}

/**
 * Component that shows a single regex edit and allows the user to delete it.
 */
function EditInfo(props: {
	index: number;
	edit: RegexEdit;
	mutate: Setter<RegexEdit[] | null | undefined>;
}) {
	return (
		<li class={styles.deleteListing}>
			<button
				class={styles.deleteEditButton}
				onClick={() => {
					props.mutate((e) => {
						if (!e) return e;
						const o = e.filter((_, i) => i !== props.index);
						regexEdits.set(o);
						return o;
					});
				}}
			>
				<Delete />
			</button>
			<div class={styles.regexDeleteContent}>
				<span class={styles.regexDeleteSearchLabel}>
					{t('infoSearchLabel')}
				</span>
				<span class={styles.regexDeleteReplaceLabel}>
					{t('infoReplaceLabel')}
				</span>
				<Entry edit={props.edit} type={'track'} />
				<Entry edit={props.edit} type={'artist'} />
				<Entry edit={props.edit} type={'album'} />
				<Entry edit={props.edit} type={'albumArtist'} />
			</div>
		</li>
	);
}

/**
 * Component that returns the grid entries for a single field of regex search/replace
 */
function Entry(props: { edit: RegexEdit; type: FieldType }) {
	return (
		<>
			<span
				class={styles[`regexDelete${pascalCaseField(props.type)}Label`]}
			>
				{t(`info${pascalCaseField(props.type)}Label`)}
			</span>
			<span
				class={
					styles[`regexDelete${pascalCaseField(props.type)}Search`]
				}
			>
				{props.edit.search[props.type]}
			</span>
			<span
				class={
					styles[`regexDelete${pascalCaseField(props.type)}Replace`]
				}
			>
				{props.edit.replace[props.type]}
			</span>
		</>
	);
}

/**
 * Button that allows the user to open the modal that shows them their track edits
 */
function ViewEdits(props: {
	setActiveModal: Setter<string>;
	modal: HTMLDialogElement | undefined;
}) {
	return (
		<button
			class={styles.editButton}
			onClick={(e) => {
				e.stopImmediatePropagation();
				props.setActiveModal('regexEdits');
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
function ExportEdits() {
	return (
		<button class={styles.editButton} onClick={downloadEdits}>
			<Upload />
			{t('optionsExportEdited')}
		</button>
	);
}

/**
 * Compiles all the users track edits from storage and downloads them
 */
async function downloadEdits() {
	const edits = await regexEdits.get();
	if (!edits) return;
	const data = `data:text/json;base64,${btoa(JSON.stringify(edits))}`;
	const a = document.createElement('a');
	a.download = 'local-cache.json';
	a.href = data;
	a.click();
}

/**
 * Button that allows the user to upload a .json file and get edits from it.
 */
function ImportEdits() {
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
				onChange={pushEdits}
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
	}
) {
	const file = e.currentTarget.files?.[0];
	if (!file) return;
	const reader = new FileReader();
	reader.addEventListener('load', async (e) => {
		const edits = JSON.parse(e.target?.result as string);
		const oldEdits = await regexEdits.get();
		regexEdits.set([...(oldEdits ?? []), ...edits]);
	});
	reader.readAsText(file);
}
