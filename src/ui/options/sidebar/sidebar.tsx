import { Accessor, For, Setter } from 'solid-js';
import { Settings } from '../main';
import styles from './sidebar.module.scss';
import { t } from '@/util/i18n';

/**
 * Button corresponding to a specific subsection of preferences in sidebar
 */
function SidebarButton(props: {
	item: Settings;
	activeSetting: Accessor<Settings>;
	setActiveSetting: Setter<Settings>;
}) {
	const { item, activeSetting, setActiveSetting } = props;
	return (
		<button
			class={
				styles.sidebarButton +
				(activeSetting().namei18n === item.namei18n
					? ' ' + styles.active
					: '')
			}
			onClick={() => setActiveSetting(item)}
		>
			<item.icon />
			{t(item.namei18n)}
		</button>
	);
}

/**
 * Component that shows nav sidebar
 */
export default function Sidebar(props: {
	items: Settings[];
	activeSetting: Accessor<Settings>;
	setActiveSetting: Setter<Settings>;
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
