import ClonedSong from '@/core/object/cloned-song';
import styles from './popup.module.scss';
import Check from '@suid/icons-material/CheckOutlined';
import Close from '@suid/icons-material/CloseOutlined';

import { t } from '@/util/i18n';
import {
	JSXElement,
	Match,
	Resource,
	Show,
	Switch,
	createEffect,
	createMemo,
	createResource,
	createSignal,
	onMount,
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
import ContextMenu from '../components/context-menu/context-menu';
import {
	Navigator,
	getMobileNavigatorGroup,
} from '../options/components/navigator';
import { isIos } from '../components/util';

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
	clonedSong: ClonedSong | undefined;
	tab: Resource<ManagerTab>;
}) {
	return (
		<div
			class={styles.regexContainer}
			onKeyDown={(event) => {
				if (event.key === 'Enter' && !event.isComposing) {
					saveEdit(props.tab);
				}
			}}
		>
			<Show when={!isIos()}>
				<span class={styles.searchLabel}>{t('infoSearchLabel')}</span>
				<span class={styles.replaceLabel}>{t('infoReplaceLabel')}</span>
				<span class={styles.previewLabel}>{t('infoPreviewLabel')}</span>
			</Show>
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
function Entry(props: { clonedSong: ClonedSong | undefined; type: FieldType }) {
	onMount(() => {
		const type = props.type;
		const clonedSong = props.clonedSong;
		setPreviews((prev) => ({
			...prev,
			[type]: getSongFieldNoRegex(clonedSong, type),
		}));
	});

	createEffect(() => {
		setPreviews(() =>
			replaceFields(
				searches(),
				replaces(),
				getProcessedFieldsNoRegex(props.clonedSong),
			),
		);
	});

	return (
		<EntryWrapper type={props.type}>
			<Show when={!isIos()}>
				<span
					class={`${styles[`${props.type}Label`]} ${
						styles.entryLabel
					}`}
				>
					{t(`info${pascalCaseField(props.type)}Label`)}
				</span>
			</Show>
			<SearchField type={props.type} clonedSong={props.clonedSong} />
			<ReplaceField type={props.type} />
			<PreviewOutput type={props.type} />
		</EntryWrapper>
	);
}

/**
 * Wrapper for an entry that shows a fieldset on iOS and just the inputs on other platforms.
 */
function EntryWrapper(props: { type: FieldType; children: JSXElement }) {
	return (
		<Show when={isIos()} fallback={props.children}>
			<fieldset class={styles.entryWrapper}>
				<legend class={styles.entryWrapperLegend}>
					{t(`info${pascalCaseField(props.type)}Label`)}
				</legend>
				{props.children}
			</fieldset>
		</Show>
	);
}

/**
 * A single search input for a single song property.
 */
function SearchField(props: {
	type: FieldType;
	clonedSong: ClonedSong | undefined;
}) {
	return (
		<div class={`${styles[`${props.type}Search`]} ${styles.searchWrapper}`}>
			<Show when={isIos()}>
				<label
					for={`${props.type}SearchInput`}
					class={styles.iosSearchLabel}
				>
					{t('infoSearchLabel')}
				</label>
			</Show>
			<input
				id={`${props.type}SearchInput`}
				type="text"
				class={styles.searchField}
				onInput={(e) =>
					setSearches((prev) => ({
						...prev,
						[props.type]: e.currentTarget.value || null,
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
				<Match when={!searches()[props.type]}>
					<></>
				</Match>
				<Match
					when={searchMatches(
						searches()[props.type],
						getSongFieldNoRegex(props.clonedSong, props.type),
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
 * A single replace input for a single song property.
 */
function ReplaceField(props: { type: FieldType }) {
	return (
		<>
			<Show when={isIos()}>
				<label
					for={`${props.type}ReplaceInput`}
					class={styles.iosReplaceLabel}
				>
					{t('infoReplaceLabel')}
				</label>
			</Show>
			<input
				id={`${props.type}ReplaceInput`}
				type="text"
				class={styles[`${props.type}Replace`]}
				onInput={(e) =>
					setReplaces((prev) => ({
						...prev,
						[props.type]: e.currentTarget.value || null,
					}))
				}
			/>
		</>
	);
}

/**
 * Preview of a single song property.
 */
function PreviewOutput(props: { type: FieldType }) {
	return (
		<>
			<Show when={isIos()}>
				<label
					for={`${props.type}PreviewOutput`}
					class={styles.iosPreviewLabel}
				>
					{t('infoPreviewLabel')}
				</label>
			</Show>
			<output
				id={`${props.type}PreviewOutput`}
				class={styles[`${props.type}Preview`]}
			>
				{previews()[props.type]}
			</output>
		</>
	);
}

/**
 * Footer of regex edit popup, allows the user to submit, and displays a warning if edit exists already.
 */
function Footer(props: {
	tab: Resource<ManagerTab>;
	clonedSong: ClonedSong | undefined;
}) {
	return (
		<div class={styles.regexFooter}>
			<Show when={props.clonedSong?.flags.isCorrectedByUser}>
				<span class={styles.editWarning}>{t('infoEditedWarning')}</span>
			</Show>
			<Show when={!isIos()}>
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
			</Show>
		</div>
	);
}

/**
 * Component for the context menu of regex edit
 */
export function RegexEditContextMenu(props: { tab: Resource<ManagerTab> }) {
	const [navigatorResource] = createResource(getMobileNavigatorGroup);
	const items = createMemo(() => {
		const items: Navigator = [
			{
				namei18n: 'infoSubmitTitleShort',
				icon: Check,
				action: () => void saveEdit(props.tab),
			},
		];
		if (!navigatorResource.loading) {
			const navigatorGroup = navigatorResource();
			if (navigatorGroup) {
				items.push(navigatorGroup);
			}
		}
		return items;
	});

	return <ContextMenu items={items()} />;
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
