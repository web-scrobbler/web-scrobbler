import { render } from 'solid-js/web';
import styles from './settings.module.scss';
import { initializeThemes } from '@/theme/themes';
import '@/theme/themes.scss';
import { Match, Show, Switch, createSignal, onCleanup } from 'solid-js';
import Close from '@suid/icons-material/CloseOutlined';
import Sidebar from './sidebar/sidebar';
import { EditsModal } from './components/edit-options/edited-tracks';
import Permissions from './components/permissions';
import { RegexEditsModal } from './components/edit-options/regex-edits';
import {
	ModalType,
	NavigatorNavigationButton,
	aboutItem,
	settings,
	showSomeLoveItem,
} from './components/navigator';
import ContextMenu from '../components/context-menu/context-menu';

/**
 * Media query for detecting whether to use context menu or sidebar
 *
 * @returns true if the context menu should be shown, false if the sidebar should be shown
 */
function contextMenuQuery() {
	return window.matchMedia('(max-width: 700px)').matches;
}

// Show some love as default except safari, where we don't want it shown because apple
let defaultSetting = aboutItem;
// #v-ifndef VITE_SAFARI
defaultSetting = showSomeLoveItem;
// #v-endif

/**
 * Preferences component, with a sidebar and several different options and info pages
 */
function Options() {
	const [activeSetting, setActiveSetting] =
		createSignal<NavigatorNavigationButton>(defaultSetting);
	const [activeModal, setActiveModal] = createSignal<ModalType>('');
	let modal: HTMLDialogElement | undefined;

	const onclick = (e: MouseEvent) => {
		const target = e.target;
		if (!(target instanceof HTMLElement)) {
			return;
		}
		if (
			target.closest(`.${styles.modal}`) &&
			!target.classList.contains(styles.modal)
		) {
			e.stopPropagation();
			return;
		}
		modal?.close();
	};
	document.addEventListener('click', onclick);
	onCleanup(() => document.removeEventListener('click', onclick));

	const [shouldShowContextMenu, setShouldShowContextMenu] = createSignal(
		contextMenuQuery()
	);
	const resizeListener = () => setShouldShowContextMenu(contextMenuQuery());
	window.addEventListener('resize', resizeListener);

	return (
		<>
			<Permissions />
			<div class={styles.settings}>
				<Show
					when={shouldShowContextMenu()}
					fallback={
						<Sidebar
							items={settings}
							activeSetting={activeSetting}
							setActiveSetting={setActiveSetting}
						/>
					}
				>
					<ContextMenu
						items={settings}
						setActiveSetting={setActiveSetting}
					/>
				</Show>
				<div class={styles.settingsContentWrapper}>
					<div class={styles.settingsContent}>
						{activeSetting().element({ setActiveModal, modal })}
					</div>
				</div>
			</div>
			<dialog
				ref={modal}
				class={styles.modal}
				onClose={() => setActiveModal('')}
			>
				<div class={styles.modalContent}>
					<Switch fallback={<div>Loading...</div>}>
						<Match when={activeModal() === 'savedEdits'}>
							<EditsModal />
						</Match>
						<Match when={activeModal() === 'regexEdits'}>
							<RegexEditsModal />
						</Match>
					</Switch>
				</div>
				<button
					class={styles.modalClose}
					onClick={() => modal?.close()}
				>
					<Close />
				</button>
			</dialog>
		</>
	);
}

// Render the Options component using SolidJS
const root = document.getElementById('root');
if (!root) {
	throw new Error('Root element not found');
}
render(Options, root);
void initializeThemes();
