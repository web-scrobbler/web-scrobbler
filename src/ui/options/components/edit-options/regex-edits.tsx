import { t } from '@/util/i18n';
import { For, Setter, createResource } from 'solid-js';
import * as BrowserStorage from '@/core/storage/browser-storage';
import styles from '../components.module.scss';
import Delete from '@suid/icons-material/DeleteOutlined';
import { FieldType, RegexEdit, pascalCaseField } from '@/util/regex';
import { ExportEdits, ImportEdits, ViewEdits } from './util';
import { ModalType } from '../navigator';

const regexEdits = BrowserStorage.getStorage(BrowserStorage.REGEX_EDITS);
const [edits, { mutate }] = createResource(regexEdits.get.bind(regexEdits));

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
			<div class={styles.buttonContainer}>
				<ViewEdits
					setActiveModal={props.setActiveModal}
					modal={props.modal}
					type={'regexEdits'}
				/>
				<ExportEdits
					editWrapper={regexEdits}
					filename="regex-edits.json"
				/>
				<ImportEdits editWrapper={regexEdits} mutate={mutate} />
			</div>
		</>
	);
}

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
