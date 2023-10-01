import { Resource, ResourceActions } from 'solid-js';
import { RadioButtons } from '../inputs';
import * as BrowserStorage from '@/core/storage/browser-storage';
import * as Options from '@/core/storage/options';
import { t } from '@/util/i18n';

const globalOptions = BrowserStorage.getStorage(BrowserStorage.OPTIONS);

/**
 * Component that allows the user to select requirements for the scrobbler to actually scrobble a song.
 */
export default function ScrobbleBehavior(props: {
	options: Resource<Options.GlobalOptions | null>;
	setOptions: ResourceActions<
		Options.GlobalOptions | null | undefined,
		unknown
	>;
}) {
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
					if (props.options()?.[Options.FORCE_RECOGNIZE]) {
						return Options.FORCE_RECOGNIZE;
					}
					if (
						props.options()?.[Options.SCROBBLE_EDITED_TRACKS_ONLY]
					) {
						return Options.SCROBBLE_EDITED_TRACKS_ONLY;
					}
					return Options.SCROBBLE_RECOGNIZED_TRACKS;
				}}
				onChange={(e) => {
					const value = e.currentTarget.value;
					props.setOptions.mutate((o) => {
						if (!o) {
							return o;
						}
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
