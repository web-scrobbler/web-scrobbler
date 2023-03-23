import * as BrowserStorage from '@/core/storage/browser-storage';
import * as Options from '@/core/storage/options';
import { t } from '@/util/i18n';
import {
	For,
	Resource,
	ResourceActions,
	Setter,
	Show,
	createResource,
} from 'solid-js';
import styles from './components.module.scss';
import Download from '@suid/icons-material/DownloadOutlined';
import Upload from '@suid/icons-material/UploadOutlined';
import Visibility from '@suid/icons-material/VisibilityOutlined';
import Settings from '@suid/icons-material/SettingsOutlined';
import ExpandMore from '@suid/icons-material/ExpandMoreOutlined';
import Delete from '@suid/icons-material/DeleteOutlined';
import connectors, { ConnectorMeta } from '@/core/connectors';
import Add from '@suid/icons-material/AddOutlined';
import { CustomPatterns } from '@/core/storage/wrapper';
import {
	Checkbox,
	ConnectorOptionEntry,
	GlobalOptionEntry,
	RadioButtons,
	SummaryCheckbox,
	TripleCheckbox,
	TripleCheckboxState,
} from './inputs';
import browser from 'webextension-polyfill';
import {
	ModifiedTheme,
	getTheme,
	modifiedThemeList,
	themeList,
	updateTheme,
} from '@/theme/themes';
import { capitalizeFirstLetter, debugLog } from '@/util/util';

const globalOptions = BrowserStorage.getStorage(BrowserStorage.OPTIONS);
const connectorOptions = BrowserStorage.getStorage(
	BrowserStorage.CONNECTORS_OPTIONS
);
const localCache = BrowserStorage.getStorage(BrowserStorage.LOCAL_CACHE);
const connectorOverrideOptions = BrowserStorage.getStorage(
	BrowserStorage.CONNECTORS_OVERRIDE_OPTIONS
);
const customPatterns = BrowserStorage.getStorage(
	BrowserStorage.CUSTOM_PATTERNS
);

export default function OptionsComponent(props: {
	setActiveModal: Setter<string>;
	modal: HTMLDialogElement | undefined;
}) {
	const { setActiveModal, modal } = props;
	const [options, setOptions] = createResource(
		globalOptions.get.bind(globalOptions)
	);
	return (
		<>
			<h1>{t('optionsOptions')}</h1>
			<GlobalOptionsList options={options} setOptions={setOptions} />
			<ConnectorOptionsList />
			<ScrobbleBehavior options={options} setOptions={setOptions} />
			<EditedTracks setActiveModal={setActiveModal} modal={modal} />
			<ConnectorOverrideOptions />
		</>
	);
}

function ScrobbleBehavior(props: {
	options: Resource<Options.GlobalOptions | null>;
	setOptions: ResourceActions<
		Options.GlobalOptions | null | undefined,
		unknown
	>;
}) {
	const { options, setOptions } = props;
	return (
		<>
			<h2>{t('optionsScrobbleBehavior')}</h2>
			<RadioButtons
				buttons={[
					{
						label: t('optionForceRecognize'),
						title: t('optionForceRecognizeTitle'),
						value: Options.FORCE_RECOGNIZE,
					},
					{
						label: t('optionScrobbleRecognizedTracks'),
						title: t('optionScrobbleRecognizedTracksTitle'),
						value: Options.SCROBBLE_RECOGNIZED_TRACKS,
					},
					{
						label: t('optionScrobbleEditedTracksOnly'),
						title: t('optionScrobbleEditedTracksOnlyTitle'),
						value: Options.SCROBBLE_EDITED_TRACKS_ONLY,
					},
				]}
				name="scrobbleBehavior"
				value={() => {
					if (options()?.[Options.FORCE_RECOGNIZE]) {
						return Options.FORCE_RECOGNIZE;
					}
					if (options()?.[Options.SCROBBLE_EDITED_TRACKS_ONLY]) {
						return Options.SCROBBLE_EDITED_TRACKS_ONLY;
					}
					return Options.SCROBBLE_RECOGNIZED_TRACKS;
				}}
				onChange={(e) => {
					const value = e.currentTarget.value;
					setOptions.mutate((o) => {
						if (!o) return o;
						const newOptions = {
							...o,
							[Options.FORCE_RECOGNIZE]:
								value === Options.FORCE_RECOGNIZE,
							[Options.SCROBBLE_EDITED_TRACKS_ONLY]:
								value === Options.SCROBBLE_EDITED_TRACKS_ONLY,
							[Options.SCROBBLE_RECOGNIZED_TRACKS]:
								value === Options.SCROBBLE_RECOGNIZED_TRACKS,
						};
						globalOptions.set(newOptions);
						return newOptions;
					});
				}}
			/>
		</>
	);
}

function ConnectorOptionsList() {
	const [options, setOptions] = createResource(
		connectorOptions.get.bind(connectorOptions)
	);
	return (
		<>
			<h2>YouTube</h2>
			<ul>
				<ConnectorOptionEntry
					options={options}
					setOptions={setOptions}
					connectorOptions={connectorOptions}
					i18ntitle="optionYtMusicRecognisedOnlyTitle"
					i18nlabel="optionYtMusicRecognisedOnly"
					connector="YouTube"
					key="scrobbleMusicRecognisedOnly"
				/>
				<ConnectorOptionEntry
					options={options}
					setOptions={setOptions}
					connectorOptions={connectorOptions}
					i18ntitle="optionYtGetTrackInfoFromYtMusicTitle"
					i18nlabel="optionYtGetTrackInfoFromYtMusic"
					connector="YouTube"
					key="enableGetTrackInfoFromYtMusic"
				/>
				<ConnectorOptionEntry
					options={options}
					setOptions={setOptions}
					connectorOptions={connectorOptions}
					i18ntitle="optionYtMusicOnlyTitle"
					i18nlabel="optionYtMusicOnly"
					connector="YouTube"
					key="scrobbleMusicOnly"
				/>
				<ConnectorOptionEntry
					options={options}
					setOptions={setOptions}
					connectorOptions={connectorOptions}
					i18ntitle="optionYtEntertainmentOnlyTitle"
					i18nlabel="optionYtEntertainmentOnly"
					connector="YouTube"
					key="scrobbleEntertainmentOnly"
				/>
				<li class={styles.muted}>{t('optionYtDesc')}</li>
			</ul>
		</>
	);
}

function GlobalOptionsList(props: {
	options: Resource<Options.GlobalOptions | null>;
	setOptions: ResourceActions<
		Options.GlobalOptions | null | undefined,
		unknown
	>;
}) {
	const { options, setOptions } = props;
	return (
		<>
			<h2>{t('optionsGeneral')}</h2>
			<ul>
				<ThemeSelector />
				<Show when={browser.notifications}>
					<GlobalOptionEntry
						options={options}
						setOptions={setOptions}
						globalOptions={globalOptions}
						i18ntitle="optionUseNotificationsTitle"
						i18nlabel="optionUseNotifications"
						key={Options.USE_NOTIFICATIONS}
					/>
					<GlobalOptionEntry
						options={options}
						setOptions={setOptions}
						globalOptions={globalOptions}
						i18ntitle="optionUnrecognizedNotificationsTitle"
						i18nlabel="optionUnrecognizedNotifications"
						key={Options.USE_UNRECOGNIZED_SONG_NOTIFICATIONS}
					/>
				</Show>
				<GlobalOptionEntry
					options={options}
					setOptions={setOptions}
					globalOptions={globalOptions}
					i18ntitle="optionScrobblePodcastsTitle"
					i18nlabel="optionScrobblePodcasts"
					key={Options.SCROBBLE_PODCASTS}
				/>
			</ul>
		</>
	);
}

function EditedTracks(props: {
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

function ExportEdits() {
	return (
		<button class={styles.editButton} onClick={downloadEdits}>
			<Upload />
			{t('optionsExportEdited')}
		</button>
	);
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

function ConnectorOverrideOptions() {
	const [options, setOptions] = createResource(
		globalOptions.get.bind(globalOptions)
	);
	const [overrideOptions, setOverrideOptions] = createResource(
		connectorOverrideOptions.get.bind(connectorOverrideOptions)
	);
	const [customPatternOptions, setCustomPatternOptions] = createResource(
		customPatterns.get.bind(customPatterns)
	);
	return (
		<>
			<h2>{t('optionsSupportedWebsites')}</h2>
			<p>{t('optionsEnableDisableHint')}</p>
			<p innerHTML={t('optionsCustomPatternsHint')} />
			<ul class={styles.connectorOptionsList}>
				<li>
					<Settings />
					<Checkbox
						title={t('optionsToggle')}
						label={t('optionsToggle')}
						isChecked={() =>
							Object.keys(options()?.disabledConnectors ?? {})
								.length < connectors.length
						}
						onInput={(e) => {
							if (e.currentTarget.checked) {
								setOptions.mutate((o) => {
									if (!o) return o;
									const newOptions = {
										...o,
										disabledConnectors: {},
									};
									globalOptions.set(newOptions);
									return newOptions;
								});
							} else {
								const disabledConnectors = Object.fromEntries(
									connectors.map((c) => [c.id, true])
								);
								setOptions.mutate((o) => {
									if (!o) return o;
									const newOptions = {
										...o,
										disabledConnectors,
									};
									globalOptions.set(newOptions);
									return newOptions;
								});
							}
						}}
					/>
				</li>
				<For each={connectors}>
					{(connector) => (
						<ConnectorOption
							connector={connector}
							options={options}
							setOptions={setOptions}
							overrideOptions={overrideOptions}
							setOverrideOptions={setOverrideOptions}
							customPatternOptions={customPatternOptions}
							setCustomPatternOptions={setCustomPatternOptions}
						/>
					)}
				</For>
			</ul>
		</>
	);
}

function ConnectorOption(props: {
	connector: ConnectorMeta;
	options: Resource<Options.GlobalOptions | null>;
	setOptions: ResourceActions<
		Options.GlobalOptions | null | undefined,
		unknown
	>;
	overrideOptions: Resource<Options.ConnectorsOverrideOptions | null>;
	setOverrideOptions: ResourceActions<
		Options.ConnectorsOverrideOptions | null | undefined,
		unknown
	>;
	customPatternOptions: Resource<CustomPatterns | null>;
	setCustomPatternOptions: ResourceActions<
		CustomPatterns | null | undefined,
		unknown
	>;
}) {
	const {
		connector,
		options,
		setOptions,
		overrideOptions,
		setOverrideOptions,
		customPatternOptions,
		setCustomPatternOptions,
	} = props;
	return (
		<li>
			<details>
				<summary>
					<ExpandMore class={styles.expandVector} />
					<SummaryCheckbox
						title={connector.label}
						label={connector.label}
						id={connector.id}
						isChecked={() =>
							!(
								options()?.disabledConnectors?.[connector.id] ??
								false
							)
						}
						onInput={(e) => {
							setOptions.mutate((o) => {
								if (!o) return o;
								const newOptions = {
									...o,
								};
								if (!e.currentTarget.checked) {
									newOptions.disabledConnectors = {
										...newOptions.disabledConnectors,
										[connector.id]: true,
									};
								} else {
									delete newOptions.disabledConnectors[
										connector.id
									];
								}
								globalOptions.set(newOptions);
								return newOptions;
							});
						}}
					/>
				</summary>
				<ConnectorOverrideOptionDetails
					connector={connector}
					overrideOptions={overrideOptions}
					setOverrideOptions={setOverrideOptions}
					customPatternOptions={customPatternOptions}
					setCustomPatternOptions={setCustomPatternOptions}
				/>
			</details>
		</li>
	);
}

function ConnectorOverrideOptionDetails(props: {
	connector: ConnectorMeta;
	overrideOptions: Resource<Options.ConnectorsOverrideOptions | null>;
	setOverrideOptions: ResourceActions<
		Options.ConnectorsOverrideOptions | null | undefined,
		unknown
	>;
	customPatternOptions: Resource<CustomPatterns | null>;
	setCustomPatternOptions: ResourceActions<
		CustomPatterns | null | undefined,
		unknown
	>;
}) {
	const {
		connector,
		customPatternOptions,
		setCustomPatternOptions,
		overrideOptions,
		setOverrideOptions,
	} = props;
	return (
		<>
			<h3>{t('optionsGeneral')}</h3>
			<Show when={browser.notifications}>
				<ConnectorTripleCheckbox
					title={t('optionUseNotificationsTitle')}
					label={t('optionUseNotifications')}
					connector={connector}
					option={Options.USE_NOTIFICATIONS}
					overrideOptions={overrideOptions}
					setOverrideOptions={setOverrideOptions}
				/>
				<ConnectorTripleCheckbox
					title={t('optionUnrecognizedNotificationsTitle')}
					label={t('optionUnrecognizedNotifications')}
					connector={connector}
					option={Options.USE_UNRECOGNIZED_SONG_NOTIFICATIONS}
					overrideOptions={overrideOptions}
					setOverrideOptions={setOverrideOptions}
				/>
			</Show>
			<ConnectorTripleCheckbox
				title={t('optionScrobblePodcastsTitle')}
				label={t('optionScrobblePodcasts')}
				connector={connector}
				option={Options.SCROBBLE_PODCASTS}
				overrideOptions={overrideOptions}
				setOverrideOptions={setOverrideOptions}
			/>
			<h3>{t('optionsScrobbleBehavior')}</h3>
			<RadioButtons
				buttons={[
					{
						label: t('optionForceRecognize'),
						title: t('optionForceRecognizeTitle'),
						value: Options.FORCE_RECOGNIZE,
					},
					{
						label: t('optionScrobbleRecognizedTracks'),
						title: t('optionScrobbleRecognizedTracksTitle'),
						value: Options.SCROBBLE_RECOGNIZED_TRACKS,
					},
					{
						label: t('optionScrobbleEditedTracksOnly'),
						title: t('optionScrobbleEditedTracksOnlyTitle'),
						value: Options.SCROBBLE_EDITED_TRACKS_ONLY,
					},
				]}
				name={`${connector.id}-scrobbleBehavior`}
				value={() => {
					if (
						overrideOptions()?.[connector.id]?.[
							Options.FORCE_RECOGNIZE
						]
					) {
						return Options.FORCE_RECOGNIZE;
					}
					if (
						overrideOptions()?.[connector.id]?.[
							Options.SCROBBLE_EDITED_TRACKS_ONLY
						]
					) {
						return Options.SCROBBLE_EDITED_TRACKS_ONLY;
					}
					if (
						overrideOptions()?.[connector.id]?.[
							Options.SCROBBLE_RECOGNIZED_TRACKS
						]
					) {
						return Options.SCROBBLE_RECOGNIZED_TRACKS;
					}

					return '';
				}}
				onChange={(e) => {
					const value = e.currentTarget.value;
					setOverrideOptions.mutate((o) => {
						const newOptions = {
							...(o ?? {}),
						};
						newOptions[connector.id] = {
							...(newOptions[connector.id] ?? {}),
							[Options.FORCE_RECOGNIZE]:
								value === Options.FORCE_RECOGNIZE,
							[Options.SCROBBLE_EDITED_TRACKS_ONLY]:
								value === Options.SCROBBLE_EDITED_TRACKS_ONLY,
							[Options.SCROBBLE_RECOGNIZED_TRACKS]:
								value === Options.SCROBBLE_RECOGNIZED_TRACKS,
						};

						connectorOverrideOptions.set(newOptions);
						return newOptions;
					});
				}}
				reset={() => {
					setOverrideOptions.mutate((o) => {
						const newOptions = {
							...(o ?? {}),
						};
						delete newOptions[connector.id][
							Options.FORCE_RECOGNIZE
						];
						delete newOptions[connector.id][
							Options.SCROBBLE_EDITED_TRACKS_ONLY
						];
						delete newOptions[connector.id][
							Options.SCROBBLE_RECOGNIZED_TRACKS
						];

						connectorOverrideOptions.set(newOptions);
						return newOptions;
					});
				}}
			/>
			<h3>{t('customPatterns')}</h3>
			<p>{t('customPatternsHint')}</p>
			<EditCustomPatterns
				connector={connector}
				customPatternOptions={customPatternOptions}
				setCustomPatternOptions={setCustomPatternOptions}
			/>
		</>
	);
}

function EditCustomPatterns(props: {
	connector: ConnectorMeta;
	customPatternOptions: Resource<CustomPatterns | null>;
	setCustomPatternOptions: ResourceActions<
		CustomPatterns | null | undefined,
		unknown
	>;
}) {
	const { connector, customPatternOptions, setCustomPatternOptions } = props;
	return (
		<>
			<For each={customPatternOptions()?.[connector.id] ?? []}>
				{(pattern, i) => (
					<div class={styles.patternWrapper}>
						<input
							class={styles.patternInput}
							type="text"
							value={pattern}
							onInput={(e) => {
								setCustomPatternOptions.mutate((o) => {
									if (!o) {
										o = {};
									}
									o[connector.id] = [
										...(o[connector.id] ?? []),
									];
									o[connector.id][i()] =
										e.currentTarget.value;
									customPatterns.set(o);
									return o;
								});
							}}
						/>
						<button
							class={styles.patternDeleteButton}
							type="button"
							onClick={() => {
								setCustomPatternOptions.mutate((o) => {
									const newPatterns = {
										...(o ?? {}),
									};
									newPatterns[connector.id] = [
										...(newPatterns[connector.id] ?? []),
									];
									newPatterns[connector.id].splice(i(), 1);
									customPatterns.set(newPatterns);
									return newPatterns;
								});
							}}
						>
							<Delete />
						</button>
					</div>
				)}
			</For>
			<button
				class={styles.patternAddButton}
				type="button"
				onClick={() => {
					setCustomPatternOptions.mutate((o) => {
						const newPatterns = {
							...(o ?? {}),
						};
						newPatterns[connector.id] = [
							...(newPatterns[connector.id] ?? []),
						];
						newPatterns[connector.id].push('');
						customPatterns.set(newPatterns);
						return newPatterns;
					});
				}}
			>
				<Add />
				{t('customPatternsAdd')}
			</button>
		</>
	);
}

function ConnectorTripleCheckbox(props: {
	title: string;
	label: string;
	connector: ConnectorMeta;
	option: keyof Options.ConnectorsOverrideOptionValues;
	overrideOptions: Resource<Options.ConnectorsOverrideOptions | null>;
	setOverrideOptions: ResourceActions<
		Options.ConnectorsOverrideOptions | null | undefined,
		unknown
	>;
}) {
	const {
		title,
		label,
		connector,
		option,
		overrideOptions,
		setOverrideOptions,
	} = props;
	return (
		<TripleCheckbox
			title={title}
			label={label}
			id={connector.id}
			state={() => {
				const override = overrideOptions()?.[connector.id];
				if (!override || !(option in override)) {
					return TripleCheckboxState.Indeterminate;
				}
				if (override[option]) {
					return TripleCheckboxState.Checked;
				}
				return TripleCheckboxState.Unchecked;
			}}
			onInput={(state) => {
				setOverrideOptions.mutate((o) => {
					const newOptions = {
						...(o ?? {}),
					};
					if (state === TripleCheckboxState.Indeterminate) {
						delete newOptions[connector.id][option];
					} else {
						newOptions[connector.id] = {
							...newOptions[connector.id],
							[option]: state === TripleCheckboxState.Checked,
						};
					}
					connectorOverrideOptions.set(newOptions);
					return newOptions;
				});
			}}
		/>
	);
}

function ThemeSelector() {
	const [theme, setTheme] = createResource(getTheme);

	return (
		<div class={styles.selectOption}>
			<label title={t('optionThemeTitle')} class={styles.bigLabel}>
				{t('optionTheme')}
				<select
					value={theme()}
					onChange={(e) => {
						const value = e.currentTarget.value;
						const typedValue = value as ModifiedTheme;

						if (!modifiedThemeList.includes(typedValue)) {
							debugLog(
								`value ${
									e.currentTarget.value
								} not in themelist ${modifiedThemeList.join(
									','
								)}`,
								'error'
							);
							return;
						}
						setTheme.mutate(() => typedValue);
						updateTheme(typedValue);
					}}
				>
					<For each={themeList}>
						{(themeName) => (
							<option value={`theme-${themeName}`}>
								{t(
									`optionTheme${capitalizeFirstLetter(
										themeName
									)}`
								)}
							</option>
						)}
					</For>
				</select>
			</label>
		</div>
	);
}
