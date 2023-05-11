import {
	Navigator,
	NavigatorButton,
	NavigatorButtonGroup,
	NavigatorNavigationButton,
	itemIsSingular,
	triggerNavigationButton,
} from '@/ui/options/components/navigator';
import { For, Setter, Show, createSignal, onMount } from 'solid-js';
import styles from './context-menu.module.scss';
import { t } from '@/util/i18n';

function closeDialogs(e: MouseEvent) {
	const dialogs = document.querySelectorAll('dialog');
	dialogs.forEach((dialog) => {
		dialog.close();
	});
	const dialogButtons = document.querySelectorAll(
		`.${styles.activeDialogButton}`
	);
	dialogButtons.forEach((dialogButton) => {
		dialogButton.classList.remove(styles.activeDialogButton);
	});

	if (!(e.target instanceof Element)) return;

	const dialogButton = e.target.closest(`.${styles.contextMenuItem}`);
	const dialog = dialogButton?.nextElementSibling;

	if (!(dialog instanceof HTMLDialogElement)) return;

	dialog.show();
	dialogButton?.classList.add(styles.activeDialogButton);
}

export default function ContextMenu(props: {
	items: Navigator;
	setActiveSetting: Setter<NavigatorNavigationButton>;
}) {
	onMount(() => {
		window.addEventListener('click', closeDialogs);
		return () => window.removeEventListener('click', closeDialogs);
	});

	return (
		<div class={styles.contextMenu}>
			<ContextMenuItems
				items={props.items}
				setActiveSetting={props.setActiveSetting}
			/>
		</div>
	);
}

function ContextMenuItems(props: {
	items: Navigator;
	setActiveSetting: Setter<NavigatorNavigationButton>;
}) {
	return (
		<For each={props.items}>
			{(item) => (
				<ContextMenuItem
					item={item}
					setActiveSetting={props.setActiveSetting}
				/>
			)}
		</For>
	);
}

function ContextMenuItem(props: {
	item: NavigatorButtonGroup | NavigatorButton;
	setActiveSetting: Setter<NavigatorNavigationButton>;
}) {
	const [mounted, setMounted] = createSignal(false);
	// hacky way to ensure animation doesnt play on load. If its not loaded it just fails to display an animation, no big deal.
	onMount(() => {
		setTimeout(() => {
			setMounted(true);
		}, 1000);
	});
	return (
		<>
			<button
				class={styles.contextMenuItem}
				onClick={() =>
					triggerNavigationButton(props.item, props.setActiveSetting)
				}
			>
				<props.item.icon />
				<label>{t(props.item.namei18n)}</label>
			</button>
			<Show when={!itemIsSingular(props.item)}>
				<dialog
					class={`${styles.contextMenuDialog} ${
						mounted() && `${styles.mountedAnimation}`
					}`}
				>
					<ContextMenuItems
						items={(props.item as NavigatorButtonGroup).group}
						setActiveSetting={props.setActiveSetting}
					/>
				</dialog>
			</Show>
		</>
	);
}
