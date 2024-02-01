import ClonedSong from '@/core/object/cloned-song';
import styles from './popup.module.scss';
import {
	Album,
	AlbumOff,
	CaseSensitiveOutlined,
	CheckOutlined,
	CloseOutlined,
	DeleteForeverOutlined,
	DeleteOutlined,
	MusicOff,
	MusicNote,
	PersonOff,
	Person,
	RegexOutlined,
	WholeWordOutlined,
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
import { createStore } from 'solid-js/store';
import {
	EditedFields,
	FieldType,
	RegexFields,
	RegexFlags,
	getProcessedFieldsNoRegex,
	getSongFieldNoRegex,
	pascalCaseField,
	processRegexFlags,
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

const [searches, setSearches] = createStore<RegexFields>({
	track: null,
	artist: null,
	album: null,
	albumArtist: null,
});
const [replaces, setReplaces] = createStore<RegexFields>({
	track: null,
	artist: null,
	album: null,
	albumArtist: null,
});
const [previews, setPreviews] = createStore<EditedFields>({
	track: '',
	artist: '',
	album: '',
	albumArtist: '',
});
const [flags, setFlags] = createStore<Record<keyof RegexFlags, boolean>>({
	isRegexDisabled: true,
	isCaseInsensitive: true,
	isGlobal: false,
});
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
			<Show when={isIos()}>
				<Flags />
			</Show>
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

function Flags() {
	return (
		<div
			class={styles.regexFlagsWrapper}
			role="group"
			aria-label={t('optionsOptions')}
		>
			<span>{t('optionsOptions')}</span>
			<RegexFlagCheckbox
				i18nTitle="infoUseRegex"
				icon={RegexOutlined}
				isInverted={true}
				flag="isRegexDisabled"
			/>
			<RegexFlagCheckbox
				i18nTitle="infoMatchCase"
				icon={CaseSensitiveOutlined}
				isInverted={true}
				flag="isCaseInsensitive"
			/>
			<RegexFlagCheckbox
				i18nTitle="infoMatchWholeTag"
				icon={WholeWordOutlined}
				isInverted={true}
				flag="isGlobal"
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
		setPreviews({
			[props.type]: getSongFieldNoRegex(props.clonedSong, props.type),
		});
	});
	createEffect(() => {
		setPreviews(() =>
			replaceFields(
				{
					search: searches,
					replace: replaces,
					...processRegexFlags(flags),
				},
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
		<div class={styles.regexFieldWrapper}>
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
				class={styles.regexFieldInput}
				onInput={(e) =>
					setSearches({
						[props.type]: e.currentTarget.value || null,
					})
				}
				title={t('infoSearchLabel')}
			/>
			<Switch
				fallback={
					<CloseOutlined
						class={`${styles.regexFieldItem} ${styles.regexFailure}`}
					/>
				}
			>
				<Match when={!searches[props.type]}>
					<></>
				</Match>
				<Match
					when={searchMatches(
						searches[props.type],
						getSongFieldNoRegex(props.clonedSong, props.type),
						processRegexFlags(flags),
					)}
				>
					<CheckOutlined
						class={`${styles.regexFieldItem} ${styles.regexSuccess}`}
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
	const [shouldDelete, setShouldReplace] = createSignal(false);
	const [curReplace, setCurReplace] = createSignal('');

	createEffect(() => {
		setReplaces({
			[props.type]: shouldDelete() ? '' : curReplace() || null,
		});
	});

	return (
		<div class={styles.regexFieldWrapper}>
			<Switch>
				<Match when={shouldDelete()}>
					<span>{t('infoDeleteLabel')}</span>
				</Match>
				<Match when={!shouldDelete()}>
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
						onInput={(e) => setCurReplace(e.currentTarget.value)}
						class={styles.regexFieldInput}
						title={t('infoReplaceLabel')}
					/>
				</Match>
			</Switch>
			<button
				class={`${styles.regexFieldItem} ${styles.button}`}
				title={
					shouldDelete()
						? t('infoReplaceLabel')
						: t('infoDeleteLabel')
				}
				onClick={() => setShouldReplace((cur) => !cur)}
			>
				<Show when={shouldDelete()} fallback={<DeleteOutlined />}>
					<DeleteForeverOutlined />
				</Show>
			</button>
		</div>
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
				{previews[props.type]}
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
			<Show when={!isIos()}>
				<Flags />
				<div class={styles.regexFooterButtons}>
					<div class={styles.controlButtons}>
						<button
							class={styles.controlButton}
							title={t('infoSubmitTitle')}
							onClick={() => void saveEdit(props.tab)}
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
				</div>
			</Show>
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
	await regexEdits.saveRegexEdit({
		search: searches,
		replace: replaces,
		...processRegexFlags(flags),
	});
	sendBackgroundMessage(tab()?.tabId ?? -1, {
		type: 'reprocessSong',
		payload: undefined,
	});
}

/**
 * Regex flag checkbox
 */
function RegexFlagCheckbox(props: {
	i18nTitle: string;
	icon: typeof RegexOutlined;
	isInverted?: true;
	flag: keyof RegexFlags;
}) {
	return (
		<label title={t(props.i18nTitle)} class={styles.regexToggleWrapper}>
			<input
				type="checkbox"
				checked={
					props.isInverted ? !flags[props.flag] : flags[props.flag]
				}
				class={styles.regexToggleInput}
				onChange={() =>
					setFlags((f) => ({
						[props.flag]: !f[props.flag],
					}))
				}
			/>
			<props.icon />
			<Show when={isIos()}>
				<span class={styles.regexToggleLabel}>
					{t(props.i18nTitle)}
				</span>
			</Show>
		</label>
	);
}
