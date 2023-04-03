import { For, Resource, ResourceActions, Show } from 'solid-js';
import styles from './components.module.scss';
import * as Options from '@/core/storage/options';
import { t } from '@/util/i18n';
import StorageWrapper from '@/core/storage/wrapper';
import * as BrowserStorage from '@/core/storage/browser-storage';
import Check from '@suid/icons-material/CheckOutlined';
import Close from '@suid/icons-material/CloseOutlined';
import RestartAlt from '@suid/icons-material/RestartAltOutlined';
import IndeterminateCheckBox from '@suid/icons-material/IndeterminateCheckBoxOutlined';
import { ConnectorMeta } from '@/core/connectors';

/**
 * Checkbox option component
 */
export function Checkbox(props: {
	title: string;
	label: string;
	isChecked: () => boolean;
	onInput: (
		e: InputEvent & {
			currentTarget: HTMLInputElement;
			target: Element;
		}
	) => void;
}) {
	const { title, label, isChecked, onInput } = props;
	return (
		<div class={styles.checkboxOption}>
			<label title={title} class={styles.bigLabel}>
				{label}
				<input
					type="checkbox"
					checked={isChecked()}
					onInput={onInput}
				/>
				<span class={styles.checkboxWrapper}>
					<span class={styles.checkbox} />
				</span>
			</label>
		</div>
	);
}

/**
 * Checkbox option component made for being inside detail summary element.
 * Safari does not behave well with just a typical old checkbox, so we have to do some working around that.
 */
export function SummaryCheckbox(props: {
	title: string;
	label: string;
	id: string;
	isChecked: () => boolean;
	onInput: (
		e: Event & {
			currentTarget: HTMLInputElement;
			target: Element;
		}
	) => void;
}) {
	const { title, label, id, isChecked, onInput } = props;
	return (
		<div class={`${styles.checkboxOption} ${styles.summaryCheckbox}`}>
			<span title={title} class={styles.summarySpan}>
				{label}
				<label
					onClick={(e) => {
						// Safari doesn't like labeled checkboxes in detail summaries
						// hacky but it works, hopefully it doesnt stop working
						e.preventDefault();
						const checkbox = document.getElementById(
							id
						) as HTMLInputElement;
						checkbox.checked = !checkbox.checked;
						onInput({
							...e,
							currentTarget: checkbox,
						});
					}}
				>
					<input
						id={id}
						type="checkbox"
						checked={isChecked()}
						onInput={onInput}
					/>
					<span class={styles.checkboxWrapper}>
						<span class={styles.checkbox} />
					</span>
				</label>
			</span>
		</div>
	);
}

/**
 * Radio selector buttons
 */
export function RadioButtons(props: {
	buttons: {
		label: string;
		title: string;
		value: string;
	}[];
	name: string;
	value: () => string;
	onChange: (
		e: Event & {
			currentTarget: HTMLInputElement;
			target: Element;
		}
	) => void;
	reset?: (
		e: Event & {
			currentTarget: HTMLButtonElement;
			target: Element;
		}
	) => void;
}) {
	const { buttons, name, value, onChange, reset } = props;
	return (
		<ul class={styles.radioButtons}>
			<For each={buttons}>
				{(button) => (
					<li>
						<input
							type="radio"
							id={`${name}-${button.value}`}
							name={name}
							value={button.value}
							checked={value() === button.value}
							onChange={onChange}
						/>
						<label
							for={`${name}-${button.value}`}
							data-name={name}
							title={button.title}
							class={styles.radioLabel}
						>
							{button.label}
						</label>
					</li>
				)}
			</For>
			<Show when={reset}>
				<li>
					<button class={styles.resetButton} onClick={reset}>
						<RestartAlt />
						{t('buttonReset')}
					</button>
				</li>
			</Show>
		</ul>
	);
}

/**
 * Checkbox made for connector options
 */
export function ConnectorOptionEntry<
	K extends keyof Options.ConnectorOptions
>(props: {
	options: Resource<Options.ConnectorOptions | null>;
	setOptions: ResourceActions<
		Options.ConnectorOptions | null | undefined,
		unknown
	>;
	connectorOptions: StorageWrapper<typeof BrowserStorage.CONNECTORS_OPTIONS>;
	i18ntitle: string;
	i18nlabel: string;
	connector: K;
	key: keyof Options.ConnectorOptions[K];
}) {
	const {
		options,
		setOptions,
		connectorOptions,
		i18ntitle,
		i18nlabel,
		connector,
		key,
	} = props;
	return (
		<li>
			<Checkbox
				title={t(i18ntitle)}
				label={t(i18nlabel)}
				isChecked={() => options()?.[connector]?.[key] as boolean}
				onInput={(e) => {
					setOptions.mutate((o) => {
						if (!o) return o;
						const newOptions = {
							...o,
							[connector]: {
								...o[connector],
								[key]: e.currentTarget.checked,
							},
						};
						connectorOptions.set(newOptions);
						return newOptions;
					});
				}}
			/>
		</li>
	);
}

/**
 * Checkbox made for basic global options
 */
export function GlobalOptionEntry(props: {
	options: Resource<Options.GlobalOptions | null>;
	setOptions: ResourceActions<
		Options.GlobalOptions | null | undefined,
		unknown
	>;
	i18ntitle: string;
	i18nlabel: string;
	globalOptions: StorageWrapper<typeof BrowserStorage.OPTIONS>;
	key: keyof Options.GlobalOptions;
}) {
	const { options, setOptions, i18ntitle, i18nlabel, globalOptions, key } =
		props;
	return (
		<li>
			<Checkbox
				title={t(i18ntitle)}
				label={t(i18nlabel)}
				isChecked={() => options()?.[key] as boolean}
				onInput={(e) => {
					setOptions.mutate((o) => {
						if (!o) return o;
						const newOptions = {
							...o,
							[key]: e.currentTarget.checked,
						};
						globalOptions.set(newOptions);
						return newOptions;
					});
				}}
			/>
		</li>
	);
}

/**
 * The different states a triple checkbox can have.
 */
export enum TripleCheckboxState {
	Unchecked,
	Checked,
	Indeterminate,
}

/**
 * Checkbox component that can have one of three states.
 * This is made for connector override options,
 * where an option can be override to true/false, or use global option/neutral
 */
export function TripleCheckbox(props: {
	title: string;
	label: string;
	id: string;
	state: () => TripleCheckboxState;
	onInput: (state: TripleCheckboxState) => void;
}) {
	const { title, label, id, state, onInput } = props;
	return (
		<div class={styles.tripleCheckboxOption}>
			<span title={title}>
				{label}
				<div class={styles.tripleCheckboxWrapper}>
					<label
						class={`${styles.tripleCheckboxLabel} ${
							styles.unchecked
						}${
							state() === TripleCheckboxState.Unchecked
								? ` ${styles.activeBox}`
								: ''
						}`}
					>
						<input
							class={styles.tripleCheckbox}
							type="radio"
							value="unchecked"
							name={`${id}-${label}`}
							checked={state() === TripleCheckboxState.Unchecked}
							onInput={() =>
								onInput(TripleCheckboxState.Unchecked)
							}
						/>
						<Close />
					</label>
					<label
						class={`${styles.tripleCheckboxLabel} ${
							styles.indeterminate
						}${
							state() === TripleCheckboxState.Indeterminate
								? ` ${styles.activeBox}`
								: ''
						}`}
					>
						<input
							class={styles.tripleCheckbox}
							type="radio"
							value="indeterminate"
							name={`${id}-${label}`}
							checked={
								state() === TripleCheckboxState.Indeterminate
							}
							onInput={() =>
								onInput(TripleCheckboxState.Indeterminate)
							}
						/>
						<IndeterminateCheckBox />
					</label>
					<label
						class={`${styles.tripleCheckboxLabel} ${
							styles.checked
						}${
							state() === TripleCheckboxState.Checked
								? ` ${styles.activeBox}`
								: ''
						}`}
					>
						<input
							class={styles.tripleCheckbox}
							type="radio"
							value="checked"
							name={`${id}-${label}`}
							checked={state() === TripleCheckboxState.Checked}
							onInput={() => onInput(TripleCheckboxState.Checked)}
						/>
						<Check />
					</label>
				</div>
			</span>
		</div>
	);
}

/**
 * Triple checkbox made for connector override options
 */
export function ConnectorTripleCheckbox(props: {
	title: string;
	label: string;
	connector: ConnectorMeta;
	option: keyof Options.ConnectorsOverrideOptionValues;
	overrideOptions: Resource<Options.ConnectorsOverrideOptions | null>;
	setOverrideOptions: ResourceActions<
		Options.ConnectorsOverrideOptions | null | undefined,
		unknown
	>;
	connectorOverrideOptions: StorageWrapper<
		typeof BrowserStorage.CONNECTORS_OVERRIDE_OPTIONS
	>;
}) {
	const {
		title,
		label,
		connector,
		option,
		overrideOptions,
		connectorOverrideOptions,
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
