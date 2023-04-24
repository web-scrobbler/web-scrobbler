import { render } from 'solid-js/web';
import './popup.module.scss';
import Unsupported from './unsupported';
import * as ControllerMode from '@/core/object/controller/controller-mode';
import { initializeThemes } from '@/theme/themes';
import '@/theme/themes.scss';
import { Match, Switch, createResource, Show } from 'solid-js';
import { popupListener, setupPopupListeners } from '@/util/communication';
import Base from './base';
import { getCurrentTab } from '@/core/background/util';
import Disabled from './disabled';
import Err from './err';
import NowPlaying from './nowplaying';
import Edit from './edit';
import Settings from '@suid/icons-material/SettingsOutlined';
import browser from 'webextension-polyfill';
import styles from './popup.module.scss';
import { t } from '@/util/i18n';

/**
 * List of modes that have a settings button in the popup content, dont show supplementary settings icon.
 * Also include loading mode as it is too small.
 */
const settingModes = [ControllerMode.Disabled, ControllerMode.Err, ControllerMode.Loading];

/**
 * Component that determines what popup to show, and then shows it
 */
function Popup() {
	const [tab, setTab] = createResource(getCurrentTab);

	setupPopupListeners(
		popupListener({
			type: 'currentTab',
			fn: (currentTab) => {
				setTab.mutate(currentTab);
			},
		})
	);

	return (
		<>
			<Switch fallback={<></>}>
				<Match when={tab()?.mode === ControllerMode.Base}>
					<Base />
				</Match>
				<Match when={tab()?.mode === ControllerMode.Disabled}>
					<Disabled />
				</Match>
				<Match when={tab()?.mode === ControllerMode.Err}>
					<Err />
				</Match>
				<Match
					when={
						tab()?.mode === ControllerMode.Playing ||
						tab()?.mode === ControllerMode.Skipped ||
						tab()?.mode === ControllerMode.Scrobbled
					}
				>
					<NowPlaying tab={tab} />
				</Match>
				<Match when={tab()?.mode === ControllerMode.Unknown}>
					<Edit tab={tab} />
				</Match>
				<Match when={tab()?.mode === ControllerMode.Unsupported}>
					<Unsupported />
				</Match>
			</Switch>

			<Show when={!settingModes.includes(tab()?.mode ?? '')}>
				<a
					href={browser.runtime.getURL('src/ui/options/index.html')}
					class={styles.settingsIcon}
					target="_blank"
					title={t('disabledSiteButton')}
					rel="noopener noreferrer"
				>
					<Settings />
				</a>
			</Show>
		</>
	);
}

//render the popup
const root = document.getElementById('root');
if (!root) {
	throw new Error('Root element not found');
}
render(Popup, root);
void initializeThemes();
