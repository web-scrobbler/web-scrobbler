import { t } from '@/util/i18n';
import { For, Setter, createResource, createSignal } from 'solid-js';
import * as Options from '@/core/storage/options';
import * as BrowserStorage from '@/core/storage/browser-storage';
import styles from '../components.module.scss';
import Download from '@suid/icons-material/DownloadOutlined';
import Upload from '@suid/icons-material/UploadOutlined';
import Visibility from '@suid/icons-material/VisibilityOutlined';
import Delete from '@suid/icons-material/DeleteOutlined';

const localCache = BrowserStorage.getStorage(BrowserStorage.LOCAL_CACHE);

/**
 * Component that allows the user to see, import, and export track metadata edits.
 */
export default function EditedTracks(props: {
	setActiveModal: Setter<string>;
	modal: HTMLDialogElement | undefined;
}) {
	return (
		<>
			<h2>{t('optionsEditedTracks')}</h2>
			<p>{t('optionsEditedTracksDesc')}</p>
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

const [edits, { mutate }] = createResource(localCache.get.bind(localCache));

/**
 * Component that shows all the currently registered track edits and allows the user to delete them.
 * To be displayed in a modal.
 */
export function EditsModal() {
	return (
		<>
			<h1>
				{t(
					'optionsEditedTracksPopupTitle',
					Object.keys(edits() ?? {}).length.toString()
				)}
			</h1>
			<ul>
				<For each={Object.entries(edits() ?? {})}>
					{([key, value]) => (
						<TrackInfo key={key} track={value} mutate={mutate} />
					)}
				</For>
			</ul>
		</>
	);
}

/**
 * Component that shows a single track edit and allows the user to delete it.
 */
function TrackInfo(props: {
	key: string;
	track: Options.SavedEdit;
	mutate: Setter<{
		[key: string]: Options.SavedEdit;
	} | null>;
}) {
	return (
		<li class={styles.deleteListing}>
			<button
				class={styles.deleteEditButton}
				onClick={() => {
					props.mutate((e) => {
						if (!e) return e;
						delete e[props.key];
						localCache.set(e);
						return {
							...e,
						};
					});
				}}
			>
				<Delete />
			</button>
			<span>
				{props.track.artist} - {props.track.track}
			</span>
		</li>
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
				props.setActiveModal('savedEdits');
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
	const edits = await localCache.get();
	if (!edits) return;
	const blob = new Blob([JSON.stringify(edits)], {
		type: 'application/json',
	});
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = 'local-cache.json';
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
		const oldEdits = await localCache.get();
		localCache.set({
			...oldEdits,
			...edits,
		});
	});
	reader.readAsText(file);
}
