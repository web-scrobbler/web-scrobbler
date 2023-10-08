import * as BrowserStorage from '@/core/storage/browser-storage';
import { t } from '@/util/i18n';
import { createResource } from 'solid-js';
import { GlobalOptionEntry, RangeOptionEntry } from './inputs';
import * as Options from '../../../core/storage/options';
import styles from './components.module.scss';

const globalOptions = BrowserStorage.getStorage(BrowserStorage.OPTIONS);

const [options, setOptions] = createResource(
	globalOptions.get.bind(globalOptions),
);

/**
 * Component that shows options to the user
 */
export default function AdvancedOptionsComponent() {
	return (
		<>
			<h1>{t('optionsAdvanced')}</h1>
			<ul class={styles.optionList}>
				<GlobalOptionEntry
					options={options}
					setOptions={setOptions}
					globalOptions={globalOptions}
					i18ntitle="optionDebugLoggingEnabledTitle"
					i18nlabel="optionDebugLoggingEnabled"
					key={Options.DEBUG_LOGGING_ENABLED}
				/>
				<RangeOptionEntry
					options={options}
					setOptions={setOptions}
					globalOptions={globalOptions}
					numberType="percent"
					prefixi18n="optionScrobblePercent"
					suffixi18n="optionScrobblePercentSuffix"
					min={10}
					max={100}
					key={Options.SCROBBLE_PERCENT}
				/>
				<li class={styles.muted}>{t('optionPercentDesc')}</li>
			</ul>
		</>
	);
}
