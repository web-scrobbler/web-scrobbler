import { render } from 'solid-js/web';
import styles from './settings.module.scss';
import { initializeThemes } from '@/theme/themes';
import '@/theme/themes.scss';
import { Match, Switch, createSignal, onCleanup } from 'solid-js';
import ShowSomeLove from './components/showSomeLove';
import Favorite from '@suid/icons-material/FavoriteOutlined';
import Info from '@suid/icons-material/InfoOutlined';
import Help from '@suid/icons-material/HelpOutlined';
import Contacts from '@suid/icons-material/ContactsOutlined';
import Settings from '@suid/icons-material/SettingsOutlined';
import Close from '@suid/icons-material/CloseOutlined';
import ManageAccounts from '@suid/icons-material/ManageAccountsOutlined';
import Sidebar from './sidebar/sidebar';
import InfoComponent from '@/ui/options/components/info';
import FAQ from './components/faq';
import ContactComponent from './components/contact';
import OptionsComponent, { EditsModal } from './components/options';
import Accounts from './components/accounts';

export type Settings =
	| {
			namei18n: 'optionsAccounts';
			icon: typeof ManageAccounts;
			element: typeof Accounts;
	  }
	| {
			namei18n: 'optionsOptions';
			icon: typeof Settings;
			element: typeof OptionsComponent;
	  }
	| {
			namei18n: 'contactTitle';
			icon: typeof Contacts;
			element: typeof ContactComponent;
	  }
	| {
			namei18n: 'faqTitle';
			icon: typeof Help;
			element: typeof FAQ;
	  }
	| {
			namei18n: 'optionsAbout';
			icon: typeof Info;
			element: typeof InfoComponent;
	  }
	| {
			namei18n: 'showSomeLoveTitle';
			icon: typeof Favorite;
			element: typeof ShowSomeLove;
	  };

const settings: Settings[] = [
	{ namei18n: 'optionsAccounts', icon: ManageAccounts, element: Accounts },
	{ namei18n: 'optionsOptions', icon: Settings, element: OptionsComponent },
	{ namei18n: 'contactTitle', icon: Contacts, element: ContactComponent },
	{ namei18n: 'faqTitle', icon: Help, element: FAQ },
	{ namei18n: 'optionsAbout', icon: Info, element: InfoComponent },
	{ namei18n: 'showSomeLoveTitle', icon: Favorite, element: ShowSomeLove },
];

function Options() {
	const [activeSetting, setActiveSetting] = createSignal<Settings>({
		namei18n: 'showSomeLoveTitle',
		icon: Favorite,
		element: ShowSomeLove,
	});
	const [activeModal, setActiveModal] = createSignal<string>('');
	let modal: HTMLDialogElement | undefined;

	const onclick = (e: MouseEvent) => {
		const target = e.target;
		if (!(target instanceof HTMLElement)) return;
		if (
			target.closest(`.${styles.modal}`) &&
			!target.classList.contains(styles.modal)
		)
			return;
		modal?.close();
	};
	document.addEventListener('click', onclick);
	onCleanup(() => document.removeEventListener('click', onclick));

	return (
		<>
			<div class={styles.settings}>
				<Sidebar
					items={settings}
					activeSetting={activeSetting}
					setActiveSetting={setActiveSetting}
				/>
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

const root = document.getElementById('root');
if (!root) {
	throw new Error('Root element not found');
}
render(Options, root);
void initializeThemes();
