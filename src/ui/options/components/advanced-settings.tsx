import * as BrowserStorage from '@/core/storage/browser-storage';
import { t } from '@/util/i18n';
import { createResource } from 'solid-js';
import { GlobalOptionEntry, RadioButtons, RangeOptionEntry } from './inputs';
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
			<AlbumGuessing />
		</>
	);
}

/**
 * Component that allows the user to select requirements for the scrobbler to actually scrobble a song.
 */
function AlbumGuessing() {
	return (
		<>
			<h2 id="header-album-guessing">{t('optionsAlbumGuessing')}</h2>
			<RadioButtons
				buttons={[
					{
						label: t('optionAlbumGuessingDisabled'),
						title: t('optionAlbumGuessingDisabledTitle'),
						value: Options.ALBUM_GUESSING_DISABLED,
					},
					{
						label: t('optionAlbumGuessingUneditedOnly'),
						title: t('optionAlbumGuessingUneditedOnlyTitle'),
						value: Options.ALBUM_GUESSING_UNEDITED_ONLY,
					},
					{
						label: t('optionAlbumGuessingAllTracks'),
						title: t('optionAlbumGuessingAllTracksTitle'),
						value: Options.ALBUM_GUESSING_ALL_TRACKS,
					},
				]}
				name="albumGuessing"
				value={() => {
					if (options()?.[Options.ALBUM_GUESSING_ALL_TRACKS]) {
						return Options.ALBUM_GUESSING_ALL_TRACKS;
					}
					if (options()?.[Options.ALBUM_GUESSING_UNEDITED_ONLY]) {
						return Options.ALBUM_GUESSING_UNEDITED_ONLY;
					}
					return Options.ALBUM_GUESSING_DISABLED;
				}}
				onChange={(e) => {
					const value = e.currentTarget.value;
					setOptions.mutate((o) => {
						if (!o) {
							return o;
						}
						const newOptions = {
							...o,
							[Options.ALBUM_GUESSING_ALL_TRACKS]:
								value === Options.ALBUM_GUESSING_ALL_TRACKS,
							[Options.ALBUM_GUESSING_UNEDITED_ONLY]:
								value === Options.ALBUM_GUESSING_UNEDITED_ONLY,
							[Options.ALBUM_GUESSING_DISABLED]:
								value === Options.ALBUM_GUESSING_DISABLED,
						};
						globalOptions.set(newOptions);
						return newOptions;
					});
				}}
				labelledby="header-album-guessing"
			/>
		</>
	);
}
