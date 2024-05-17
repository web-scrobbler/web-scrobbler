import type { Resource, ResourceActions } from 'solid-js';
import { For, Show } from 'solid-js';
import styles from './components.module.scss';
import type * as Options from '@/core/storage/options';
import { t } from '@/util/i18n';
import type StorageWrapper from '@/core/storage/wrapper';
import type * as BrowserStorage from '@/core/storage/browser-storage';
import {
	CheckOutlined,
	CloseOutlined,
	RestartAltOutlined,
	IndeterminateCheckBoxOutlined,
} from '@/ui/components/icons';
import type { ConnectorMeta } from '@/core/connectors';
import { clamp } from '@/util/util';

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
		},
	) => void;
}) {
	return (
		<div class={styles.checkboxOption}>
			<label title={props.title} class={styles.bigLabel}>
				{props.label}
				<input
					type="checkbox"
					checked={props.isChecked()}
					onInput={(e) => {
						props.onInput(e);
					}}
				/>
				<span class={styles.checkboxWrapper}>
					<span class={styles.checkbox} />
				</span>
			</label>
		</div>
	);
}

/**
 * Handles clicks and keyboard inputs for {@link SummaryCheckbox}.
 *
 * @param e - input event that triggered checkbox change.
 * @param id - id of checkbox element.
 * @param onInput - input event to run for checkbox.
 */
function handleSummaryCheckboxInput(
	event: Event & {
		currentTarget: HTMLLabelElement;
		target: Element;
	},
	id: string,
	onInput: (
		e: Event & {
			currentTarget: HTMLInputElement;
			target: Element;
		},
	) => void,
) {
	event.preventDefault();
	const checkbox = document.getElementById(id) as HTMLInputElement;
	checkbox.checked = !checkbox.checked;
	onInput({
		...event,
		currentTarget: checkbox,
	});
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
		},
	) => void;
}) {
	return (
		<div class={`${styles.checkboxOption} ${styles.summaryCheckbox}`}>
			<span title={props.title} class={styles.summarySpan}>
				{props.label}
				<label
					onClick={(e) => {
						// Safari doesn't like labeled checkboxes in detail summaries
						// hacky but it works, hopefully it doesnt stop working
						handleSummaryCheckboxInput(e, props.id, props.onInput);
					}}
					onKeyUp={(e) => {
						// keyboard navigation does not like checkbox being inside summary.
						// handle this behavior ourselves.
						if (e.key !== ' ') {
							return;
						}
						handleSummaryCheckboxInput(e, props.id, props.onInput);
					}}
					title={t('menuEnableConnector', props.label)}
				>
					<input
						id={props.id}
						type="checkbox"
						checked={props.isChecked()}
						onInput={(e) => {
							props.onInput(e);
						}}
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
		},
	) => void;
	reset?: (
		e: Event & {
			currentTarget: HTMLButtonElement;
			target: Element;
		},
	) => void;
	labelledby: string;
}) {
	return (
		<div
			class={`${styles.radioButtons} ${styles.optionList}`}
			role="radiogroup"
			aria-labelledby={props.labelledby}
		>
			<For each={props.buttons}>
				{(button) => (
					<div class={styles.radioButton}>
						<input
							type="radio"
							id={`${props.name}-${button.value}`}
							name={props.name}
							value={button.value}
							checked={props.value() === button.value}
							onChange={props.onChange}
						/>
						<label
							for={`${props.name}-${button.value}`}
							data-name={props.name}
							title={button.title}
							class={styles.radioLabel}
						>
							{button.label}
						</label>
					</div>
				)}
			</For>
			<Show when={props.reset}>
				<div class={styles.radioButton}>
					<button
						class={`${styles.button} ${styles.shiftLeft}`}
						onClick={(e) => {
							props.reset?.(e);
						}}
					>
						<RestartAltOutlined />
						{t('buttonReset')}
					</button>
				</div>
			</Show>
		</div>
	);
}

/**
 * Checkbox made for connector options
 */
export function ConnectorOptionEntry<
	K extends keyof Options.ConnectorOptions,
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
	return (
		<li>
			<Checkbox
				title={t(props.i18ntitle)}
				label={t(props.i18nlabel)}
				isChecked={() =>
					props.options()?.[props.connector]?.[props.key] as boolean
				}
				onInput={(e) => {
					const connector = props.connector;
					const key = props.key;
					const connectorOptions = props.connectorOptions;
					props.setOptions.mutate((o) => {
						if (!o) {
							return o;
						}
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
	return (
		<li>
			<Checkbox
				title={t(props.i18ntitle)}
				label={t(props.i18nlabel)}
				isChecked={() => props.options()?.[props.key] as boolean}
				onInput={(e) => {
					const key = props.key;
					const globalOptions = props.globalOptions;
					props.setOptions.mutate((o) => {
						if (!o) {
							return o;
						}
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
 * Range style input
 */
export function RangeOptionEntry(props: {
	options: Resource<Options.GlobalOptions | null>;
	setOptions: ResourceActions<
		Options.GlobalOptions | null | undefined,
		unknown
	>;
	min: number;
	max: number;
	prefixi18n: string;
	suffixi18n: string;
	numberType: 'percent';
	globalOptions: StorageWrapper<typeof BrowserStorage.OPTIONS>;
	key: keyof Options.GlobalOptions;
}) {
	return (
		<li
			class={styles.rangeInput}
			role="group"
			aria-label={`${t(props.prefixi18n)} ${
				props.options()?.[props.key] as number
			}% ${t(props.suffixi18n)}`}
		>
			<div>
				<span class={styles.rangeInputLabel}>
					{t(props.prefixi18n)}
				</span>
				<div
					class={`${styles.inputWrapper} ${styles[props.numberType]}`}
				>
					<input
						type="number"
						min={props.min}
						max={props.max}
						value={props.options()?.[props.key] as number}
						class={styles.rangeNumberInput}
						onChange={(e) => {
							const key = props.key;
							const globalOptions = props.globalOptions;
							const min = props.min;
							const max = props.max;
							props.setOptions.mutate((o) => {
								if (!o) {
									return o;
								}
								const newOptions = {
									...o,
									[key]: clamp(
										min,
										parseInt(e.currentTarget.value),
										max,
									),
								};
								globalOptions.set(newOptions);
								return newOptions;
							});
						}}
						title={`${t(props.prefixi18n)} ${
							props.options()?.[props.key] as number
						}% ${t(props.suffixi18n)}`}
					/>
				</div>
				<span class={styles.rangeInputLabel}>
					{t(props.suffixi18n)}
				</span>
			</div>
			<input
				type="range"
				min={props.min}
				max={props.max}
				value={props.options()?.[props.key] as number}
				class={styles.rangeSelection}
				onInput={(e) => {
					// dont actually apply it here; we'll get ratelimited REAL fast
					const key = props.key;
					props.setOptions.mutate((o) => {
						if (!o) {
							return o;
						}
						const newOptions = {
							...o,
							[key]: parseInt(e.currentTarget.value),
						};
						return newOptions;
					});
				}}
				onChange={(e) => {
					const key = props.key;
					const globalOptions = props.globalOptions;
					props.setOptions.mutate((o) => {
						if (!o) {
							return o;
						}
						const newOptions = {
							...o,
							[key]: parseInt(e.currentTarget.value),
						};
						globalOptions.set(newOptions);
						return newOptions;
					});
				}}
				title={`${t(props.prefixi18n)} ${
					props.options()?.[props.key] as number
				}% ${t(props.suffixi18n)}`}
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
	return (
		<div class={styles.tripleCheckboxOption}>
			<span title={props.title}>
				{props.label}
				<div
					class={styles.tripleCheckboxWrapper}
					role="radiogroup"
					aria-label={props.label}
				>
					<label
						class={`${styles.tripleCheckboxLabel} ${
							styles.unchecked
						}${
							props.state() === TripleCheckboxState.Unchecked
								? ` ${styles.activeBox}`
								: ''
						}`}
						title={t('optionsDisabled')}
					>
						<input
							class={styles.tripleCheckbox}
							type="radio"
							value="unchecked"
							name={`${props.id}-${props.label}`}
							checked={
								props.state() === TripleCheckboxState.Unchecked
							}
							onInput={() =>
								props.onInput(TripleCheckboxState.Unchecked)
							}
						/>
						<CloseOutlined />
					</label>
					<label
						class={`${styles.tripleCheckboxLabel} ${
							styles.indeterminate
						}${
							props.state() === TripleCheckboxState.Indeterminate
								? ` ${styles.activeBox}`
								: ''
						}`}
						title={t('optionsIndeterminate')}
					>
						<input
							class={styles.tripleCheckbox}
							type="radio"
							value="indeterminate"
							name={`${props.id}-${props.label}`}
							checked={
								props.state() ===
								TripleCheckboxState.Indeterminate
							}
							onInput={() =>
								props.onInput(TripleCheckboxState.Indeterminate)
							}
						/>
						<IndeterminateCheckBoxOutlined />
					</label>
					<label
						class={`${styles.tripleCheckboxLabel} ${
							styles.checked
						}${
							props.state() === TripleCheckboxState.Checked
								? ` ${styles.activeBox}`
								: ''
						}`}
						title={t('optionsEnabled')}
					>
						<input
							class={styles.tripleCheckbox}
							type="radio"
							value="checked"
							name={`${props.id}-${props.label}`}
							checked={
								props.state() === TripleCheckboxState.Checked
							}
							onInput={() =>
								props.onInput(TripleCheckboxState.Checked)
							}
						/>
						<CheckOutlined />
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
	return (
		<TripleCheckbox
			title={props.title}
			label={props.label}
			id={props.connector.id}
			state={() => {
				const override = props.overrideOptions()?.[props.connector.id];
				if (!override || !(props.option in override)) {
					return TripleCheckboxState.Indeterminate;
				}
				if (override[props.option]) {
					return TripleCheckboxState.Checked;
				}
				return TripleCheckboxState.Unchecked;
			}}
			onInput={(state) => {
				const connector = props.connector;
				const option = props.option;
				const connectorOverrideOptions = props.connectorOverrideOptions;
				props.setOverrideOptions.mutate((o) => {
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
