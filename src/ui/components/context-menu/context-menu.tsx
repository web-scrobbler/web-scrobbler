import type {
	Navigator,
	NavigatorButton,
	NavigatorButtonGroup,
	NavigatorNavigationButton,
} from '@/ui/options/components/navigator';
import {
	itemIsSingular,
	triggerNavigationButton,
} from '@/ui/options/components/navigator';
import type { Accessor, Setter } from 'solid-js';
import { For, Show, createMemo, createSignal, onMount } from 'solid-js';
import styles from './context-menu.module.scss';
import { t } from '@/util/i18n';

function closeDialogs(e: MouseEvent) {
	if (!(e.target instanceof Element)) {
		return;
	}

	const dialogButton = e.target.closest(`.${styles.contextMenuItem}`);
	const dialog = dialogButton?.nextElementSibling;

	let currentlyOpen = true;
	if (dialog instanceof HTMLDialogElement) {
		currentlyOpen = dialog.open;
	}

	const dialogs = document.querySelectorAll('dialog');
	dialogs.forEach((dialog) => {
		dialog.close();
	});
	const dialogButtons = document.querySelectorAll(
		`.${styles.activeDialogButton}`,
	);
	dialogButtons.forEach((dialogButton) => {
		dialogButton.classList.remove(styles.activeDialogButton);
	});

	if (!(dialog instanceof HTMLDialogElement) || currentlyOpen) {
		return;
	}

	dialog.show();
	dialogButton?.classList.add(styles.activeDialogButton);
}

export default function ContextMenu(props: {
	items: Navigator;
	setActiveSetting?: Setter<NavigatorNavigationButton>;
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
	setActiveSetting?: Setter<NavigatorNavigationButton>;
}) {
	return (
		<For each={props.items}>
			{(item, index) => (
				<ContextMenuItem
					index={index}
					length={props.items.length}
					item={item}
					setActiveSetting={props.setActiveSetting}
				/>
			)}
		</For>
	);
}

function ContextMenuItem(props: {
	index: Accessor<number>;
	length: number;
	item: NavigatorButtonGroup | NavigatorButton;
	setActiveSetting?: Setter<NavigatorNavigationButton>;
}) {
	const [mounted, setMounted] = createSignal(false);
	const locationClass = createMemo(() => {
		if (props.length === 1) {
			return styles.centerDialog;
		}
		if (props.index() === 0) {
			return styles.leftDialog;
		}
		if (props.index() === props.length - 1) {
			return styles.rightDialog;
		}
		return styles.centerDialog;
	});

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
				onClick={() => {
					if (props.setActiveSetting && 'element' in props.item) {
						triggerNavigationButton(
							props.item,
							props.setActiveSetting,
						);
					}
					if ('action' in props.item) {
						props.item.action();
					}
				}}
			>
				<props.item.icon />
				<label>
					{t(props.item.namei18n, props.item.i18nSubstitution)}
				</label>
			</button>
			<Show when={!itemIsSingular(props.item)}>
				<dialog
					class={`${styles.contextMenuDialog} ${locationClass()} ${
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
