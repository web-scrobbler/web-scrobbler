import { render } from 'solid-js/web';
import './popup.module.scss';
import Unsupported from './unsupported';
import * as ControllerMode from '@/core/object/controller/controller-mode';
import { initializeThemes } from '@/theme/themes';
import '@/theme/themes.scss';
import {
	Match,
	Switch,
	createResource,
	Show,
	createMemo,
	Accessor,
	createEffect,
} from 'solid-js';
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
import { PopupAnchor, isIos } from '../components/util';
import ContextMenu from '../components/context-menu/context-menu';
import {
	Navigator,
	getMobileNavigatorGroup,
} from '../options/components/navigator';

/**
 * List of modes that have a settings button in the popup content, dont show supplementary settings icon.
 * Also include loading mode as it is too small.
 */
const settingModes = [
	ControllerMode.Disabled,
	ControllerMode.Err,
	ControllerMode.Loading,
];

/**
 * List of modes that already have context menu handling in the popup content, dont show supplementary context menu on ios.
 */
const contextMenuModes = [
	ControllerMode.Playing,
	ControllerMode.Skipped,
	ControllerMode.Scrobbled,
	ControllerMode.Loading,
	ControllerMode.Unknown,
];

/**
 * Component that determines what popup to show, and then shows it
 */
function Popup() {
	const [tab, setTab] = createResource(getCurrentTab);
	const [navigatorResource, { refetch }] = createResource(
		getMobileNavigatorGroup
	);

	createEffect(() => {
		tab(); // does nothing, but causes the effect to re-run when the tab changes
		refetch();
	});

	const items: Accessor<Navigator> = createMemo(() => {
		if (!navigatorResource.loading) {
			const navigator = navigatorResource();
			if (navigator) {
				return [navigator];
			}
		}
		return [];
	});

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
			<Show
				when={!contextMenuModes.includes(tab()?.mode ?? '') && isIos()}
			>
				<ContextMenu items={items()} />
			</Show>
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

			<Show when={!settingModes.includes(tab()?.mode ?? '') && !isIos()}>
				<PopupAnchor
					href={browser.runtime.getURL('src/ui/options/index.html')}
					class={styles.settingsIcon}
					title={t('disabledSiteButton')}
				>
					<Settings />
				</PopupAnchor>
			</Show>
		</>
	);
}

//render the popup
const body = document.body;
const root = document.createElement('div');
root.id = 'root';
root.classList.add(styles.root);
body.appendChild(root);
render(Popup, root);
void initializeThemes();
