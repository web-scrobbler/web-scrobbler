import { For, Resource, ResourceActions, Show, createResource } from 'solid-js';
import * as Options from '@/core/storage/options';
import * as BrowserStorage from '@/core/storage/browser-storage';
import browser from 'webextension-polyfill';
import { GlobalOptionEntry } from '../inputs';
import styles from '../components.module.scss';
import { t } from '@/util/i18n';
import { capitalizeFirstLetter, debugLog } from '@/util/util';
import {
	ModifiedTheme,
	getTheme,
	modifiedThemeList,
	themeList,
	updateTheme,
} from '@/theme/themes';

const globalOptions = BrowserStorage.getStorage(BrowserStorage.OPTIONS);

/**
 * Component that shows the basic global options to the user.
 */
export default function GlobalOptionsList(props: {
	options: Resource<Options.GlobalOptions | null>;
	setOptions: ResourceActions<
		Options.GlobalOptions | null | undefined,
		unknown
	>;
}) {
	return (
		<>
			<h2>{t('optionsGeneral')}</h2>
			<ul class={styles.optionList}>
				<ThemeSelector />
				<Show when={browser.notifications}>
					<GlobalOptionEntry
						options={props.options}
						setOptions={props.setOptions}
						globalOptions={globalOptions}
						i18ntitle="optionUseNotificationsTitle"
						i18nlabel="optionUseNotifications"
						key={Options.USE_NOTIFICATIONS}
					/>
					<GlobalOptionEntry
						options={props.options}
						setOptions={props.setOptions}
						globalOptions={globalOptions}
						i18ntitle="optionUnrecognizedNotificationsTitle"
						i18nlabel="optionUnrecognizedNotifications"
						key={Options.USE_UNRECOGNIZED_SONG_NOTIFICATIONS}
					/>
				</Show>
				<GlobalOptionEntry
					options={props.options}
					setOptions={props.setOptions}
					globalOptions={globalOptions}
					i18ntitle="optionUseInfoboxTitle"
					i18nlabel="optionUseInfobox"
					key={Options.USE_INFOBOX}
				/>
				<GlobalOptionEntry
					options={props.options}
					setOptions={props.setOptions}
					globalOptions={globalOptions}
					i18ntitle="optionScrobblePodcastsTitle"
					i18nlabel="optionScrobblePodcasts"
					key={Options.SCROBBLE_PODCASTS}
				/>
			</ul>
		</>
	);
}

const [theme, setTheme] = createResource(getTheme);

/**
 * Component that allows the user to select a display theme.
 */
function ThemeSelector() {
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
									',',
								)}`,
								'error',
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
										themeName,
									)}`,
								)}
							</option>
						)}
					</For>
				</select>
			</label>
		</div>
	);
}
