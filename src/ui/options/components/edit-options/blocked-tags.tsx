import { t } from '@/util/i18n';
import type { Setter } from 'solid-js';
import { For, createMemo, createResource } from 'solid-js';
import * as BrowserStorage from '@/core/storage/browser-storage';
import styles from '../components.module.scss';
import { DeleteOutlined } from '@/ui/components/icons';
import { ExportEdits, ImportEdits, ViewEdits } from './util';
import type { ModalType } from '../navigator';
import type { BlockedTags, BlockedTagsReference } from '@/core/storage/wrapper';
import { Dynamic } from 'solid-js/web';

const blocklist = BrowserStorage.getStorage(BrowserStorage.BLOCKED_TAGS);

/**
 * Component that allows the user to see, import, and export track metadata edits.
 */
export default function BlockedTagsElement(props: {
	setActiveModal: Setter<ModalType>;
	modal: HTMLDialogElement | undefined;
}) {
	return (
		<>
			<h2>{t('optionsBlockedTags')}</h2>
			<p>{t('optionsBlockedTagsDesc')}</p>
			<div class={styles.buttonContainer}>
				<ViewEdits
					setActiveModal={props.setActiveModal}
					modal={props.modal}
					type={'blockedTags'}
				/>
				<ExportEdits
					editWrapper={blocklist}
					filename="blocked-tags.json"
				/>
				<ImportEdits editWrapper={blocklist} />
			</div>
		</>
	);
}

/**
 * Component that shows all the currently blocked tags and allows the user to unblock them.
 * To be displayed in a modal.
 */
export function BlockedTagsModal() {
	const [edits, { mutate }] = createResource(blocklist.get.bind(blocklist));
	const formattedEdits = createMemo<BlockedTagsReference[]>(() => {
		const rawEdits = edits();
		const res: BlockedTagsReference[] = [];
		if (!rawEdits) {
			return res;
		}
		for (const [artist, value] of Object.entries(rawEdits)) {
			if (value.disabled) {
				res.push({
					type: 'artist',
					artist,
				});
			}
			for (const album of Object.keys(value.albums)) {
				res.push({
					type: 'album',
					artist,
					album,
				});
			}
			for (const track of Object.keys(value.tracks)) {
				res.push({
					type: 'track',
					artist,
					track,
				});
			}
		}
		return res;
	});
	return (
		<>
			<h1>
				{t(
					'optionsBlockedTagsPopupTitle',
					formattedEdits().length.toString(),
				)}
			</h1>
			<ul class={styles.optionList}>
				<For each={formattedEdits()}>
					{(blockedTag) => (
						<BlockedTagInfo tag={blockedTag} mutate={mutate} />
					)}
				</For>
			</ul>
		</>
	);
}

function getTagSpan(tag: BlockedTagsReference) {
	switch (tag.type) {
		case 'artist': {
			return (
				<span>
					{t('infoArtistLabel')}: {tag.artist}
				</span>
			);
		}
		case 'album': {
			return (
				<span>
					{t('infoAlbumLabel')}: {tag.artist} - {tag.album}
				</span>
			);
		}
		case 'track': {
			return (
				<span>
					{t('infoTrackLabel')}: {tag.artist} - {tag.track}
				</span>
			);
		}
	}
}

function BlockedTagInfo(props: {
	tag: BlockedTagsReference;
	mutate: Setter<BlockedTags | null | undefined>;
}) {
	return (
		<li class={styles.deleteListing}>
			<button
				class={`${styles.button} ${styles.small} ${styles.marginRight}`}
				onClick={(event) => {
					event.stopPropagation();
					const tag = props.tag;
					props.mutate((e) => {
						if (!e) {
							return e;
						}
						if (tag.type === 'artist') {
							delete e[tag.artist].disabled;
						} else if (tag.type === 'album') {
							delete e[tag.artist].albums[tag.album];
						} else {
							delete e[tag.artist].tracks[tag.track];
						}
						blocklist.set(e);
						return {
							...e,
						};
					});
				}}
			>
				<DeleteOutlined />
			</button>
			<Dynamic component={() => getTagSpan(props.tag)} />
		</li>
	);
}
