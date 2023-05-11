import { Accessor, For, Setter, Show } from 'solid-js';
import {
	Navigator,
	NavigatorNavigationButton,
	NavigatorButtonGroup,
	NavigatorButton,
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
	const { item, activeSetting, setActiveSetting } = props;
	return (
		<Show
			when={itemIsSingular(item)}
			fallback={
				<For each={(item as NavigatorButtonGroup).group}>
					{(groupItem) => (
						<SidebarButton
							item={groupItem}
							activeSetting={activeSetting}
							setActiveSetting={setActiveSetting}
						/>
					)}
				</For>
			}
		>
			<button
				class={
					styles.sidebarButton +
					(activeSetting().namei18n === item.namei18n
						? ' ' + styles.active
						: '')
				}
				onClick={() =>
					triggerNavigationButton(
						item as NavigatorButton,
						setActiveSetting
					)
				}
			>
				<item.icon />
				{t(item.namei18n)}
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
	const { items, activeSetting, setActiveSetting } = props;
	return (
		<div class={styles.sidebarWrapper}>
			<nav class={styles.sidebar}>
				<For each={items}>
					{(item) => (
						<SidebarButton
							item={item}
							activeSetting={activeSetting}
							setActiveSetting={setActiveSetting}
						/>
					)}
				</For>
			</nav>
		</div>
	);
}
