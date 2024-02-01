import { t } from '@/util/i18n';
import type { Setter } from 'solid-js';
import { For, createMemo, createResource } from 'solid-js';
import type * as Options from '@/core/storage/options';
import styles from '../components.module.scss';
import { DeleteOutlined } from '@/ui/components/icons';
import { ExportEdits, ImportEdits, ViewEdits } from './util';
import type { ModalType } from '../navigator';
import * as BrowserStorage from '@/core/storage/browser-storage';

const localCache = BrowserStorage.getStorage(BrowserStorage.LOCAL_CACHE);

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
			<div
				class={styles.buttonContainer}
				role="group"
				aria-label={t('optionsEditedTracks')}
			>
				<ViewEdits
					setActiveModal={props.setActiveModal}
					modal={props.modal}
					type={'savedEdits'}
				/>
				<ExportEdits
					editWrapper={localCache}
					filename="local-cache.json"
				/>
				<ImportEdits editWrapper={localCache} />
			</div>
		</>
	);
}

/**
 * Component that shows all the currently registered track edits and allows the user to delete them.
 * To be displayed in a modal.
 */
export function EditsModal() {
	const [edits, { mutate }] = createResource(localCache.get.bind(localCache));
	return (
		<>
			<h1>
				{t(
					'optionsEditedTracksPopupTitle',
					Object.keys(edits() ?? {}).length.toString(),
				)}
			</h1>
			<ul class={styles.optionList}>
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
	mutate: Setter<
		| {
				[key: string]: Options.SavedEdit;
		  }
		| null
		| undefined
	>;
}) {
	const label = createMemo(
		() => `${props.track.artist} - ${props.track.track}`,
	);
	return (
		<li class={styles.deleteListing}>
			<button
				class={`${styles.button} ${styles.small} ${styles.marginRight}`}
				onClick={(event) => {
					event.stopPropagation();
					const key = props.key;
					props.mutate((e) => {
						if (!e) {
							return e;
						}
						delete e[key];
						localCache.set(e);
						return {
							...e,
						};
					});
				}}
				title={t('optionsDelete', label())}
			>
				<DeleteOutlined />
			</button>
			<span>{label()}</span>
		</li>
	);
}
