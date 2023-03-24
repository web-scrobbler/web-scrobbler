import { render } from 'solid-js/web';
import './popup.module.scss';
import Unsupported from './unsupported';
import * as ControllerMode from '@/core/object/controller/controller-mode';
import { initializeThemes } from '@/theme/themes';
import '@/theme/themes.scss';
import { Match, Switch, createResource } from 'solid-js';
import { popupListener, setupPopupListeners } from '@/util/communication';
import Base from './base';
import { getCurrentTab } from '@/core/background/util';
import Disabled from './disabled';
import Err from './err';
import NowPlaying from './nowplaying';
import Edit from './edit';

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
	);
}

//render the popup
const root = document.getElementById('root');
if (!root) {
	throw new Error('Root element not found');
}
render(Popup, root);
void initializeThemes();
