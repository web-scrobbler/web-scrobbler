import { Accessor, For, Setter } from 'solid-js';
import { Settings } from '../main';
import styles from './sidebar.module.scss';
import { t } from '@/util/i18n';

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

export default function Sidebar(props: {
	items: Settings[];
	activeSetting: Accessor<Settings>;
	setActiveSetting: Setter<Settings>;
}) {
	const { items, activeSetting, setActiveSetting } = props;
	return (
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
	);
}
