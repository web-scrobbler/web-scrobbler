import { t } from '@/util/i18n';
import { For, Setter, createResource } from 'solid-js';
import * as Options from '@/core/storage/options';
import * as BrowserStorage from '@/core/storage/browser-storage';
import styles from '../components.module.scss';
import Download from '@suid/icons-material/DownloadOutlined';
import Upload from '@suid/icons-material/UploadOutlined';
import Visibility from '@suid/icons-material/VisibilityOutlined';
import Delete from '@suid/icons-material/DeleteOutlined';

const localCache = BrowserStorage.getStorage(BrowserStorage.LOCAL_CACHE);

export default function EditedTracks(props: {
	setActiveModal: Setter<string>;
	modal: HTMLDialogElement | undefined;
}) {
	const { setActiveModal, modal } = props;
	return (
		<>
			<h2>{t('optionsEditedTracks')}</h2>
			<p>{t('optionsEditedTracksDesc')}</p>
			<div class={styles.buttonContainer}>
				<ViewEdits setActiveModal={setActiveModal} modal={modal} />
				<ExportEdits />
				<ImportEdits />
			</div>
		</>
	);
}

export function EditsModal() {
	const [edits, { mutate }] = createResource(localCache.get.bind(localCache));
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

function TrackInfo(props: {
	key: string;
	track: Options.SavedEdit;
	mutate: Setter<{
		[key: string]: Options.SavedEdit;
	} | null>;
}) {
	const { key, track, mutate } = props;
	return (
		<li class={styles.deleteListing}>
			<button
				class={styles.deleteEditButton}
				onClick={() => {
					mutate((e) => {
						if (!e) return e;
						delete e[key];
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
				{track.artist} - {track.track}
			</span>
		</li>
	);
}

function ViewEdits(props: {
	setActiveModal: Setter<string>;
	modal: HTMLDialogElement | undefined;
}) {
	const { setActiveModal, modal } = props;
	return (
		<button
			class={styles.editButton}
			onClick={(e) => {
				e.stopImmediatePropagation();
				setActiveModal('savedEdits');
				modal?.showModal();
			}}
		>
			<Visibility />
			{t('optionsViewEdited')}
		</button>
	);
}

function ExportEdits() {
	return (
		<button class={styles.editButton} onClick={downloadEdits}>
			<Upload />
			{t('optionsExportEdited')}
		</button>
	);
}

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

function ImportEdits() {
	return (
		<button
			class={styles.editButton}
			onClick={() =>
				(
					document.querySelector('#import-edits') as HTMLInputElement
				)?.click()
			}
		>
			<Download />
			{t('optionsImportEdited')}
			<input
				hidden={true}
				type="file"
				accept=".json"
				id="import-edits"
				onChange={pushEdits}
			/>
		</button>
	);
}

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
