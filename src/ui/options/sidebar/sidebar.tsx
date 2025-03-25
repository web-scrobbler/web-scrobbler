import type { Accessor, Setter } from 'solid-js';
import { For, Show } from 'solid-js';
import type {
	Navigator,
	NavigatorNavigationButton,
	NavigatorButtonGroup,
	NavigatorButton,
} from '@/ui/options/components/navigator';
import {
	triggerNavigationButton,
	itemIsSingular,
} from '@/ui/options/components/navigator';
import styles from './sidebar.module.scss';
import { t } from '@/util/i18n';

/**
 * Button corresponding to a specific subsection of preferences in sidebar
 */
function SidebarButton(props: {
	item: NavigatorButton | NavigatorButtonGroup;
	activeSetting: Accessor<NavigatorNavigationButton>;
	setActiveSetting: Setter<NavigatorNavigationButton>;
}) {
	return (
		<Show
			when={itemIsSingular(props.item)}
			fallback={
				<For each={(props.item as NavigatorButtonGroup).group}>
					{(groupItem) => (
						<SidebarButton
							item={groupItem}
							activeSetting={props.activeSetting}
							setActiveSetting={props.setActiveSetting}
						/>
					)}
				</For>
			}
		>
			<button
				class={
					styles.sidebarButton +
					(props.activeSetting().namei18n === props.item.namei18n
						? ` ${styles.active}`
						: '')
				}
				onClick={() =>
					triggerNavigationButton(
						props.item as NavigatorButton,
						props.setActiveSetting,
					)
				}
			>
				<props.item.icon />
				{t(props.item.namei18n)}
			</button>
		</Show>
	);
}

/**
 * Component that shows nav sidebar
 */
export default function Sidebar(props: {
	items: Navigator;
	activeSetting: Accessor<NavigatorNavigationButton>;
	setActiveSetting: Setter<NavigatorNavigationButton>;
}) {
	return (
		<div class={styles.sidebarWrapper}>
			<nav class={styles.sidebar}>
				<For each={props.items}>
					{(item) => (
						<SidebarButton
							item={item}
							activeSetting={props.activeSetting}
							setActiveSetting={props.setActiveSetting}
						/>
					)}
				</For>
			</nav>
		</div>
	);
}
