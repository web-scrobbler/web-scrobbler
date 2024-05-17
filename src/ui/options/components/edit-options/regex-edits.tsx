import { t } from '@/util/i18n';
import type { Setter } from 'solid-js';
import { For, Show, createMemo, createResource } from 'solid-js';
import * as BrowserStorage from '@/core/storage/browser-storage';
import styles from '../components.module.scss';
import {
	CaseSensitiveOutlined,
	DeleteOutlined,
	RegexOutlined,
	WholeWordOutlined,
} from '@/ui/components/icons';
import type { FieldType, RegexEdit } from '@/util/regex';
import { pascalCaseField } from '@/util/regex';
import { ExportEdits, ImportEdits, ViewEdits } from './util';
import type { ModalType } from '../navigator';

const regexEdits = BrowserStorage.getStorage(BrowserStorage.REGEX_EDITS);

/**
 * Component that allows the user to see, import, and export track metadata edits.
 */
export default function RegexEdits(props: {
	setActiveModal: Setter<ModalType>;
	modal: HTMLDialogElement | undefined;
}) {
	return (
		<>
			<h2>{t('optionsRegexEdits')}</h2>
			<p>{t('optionsRegexEditsDesc')}</p>
			<div
				class={styles.buttonContainer}
				role="group"
				aria-label={t('optionsRegexEdits')}
			>
				<ViewEdits
					setActiveModal={props.setActiveModal}
					modal={props.modal}
					type={'regexEdits'}
				/>
				<ExportEdits
					editWrapper={regexEdits}
					filename="regex-edits.json"
				/>
				<ImportEdits editWrapper={regexEdits} />
			</div>
		</>
	);
}

/**
 * Component that shows all the currently registered track edits and allows the user to delete them.
 * To be displayed in a modal.
 */
export function RegexEditsModal() {
	const [edits, { mutate }] = createResource(regexEdits.get.bind(regexEdits));
	return (
		<>
			<h1>
				{t(
					'optionsRegexEditsPopupTitle',
					(edits() ?? []).length.toString(),
				)}
			</h1>
			<ul class={styles.optionList}>
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
	const label = createMemo(
		() =>
			`${props.edit.search.track} → ${props.edit.replace.track};${props.edit.search.artist} → ${props.edit.replace.artist};${props.edit.search.album} → ${props.edit.replace.album};${props.edit.search.albumArtist} → ${props.edit.replace.albumArtist}`,
	);
	return (
		<li class={styles.deleteListing}>
			<button
				class={`${styles.button} ${styles.small} ${styles.marginRight}`}
				onClick={(event) => {
					event.stopPropagation();
					const index = props.index;
					props.mutate((e) => {
						if (!e) {
							return e;
						}
						const o = e.filter((_, i) => i !== index);
						regexEdits.set(o);
						return o;
					});
				}}
				title={label()}
			>
				<DeleteOutlined />
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
				<Flags edit={props.edit} />
			</div>
		</li>
	);
}

/**
 * Component that returns the grid entry for regex flags
 */
function Flags(props: { edit: RegexEdit }) {
	return (
		<div class={styles.regexDeleteFlags}>
			<Show when={!props.edit.isRegexDisabled}>
				<RegexOutlined
					title={t('infoUseRegex')}
					class={styles.regexEditEntry}
				/>
			</Show>
			<Show when={!props.edit.isCaseInsensitive}>
				<CaseSensitiveOutlined
					title={t('infoMatchCase')}
					class={styles.regexEditEntry}
				/>
			</Show>
			<Show when={!props.edit.isGlobal}>
				<WholeWordOutlined
					title={t('infoMatchWholeTag')}
					class={styles.regexEditEntry}
				/>
			</Show>
		</div>
	);
}

/**
 * Component that returns the grid entries for a single field of regex search/replace
 */
function Entry(props: { edit: RegexEdit; type: FieldType }) {
	return (
		<>
			<span
				class={`${
					styles[`regexDelete${pascalCaseField(props.type)}Label`]
				} ${styles.regexEditEntry}`}
			>
				{t(`info${pascalCaseField(props.type)}Label`)}
			</span>
			<span
				class={`${
					styles[`regexDelete${pascalCaseField(props.type)}Search`]
				} ${styles.regexEditEntry}`}
			>
				{props.edit.search[props.type]}
			</span>
			<span
				class={`${
					styles[`regexDelete${pascalCaseField(props.type)}Replace`]
				} ${styles.regexEditEntry}`}
			>
				{props.edit.replace[props.type]}
			</span>
		</>
	);
}
