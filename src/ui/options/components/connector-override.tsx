import * as BrowserStorage from '@/core/storage/browser-storage';
import * as Options from '@/core/storage/options';
import {
	Accessor,
	For,
	Setter,
	Show,
	Suspense,
	createEffect,
	createResource,
	createSignal,
} from 'solid-js';
import styles from './components.module.scss';
import {
	SettingsOutlined,
	ExpandMoreOutlined,
	DeleteOutlined,
	AddOutlined,
} from '@/ui/components/icons';
import connectors, { ConnectorMeta } from '@/core/connectors';
import {
	Checkbox,
	ConnectorTripleCheckbox,
	RadioButtons,
	SummaryCheckbox,
} from './inputs';
import browser from 'webextension-polyfill';
import { t } from '@/util/i18n';
import BlockedChannels from './edit-options/blocked-channels';
import { ModalType } from './navigator';

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
export default function ConnectorOverrideOptions(props: {
	setActiveModal: Setter<ModalType>;
	modal: HTMLDialogElement | undefined;
}) {
	return (
		<>
			<h1>{t('optionsSupportedWebsites')}</h1>
			<p>{t('optionsEnableDisableHint')}</p>
			{/* eslint-disable-next-line */}
			<p innerHTML={t('optionsCustomPatternsHint')} />
			<ul class={`${styles.connectorOptionsList} ${styles.optionList}`}>
				<li>
					<SettingsOutlined />
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
									if (!o) {
										return o;
									}
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
									if (!o) {
										return o;
									}
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

				<ConnectorOptions
					setActiveModal={props.setActiveModal}
					modal={props.modal}
				/>
			</ul>
		</>
	);
}

/**
 * Connector Override Options list
 */
function ConnectorOptions(props: {
	setActiveModal: Setter<ModalType>;
	modal: HTMLDialogElement | undefined;
}) {
	return (
		<Suspense fallback={<p>{t('optionsLoadingConnectorOptions')}</p>}>
			<For each={connectors}>
				{(connector) => (
					<ConnectorOption
						setActiveModal={props.setActiveModal}
						modal={props.modal}
						connector={connector}
					/>
				)}
			</For>
		</Suspense>
	);
}

/**
 * The connector override options for one connector
 */
function ConnectorOption(props: {
	connector: ConnectorMeta;
	setActiveModal: Setter<ModalType>;
	modal: HTMLDialogElement | undefined;
}) {
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
					<ExpandMoreOutlined class={styles.expandVector} />
					<SummaryCheckbox
						title={props.connector.label}
						label={props.connector.label}
						id={props.connector.id}
						isChecked={() =>
							!(
								options()?.disabledConnectors?.[
									props.connector.id
								] ?? false
							)
						}
						onInput={(e) => {
							const connector = props.connector;
							setOptions.mutate((o) => {
								if (!o) {
									return o;
								}
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
					setActiveModal={props.setActiveModal}
					modal={props.modal}
					connector={props.connector}
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
	setActiveModal: Setter<ModalType>;
	modal: HTMLDialogElement | undefined;
}) {
	return (
		<Show when={props.active()}>
			<div role="group" aria-label={props.connector.label}>
				<h3>{t('optionsGeneral')}</h3>
				<Show when={browser.notifications}>
					<ConnectorTripleCheckbox
						title={t('optionUseNotificationsTitle')}
						label={t('optionUseNotifications')}
						connector={props.connector}
						option={Options.USE_NOTIFICATIONS}
						overrideOptions={overrideOptions}
						setOverrideOptions={setOverrideOptions}
						connectorOverrideOptions={connectorOverrideOptions}
					/>
					<ConnectorTripleCheckbox
						title={t('optionUnrecognizedNotificationsTitle')}
						label={t('optionUnrecognizedNotifications')}
						connector={props.connector}
						option={Options.USE_UNRECOGNIZED_SONG_NOTIFICATIONS}
						overrideOptions={overrideOptions}
						setOverrideOptions={setOverrideOptions}
						connectorOverrideOptions={connectorOverrideOptions}
					/>
				</Show>
				<ConnectorTripleCheckbox
					title={t('optionUseInfoboxTitle')}
					label={t('optionUseInfobox')}
					connector={props.connector}
					option={Options.USE_INFOBOX}
					overrideOptions={overrideOptions}
					setOverrideOptions={setOverrideOptions}
					connectorOverrideOptions={connectorOverrideOptions}
				/>
				<ConnectorTripleCheckbox
					title={t('optionScrobblePodcastsTitle')}
					label={t('optionScrobblePodcasts')}
					connector={props.connector}
					option={Options.SCROBBLE_PODCASTS}
					overrideOptions={overrideOptions}
					setOverrideOptions={setOverrideOptions}
					connectorOverrideOptions={connectorOverrideOptions}
				/>
				<ConnectorTripleCheckbox
					title={t('optionAutoToggleLoveTitle')}
					label={t('optionAutoToggleLove')}
					connector={props.connector}
					option={Options.AUTO_TOGGLE_LOVE}
					overrideOptions={overrideOptions}
					setOverrideOptions={setOverrideOptions}
					connectorOverrideOptions={connectorOverrideOptions}
				/>

				<h3 id={`${props.connector.id}-scrobble-behavior`}>
					{t('optionsScrobbleBehavior')}
				</h3>
				<RadioButtons
					labelledby={`${props.connector.id}-scrobble-behavior`}
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
					name={`${props.connector.id}-scrobbleBehavior`}
					value={() => {
						if (
							overrideOptions()?.[props.connector.id]?.[
								Options.FORCE_RECOGNIZE
							]
						) {
							return Options.FORCE_RECOGNIZE;
						}
						if (
							overrideOptions()?.[props.connector.id]?.[
								Options.SCROBBLE_EDITED_TRACKS_ONLY
							]
						) {
							return Options.SCROBBLE_EDITED_TRACKS_ONLY;
						}
						if (
							overrideOptions()?.[props.connector.id]?.[
								Options.SCROBBLE_RECOGNIZED_TRACKS
							]
						) {
							return Options.SCROBBLE_RECOGNIZED_TRACKS;
						}

						return '';
					}}
					onChange={(e) => {
						const value = e.currentTarget.value;
						const connector = props.connector;
						setOverrideOptions.mutate((o) => {
							const newOptions = {
								...(o ?? {}),
							};
							newOptions[connector.id] = {
								...(newOptions[connector.id] ?? {}),
								[Options.FORCE_RECOGNIZE]:
									value === Options.FORCE_RECOGNIZE,
								[Options.SCROBBLE_EDITED_TRACKS_ONLY]:
									value ===
									Options.SCROBBLE_EDITED_TRACKS_ONLY,
								[Options.SCROBBLE_RECOGNIZED_TRACKS]:
									value ===
									Options.SCROBBLE_RECOGNIZED_TRACKS,
							};

							connectorOverrideOptions.set(newOptions);
							return newOptions;
						});
					}}
					reset={() => {
						const connector = props.connector;
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
				<EditCustomPatterns connector={props.connector} />
				<Show when={props.connector.usesBlocklist}>
					<BlockedChannels
						setActiveModal={props.setActiveModal}
						modal={props.modal}
						connector={props.connector}
					/>
				</Show>
			</div>
		</Show>
	);
}

/**
 * input boxes that allows the user to edit the custom URL patterns for a connector
 */
function EditCustomPatterns(props: { connector: ConnectorMeta }) {
	return (
		<>
			<For each={customPatternOptions()?.[props.connector.id] ?? []}>
				{(pattern, i) => (
					<div class={styles.patternWrapper}>
						<input
							class={styles.patternInput}
							type="text"
							value={pattern}
							onInput={(e) => {
								const connector = props.connector;
								const index = i();
								setCustomPatternOptions.mutate((o) => {
									let data = o;
									if (!data) {
										data = {};
									}
									data[connector.id] = [
										...(data[connector.id] ?? []),
									];
									data[connector.id][index] =
										e.currentTarget.value;
									customPatterns.set(data);
									return data;
								});
							}}
						/>
						<button
							class={`${styles.button} ${styles.small} ${styles.noRadius}`}
							type="button"
							onClick={() => {
								const connector = props.connector;
								const index = i();
								setCustomPatternOptions.mutate((o) => {
									const newPatterns = {
										...(o ?? {}),
									};
									newPatterns[connector.id] = [
										...(newPatterns[connector.id] ?? []),
									];
									newPatterns[connector.id].splice(index, 1);
									customPatterns.set(newPatterns);
									return newPatterns;
								});
							}}
						>
							<DeleteOutlined />
						</button>
					</div>
				)}
			</For>
			<button
				class={`${styles.button} ${styles.shiftLeft}`}
				type="button"
				onClick={() => {
					const connector = props.connector;
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
				<AddOutlined />
				{t('customPatternsAdd')}
			</button>
		</>
	);
}
