import ClonedSong from '@/core/object/cloned-song';
import styles from './popup.module.scss';
import Check from '@suid/icons-material/CheckOutlined';
import Close from '@suid/icons-material/CloseOutlined';

import { t } from '@/util/i18n';
import {
	Match,
	Resource,
	Show,
	Switch,
	createEffect,
	createSignal,
} from 'solid-js';
import {
	EditedFields,
	FieldType,
	RegexFields,
	getProcessedFieldsNoRegex,
	getSongFieldNoRegex,
	pascalCaseField,
	replaceFields,
	searchMatches,
} from '@/util/regex';
import { ManagerTab } from '@/core/storage/wrapper';
import regexEdits from '@/core/storage/regex-edits';
import { sendBackgroundMessage } from '@/util/communication';

const [searches, setSearches] = createSignal({
	track: null,
	artist: null,
	album: null,
	albumArtist: null,
} as RegexFields);
const [replaces, setReplaces] = createSignal({
	track: null,
	artist: null,
	album: null,
	albumArtist: null,
} as RegexFields);
const [previews, setPreviews] = createSignal({
	track: '',
	artist: '',
	album: '',
	albumArtist: '',
} as EditedFields);

/**
 * Regex editing popup
 */
export default function Regex(props: {
	clonedSong: ClonedSong;
	tab: Resource<ManagerTab>;
}) {
	return (
		<div class={styles.regexContainer}>
			<span class={styles.searchLabel}>{t('infoSearchLabel')}</span>
			<span class={styles.replaceLabel}>{t('infoReplaceLabel')}</span>
			<span class={styles.previewLabel}>{t('infoPreviewLabel')}</span>
			<Entry clonedSong={props.clonedSong} type="track" />
			<Entry clonedSong={props.clonedSong} type="artist" />
			<Entry clonedSong={props.clonedSong} type="album" />
			<Entry clonedSong={props.clonedSong} type="albumArtist" />
			<Footer tab={props.tab} clonedSong={props.clonedSong} />
		</div>
	);
}

/**
 * Label, inputs, and preview for a single song field.
 */
function Entry(props: { clonedSong: ClonedSong; type: FieldType }) {
	const { clonedSong, type } = props;
	setPreviews((prev) => ({
		...prev,
		[type]: getSongFieldNoRegex(clonedSong, type),
	}));

	createEffect(() => {
		setPreviews(() =>
			replaceFields(
				searches(),
				replaces(),
				getProcessedFieldsNoRegex(clonedSong)
			)
		);
	});

	return (
		<>
			<span class={`${styles[`${type}Label`]} ${styles.entryLabel}`}>
				{t(`info${pascalCaseField(type)}Label`)}
			</span>
			<SearchField type={type} clonedSong={clonedSong} />
			<input
				type="text"
				class={styles[`${type}Replace`]}
				onInput={(e) =>
					setReplaces((prev) => ({
						...prev,
						[type]: e.currentTarget.value || null,
					}))
				}
			/>
			<span class={styles[`${type}Preview`]}>{previews()[type]}</span>
		</>
	);
}

/**
 * A single search input for a single song property.
 */
function SearchField(props: { type: FieldType; clonedSong: ClonedSong }) {
	const { type, clonedSong } = props;
	return (
		<div class={`${styles[`${type}Search`]} ${styles.searchWrapper}`}>
			<input
				type="text"
				class={styles.searchField}
				onInput={(e) =>
					setSearches((prev) => ({
						...prev,
						[type]: e.currentTarget.value || null,
					}))
				}
			/>
			<Switch
				fallback={
					<Close
						class={`${styles.regexTest} ${styles.regexFailure}`}
					/>
				}
			>
				<Match when={!searches()[type]}>
					<></>
				</Match>
				<Match
					when={searchMatches(
						searches()[type],
						getSongFieldNoRegex(clonedSong, type)
					)}
				>
					<Check
						class={`${styles.regexTest} ${styles.regexSuccess}`}
					/>
				</Match>
			</Switch>
		</div>
	);
}

/**
 * Footer of regex edit popup, allows the user to submit, and displays a warning if edit exists already.
 */
function Footer(props: { tab: Resource<ManagerTab>; clonedSong: ClonedSong }) {
	return (
		<div class={styles.regexFooter}>
			<Show when={props.clonedSong.flags.isCorrectedByUser}>
				<span class={styles.editWarning}>{t('infoEditedWarning')}</span>
			</Show>
			<div class={styles.controlButtons}>
				<button
					class={styles.controlButton}
					title={t('infoSubmitTitle')}
					onClick={() => {
						saveEdit(props.tab);
					}}
				>
					<Check />
				</button>
			</div>
		</div>
	);
}

/**
 * Save edit to storage
 * @param tab - tab data of the tab whose data is being edited
 * @param clonedSong - cloned song from the tab
 * @param data - the new song data to edit to
 */
async function saveEdit(tab: Resource<ManagerTab>) {
	await regexEdits.saveRegexEdit(searches(), replaces());
	sendBackgroundMessage(tab()?.tabId ?? -1, {
		type: 'reprocessSong',
		payload: undefined,
	});
}
