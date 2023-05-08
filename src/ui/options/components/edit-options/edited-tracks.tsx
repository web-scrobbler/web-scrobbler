import { t } from '@/util/i18n';
import { For, Setter, createResource } from 'solid-js';
import * as Options from '@/core/storage/options';
import * as BrowserStorage from '@/core/storage/browser-storage';
import styles from '../components.module.scss';
import Delete from '@suid/icons-material/DeleteOutlined';
import { ExportEdits, ImportEdits, ViewEdits } from './util';
import { ModalType } from '../navigator';

const localCache = BrowserStorage.getStorage(BrowserStorage.LOCAL_CACHE);
const [edits, { mutate }] = createResource(localCache.get.bind(localCache));

/**
 * Component that allows the user to see, import, and export track metadata edits.
 */
export default function EditedTracks(props: {
	setActiveModal: Setter<ModalType>;
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
					type={'savedEdits'}
				/>
				<ExportEdits
					editWrapper={localCache}
					filename="local-cache.json"
				/>
				<ImportEdits editWrapper={localCache} mutate={mutate} />
			</div>
		</>
	);
}

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
