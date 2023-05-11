import { Component, Setter } from 'solid-js';
import Info from '@suid/icons-material/InfoOutlined';
import Help from '@suid/icons-material/HelpOutlined';
import Contacts from '@suid/icons-material/ContactsOutlined';
import Settings from '@suid/icons-material/SettingsOutlined';
import Edit from '@suid/icons-material/EditOutlined';
import Extension from '@suid/icons-material/ExtensionOutlined';
import ManageAccounts from '@suid/icons-material/ManageAccountsOutlined';
import InfoComponent from '@/ui/options/components/info';
import ShowSomeLove from '@/ui/options/components/showSomeLove';
import FAQ from '@/ui/options/components/faq';
import ContactComponent from '@/ui/options/components/contact';
import OptionsComponent from '@/ui/options/components/options/options';
import Accounts from '@/ui/options/components/accounts';
import ConnectorOverrideOptions from '@/ui/options/components/connector-override';
import EditOptions from '@/ui/options/components/edit-options/edit-options';
import Favorite from '@suid/icons-material/FavoriteOutlined';

/**
 * Type indicating possible states for modal
 */
export type ModalType = 'savedEdits' | 'regexEdits' | '';

/**
 * Singular navigator button
 */
export type NavigatorNavigationButton = {
	namei18n: string;
	icon: typeof ManageAccounts;
	element: Component<{
		setActiveModal: Setter<ModalType>;
		modal: HTMLDialogElement | undefined;
	}>;
};

/**
 * Singular navigator button that performs an action rather than opening a page
 */
export type NavigatorActionButton = {
	namei18n: string;
	icon: typeof ManageAccounts;
	action: () => void;
};

export type NavigatorButton = NavigatorNavigationButton | NavigatorActionButton;

/**
 * Group of navigator buttons
 */
export type NavigatorButtonGroup = {
	namei18n: string;
	icon: typeof ManageAccounts;
	group: NavigatorButton[];
};

/**
 * A navigator consisting of a list of buttons and button groups
 */
export type Navigator = (NavigatorButton | NavigatorButtonGroup)[];

/**
 * All the different options pages, their sidebar labels, and icons.
 */
export const settings: Navigator = [
	{ namei18n: 'optionsAccounts', icon: ManageAccounts, element: Accounts },
	{
		namei18n: 'optionsOptions',
		icon: Settings,
		group: [
			{
				namei18n: 'optionsOptions',
				icon: Settings,
				element: OptionsComponent,
			},
			{ namei18n: 'optionsEdits', icon: Edit, element: EditOptions },
			{
				namei18n: 'optionsConnectors',
				icon: Extension,
				element: ConnectorOverrideOptions,
			},
		],
	},
	{
		namei18n: 'optionsAbout',
		icon: Info,
		group: [
			{
				namei18n: 'contactTitle',
				icon: Contacts,
				element: ContactComponent,
			},
			{ namei18n: 'faqTitle', icon: Help, element: FAQ },
			{ namei18n: 'optionsAbout', icon: Info, element: InfoComponent },
		],
	},
	{ namei18n: 'showSomeLoveTitle', icon: Favorite, element: ShowSomeLove },
];

export function triggerNavigationButton(
	button: NavigatorButton | NavigatorButtonGroup,
	setActiveSetting: Setter<NavigatorNavigationButton>
) {
	if ('group' in button) {
		return;
	}

	if ('element' in button) {
		setActiveSetting(button);
	} else {
		button.action();
	}
}

/**
 * Checks if a navigator item is a singular item or a group
 *
 * @param item - Item to check if singular
 * @returns true if item is singular, false if item is a group
 */
export function itemIsSingular(
	item: NavigatorButton | NavigatorButtonGroup
): item is NavigatorButton {
	return 'element' in item;
}
