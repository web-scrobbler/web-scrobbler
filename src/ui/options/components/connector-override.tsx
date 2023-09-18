import * as BrowserStorage from '@/core/storage/browser-storage';
import * as Options from '@/core/storage/options';
import {
	Accessor,
	For,
	Show,
	Suspense,
	createEffect,
	createResource,
	createSignal,
} from 'solid-js';
import styles from './components.module.scss';
import Settings from '@suid/icons-material/SettingsOutlined';
import ExpandMore from '@suid/icons-material/ExpandMoreOutlined';
import Delete from '@suid/icons-material/DeleteOutlined';
import connectors, { ConnectorMeta } from '@/core/connectors';
import Add from '@suid/icons-material/AddOutlined';
import {
	Checkbox,
	ConnectorTripleCheckbox,
	RadioButtons,
	SummaryCheckbox,
} from './inputs';
import browser from 'webextension-polyfill';
import { t } from '@/util/i18n';

const globalOptions = BrowserStorage.getStorage(BrowserStorage.OPTIONS);
const connectorOverrideOptions = BrowserStorage.getStorage(
	BrowserStorage.CONNECTORS_OVERRIDE_OPTIONS,
);
const customPatterns = BrowserStorage.getStorage(
	BrowserStorage.CUSTOM_PATTERNS,
);

const [options, setOptions] = createResource(
	globalOptions.get.bind(globalOptions),
);
const [overrideOptions, setOverrideOptions] = createResource(
	connectorOverrideOptions.get.bind(connectorOverrideOptions),
);
const [customPatternOptions, setCustomPatternOptions] = createResource(
	customPatterns.get.bind(customPatterns),
);

/**
 * Component that shows the override options for all connectors
 */
export default function ConnectorOverrideOptions() {
	return (
		<>
			<h1>{t('optionsSupportedWebsites')}</h1>
			<p>{t('optionsEnableDisableHint')}</p>
			{/* eslint-disable-next-line */}
			<p innerHTML={t('optionsCustomPatternsHint')} />
			<ul class={`${styles.connectorOptionsList} ${styles.optionList}`}>
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
									connectors.map((c) => [c.id, true]),
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

				<ConnectorOptions />
			</ul>
		</>
	);
}

/**
 * Connector Override Options list
 */
function ConnectorOptions() {
	return (
		<Suspense fallback={<p>{t('optionsLoadingConnectorOptions')}</p>}>
			<For each={connectors}>
				{(connector) => <ConnectorOption connector={connector} />}
			</For>
		</Suspense>
	);
}

/**
 * The connector override options for one connector
 */
function ConnectorOption(props: { connector: ConnectorMeta }) {
	const { connector } = props;
	const [ref, setRef] = createSignal<HTMLDetailsElement>();
	const [active, setActive] = createSignal(false);
	createEffect(() => {
		ref()?.addEventListener('toggle', () => {
			setActive((a) => !a);
		});
	});
	return (
		<li>
			<details ref={setRef}>
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
					active={active}
				/>
			</details>
		</li>
	);
}

/**
 * The connector override option details for a single connector
 */
function ConnectorOverrideOptionDetails(props: {
	connector: ConnectorMeta;
	active: Accessor<boolean>;
}) {
	const { connector } = props;
	return (
		<Show when={props.active()}>
			<h3>{t('optionsGeneral')}</h3>
			<Show when={browser.notifications}>
				<ConnectorTripleCheckbox
					title={t('optionUseNotificationsTitle')}
					label={t('optionUseNotifications')}
					connector={connector}
					option={Options.USE_NOTIFICATIONS}
					overrideOptions={overrideOptions}
					setOverrideOptions={setOverrideOptions}
					connectorOverrideOptions={connectorOverrideOptions}
				/>
				<ConnectorTripleCheckbox
					title={t('optionUnrecognizedNotificationsTitle')}
					label={t('optionUnrecognizedNotifications')}
					connector={connector}
					option={Options.USE_UNRECOGNIZED_SONG_NOTIFICATIONS}
					overrideOptions={overrideOptions}
					setOverrideOptions={setOverrideOptions}
					connectorOverrideOptions={connectorOverrideOptions}
				/>
			</Show>
			<ConnectorTripleCheckbox
				title={t('optionScrobblePodcastsTitle')}
				label={t('optionScrobblePodcasts')}
				connector={connector}
				option={Options.SCROBBLE_PODCASTS}
				overrideOptions={overrideOptions}
				setOverrideOptions={setOverrideOptions}
				connectorOverrideOptions={connectorOverrideOptions}
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
			<EditCustomPatterns connector={connector} />
		</Show>
	);
}

/**
 * input boxes that allows the user to edit the custom URL patterns for a connector
 */
function EditCustomPatterns(props: { connector: ConnectorMeta }) {
	const { connector } = props;
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
