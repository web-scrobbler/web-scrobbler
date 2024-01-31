import ClonedSong from '@/core/object/cloned-song';
import styles from './popup.module.scss';
import {
	Album,
	AlbumOff,
	CheckOutlined,
	CloseOutlined,
	MusicOff,
	MusicNote,
	PersonOff,
	Person,
} from '@/ui/components/icons';

import { t } from '@/util/i18n';
import {
	JSXElement,
	Match,
	Resource,
	Setter,
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
import { BlockedTagType, ManagerTab } from '@/core/storage/wrapper';
import regexEdits from '@/core/storage/regex-edits';
import { sendBackgroundMessage } from '@/util/communication';
import ContextMenu from '../components/context-menu/context-menu';
import {
	Navigator,
	getMobileNavigatorGroup,
} from '../options/components/navigator';
import { isIos } from '../components/util';
import BlockedTags from '@/core/storage/blocked-tags';
import componentStyles from '@/ui/options/components/components.module.scss';

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
const blockedTags = new BlockedTags();

/**
 * Regex editing popup
 */
export default function Regex(props: {
	clonedSong: ClonedSong | undefined;
	tab: Resource<ManagerTab>;
}) {
	const song = createMemo(() => props.clonedSong);
	const [blockedTypes] = createResource(() =>
		blockedTags.getBlockedTypes(song()),
	);
	const [maxCellWidth, setMaxCellWidth] = createSignal(0);
	const [regexContainer, setRegexContainer] = createSignal<HTMLDivElement>();
	createEffect(() => {
		regexContainer()?.style.setProperty(
			'--max-cell-width',
			`${maxCellWidth()}px`,
		);
	});

	return (
		<div
			class={styles.regexContainer}
			onKeyDown={(event) => {
				if (event.key === 'Enter' && !event.isComposing) {
					saveEdit(props.tab);
				}
			}}
			ref={setRegexContainer}
		>
			<Show when={!isIos()}>
				<div class={styles.entryWrapper}>
					<span />
					<span class={styles.searchLabel}>
						{t('infoSearchLabel')}
					</span>
					<span class={styles.replaceLabel}>
						{t('infoReplaceLabel')}
					</span>
					<span class={styles.previewLabel}>
						{t('infoPreviewLabel')}
					</span>
				</div>
			</Show>
			<Entry
				blockedTypes={blockedTypes}
				tabId={props.tab()?.tabId}
				setMaxCellWidth={setMaxCellWidth}
				clonedSong={props.clonedSong}
				type="track"
				UnblockIcon={() => <MusicNote />}
				BlockIcon={() => <MusicOff />}
			/>
			<Entry
				blockedTypes={blockedTypes}
				tabId={props.tab()?.tabId}
				setMaxCellWidth={setMaxCellWidth}
				clonedSong={props.clonedSong}
				type="artist"
				UnblockIcon={() => <Person />}
				BlockIcon={() => <PersonOff />}
			/>
			<Entry
				blockedTypes={blockedTypes}
				tabId={props.tab()?.tabId}
				setMaxCellWidth={setMaxCellWidth}
				clonedSong={props.clonedSong}
				type="album"
				UnblockIcon={() => <Album />}
				BlockIcon={() => <AlbumOff />}
			/>
			<Entry
				blockedTypes={blockedTypes}
				tabId={props.tab()?.tabId}
				setMaxCellWidth={setMaxCellWidth}
				clonedSong={props.clonedSong}
				type="albumArtist"
				UnblockIcon={() => <Person />}
				BlockIcon={() => <PersonOff />}
			/>
			<Footer
				blockedTypes={blockedTypes}
				tab={props.tab}
				clonedSong={props.clonedSong}
			/>
		</div>
	);
}

/**
 * Label, inputs, and preview for a single song field.
 */
function Entry(props: {
	blockedTypes: Resource<{
		artist: boolean;
		album: boolean;
		track: boolean;
	}>;
	tabId: number | undefined;
	clonedSong: ClonedSong | undefined;
	UnblockIcon: () => JSXElement;
	BlockIcon: () => JSXElement;
	type: FieldType;
	setMaxCellWidth: Setter<number>;
}) {
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

	const [pcLabel, setPcLabel] = createSignal<HTMLSpanElement>();
	createEffect(() => {
		const curWidth = pcLabel()?.clientWidth ?? 0;
		props.setMaxCellWidth((prevMax) => Math.max(prevMax, curWidth));
	});

	return (
		<EntryWrapper
			blockedTypes={props.blockedTypes}
			tabId={props.tabId}
			clonedSong={props.clonedSong}
			UnblockIcon={props.UnblockIcon}
			BlockIcon={props.BlockIcon}
			type={props.type}
		>
			<Show when={!isIos()}>
				<span class={styles.entryLabel} ref={setPcLabel}>
					{t(`info${pascalCaseField(props.type)}Label`)}
				</span>
			</Show>
			<SearchField type={props.type} clonedSong={props.clonedSong} />
			<ReplaceField type={props.type} />
			<PreviewOutput type={props.type} />
		</EntryWrapper>
	);
}

function BlockTagButtonIOS(props: {
	blockedTypes: Resource<{
		artist: boolean;
		album: boolean;
		track: boolean;
	}>;
	type: FieldType;
	tabId: number | undefined;
	clonedSong: ClonedSong | undefined;
	UnblockIcon: () => JSXElement;
	BlockIcon: () => JSXElement;
}) {
	const transformedType = createMemo(() => {
		if (props.type === 'albumArtist') {
			return 'artist';
		}
		return props.type;
	});
	return (
		<Show when={props.blockedTypes()}>
			{(loadedBlockedTypes) => (
				<button
					class={componentStyles.button}
					title={t(
						loadedBlockedTypes()[transformedType()]
							? `infoUnblock${pascalCaseField(transformedType())}`
							: `infoBlock${pascalCaseField(transformedType())}`,
					)}
					onClick={() => {
						const tabId = props.tabId;
						loadedBlockedTypes()[transformedType()]
							? blockedTags
									.removeFromBlocklist(
										transformedType(),
										props.clonedSong,
									)
									.then(() =>
										sendBackgroundMessage(tabId ?? -1, {
											type: 'reprocessSong',
											payload: undefined,
										}),
									)
							: blockedTags
									.addToBlocklist(
										transformedType(),
										props.clonedSong,
									)
									.then(() =>
										sendBackgroundMessage(tabId ?? -1, {
											type: 'reprocessSong',
											payload: undefined,
										}),
									);
					}}
				>
					<Show
						when={loadedBlockedTypes()[transformedType()]}
						fallback={
							<>
								<props.BlockIcon />
								{t(
									`infoBlock${pascalCaseField(
										transformedType(),
									)}`,
								)}
							</>
						}
					>
						<props.UnblockIcon />
						{t(`infoUnblock${pascalCaseField(transformedType())}`)}
					</Show>
				</button>
			)}
		</Show>
	);
}

/**
 * Wrapper for an entry that shows a fieldset on iOS and just the inputs on other platforms.
 */
function EntryWrapper(props: {
	blockedTypes: Resource<{
		artist: boolean;
		album: boolean;
		track: boolean;
	}>;
	tabId: number | undefined;
	clonedSong: ClonedSong | undefined;
	UnblockIcon: () => JSXElement;
	BlockIcon: () => JSXElement;
	type: FieldType;
	children: JSXElement;
}) {
	return (
		<Show
			when={isIos()}
			fallback={
				<div
					class={styles.entryWrapper}
					role="group"
					aria-label={t(`info${pascalCaseField(props.type)}Label`)}
				>
					{props.children}
				</div>
			}
		>
			<fieldset class={styles.entryWrapper}>
				<legend class={styles.entryWrapperLegend}>
					{t(`info${pascalCaseField(props.type)}Label`)}
				</legend>
				{props.children}
				<BlockTagButtonIOS
					blockedTypes={props.blockedTypes}
					tabId={props.tabId}
					clonedSong={props.clonedSong}
					UnblockIcon={props.UnblockIcon}
					BlockIcon={props.BlockIcon}
					type={props.type}
				/>
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
		<div class={styles.searchWrapper}>
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
				title={t('infoSearchLabel')}
			/>
			<Switch
				fallback={
					<CloseOutlined
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
					<CheckOutlined
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
				onInput={(e) =>
					setReplaces((prev) => ({
						...prev,
						[props.type]: e.currentTarget.value || null,
					}))
				}
				title={t('infoReplaceLabel')}
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
				title={t('infoPreviewLabel')}
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
	blockedTypes: Resource<{
		artist: boolean;
		album: boolean;
		track: boolean;
	}>;
}) {
	return (
		<div class={styles.regexFooter}>
			<Show when={props.clonedSong?.flags.isCorrectedByUser}>
				<span class={styles.editWarning}>{t('infoEditedWarning')}</span>
			</Show>
			<div class={styles.regexFooterButtons}>
				<Show when={!isIos()}>
					<div class={styles.controlButtons}>
						<button
							class={styles.controlButton}
							title={t('infoSubmitTitle')}
							onClick={() => {
								saveEdit(props.tab);
							}}
						>
							<CheckOutlined />
						</button>
						<Show when={props.blockedTypes()}>
							{(blockedTypesLoaded) => (
								<>
									<BlockTagButton
										isBlocked={blockedTypesLoaded().artist}
										type="artist"
										tabId={props.tab()?.tabId}
										clonedSong={props.clonedSong}
										UnblockIcon={() => <Person />}
										BlockIcon={() => <PersonOff />}
									/>
									<Show when={props.clonedSong?.getAlbum()}>
										<BlockTagButton
											isBlocked={
												blockedTypesLoaded().album
											}
											type="album"
											tabId={props.tab()?.tabId}
											clonedSong={props.clonedSong}
											UnblockIcon={() => <Album />}
											BlockIcon={() => <AlbumOff />}
										/>
									</Show>
									<BlockTagButton
										isBlocked={blockedTypesLoaded().track}
										type="track"
										tabId={props.tab()?.tabId}
										clonedSong={props.clonedSong}
										UnblockIcon={() => <MusicNote />}
										BlockIcon={() => <MusicOff />}
									/>
								</>
							)}
						</Show>
					</div>
				</Show>
			</div>
		</div>
	);
}

function BlockTagButton(props: {
	isBlocked: boolean;
	type: BlockedTagType;
	tabId: number | undefined;
	clonedSong: ClonedSong | undefined;
	UnblockIcon: () => JSXElement;
	BlockIcon: () => JSXElement;
}) {
	return (
		<button
			class={styles.controlButton}
			title={t(
				props.isBlocked
					? `infoUnblock${pascalCaseField(props.type)}`
					: `infoBlock${pascalCaseField(props.type)}`,
			)}
			onClick={() => {
				const tabId = props.tabId;
				props.isBlocked
					? blockedTags
							.removeFromBlocklist(props.type, props.clonedSong)
							.then(() =>
								sendBackgroundMessage(tabId ?? -1, {
									type: 'reprocessSong',
									payload: undefined,
								}),
							)
					: blockedTags
							.addToBlocklist(props.type, props.clonedSong)
							.then(() =>
								sendBackgroundMessage(tabId ?? -1, {
									type: 'reprocessSong',
									payload: undefined,
								}),
							);
			}}
		>
			<Show when={props.isBlocked} fallback={<props.BlockIcon />}>
				<props.UnblockIcon />
			</Show>
		</button>
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
				icon: CheckOutlined,
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
