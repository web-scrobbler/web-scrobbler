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
import ToggleOn from '@suid/icons-material/ToggleOnOutlined';
import ToggleOff from '@suid/icons-material/ToggleOffOutlined';
import Timer from '@suid/icons-material/TimerOutlined';
import ConnectorOverrideOptions from '@/ui/options/components/connector-override';
import EditOptions from '@/ui/options/components/edit-options/edit-options';
import Favorite from '@suid/icons-material/FavoriteOutlined';
import browser from 'webextension-polyfill';
import {
	disableConnector,
	disableUntilClosed,
	enableConnector,
	getCurrentTab,
} from '@/core/background/util';
import { getConnectorByUrl } from '@/util/util-connector';
import * as ControllerMode from '@/core/object/controller/controller-mode';

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

async function getToggleNavigators(): Promise<NavigatorActionButton[]> {
	const tab = await getCurrentTab();

	if (tab.mode === ControllerMode.Unsupported) {
		return [];
	}

	if (tab.mode === ControllerMode.Disabled) {
		return [
			{
				namei18n: 'menuEnableConnector',
				icon: ToggleOn,
				action: () => {
					enableConnector(tab.tabId);
				},
			},
		];
	}

	return [
		{
			namei18n: 'menuDisableConnector',
			icon: ToggleOff,
			action: () => {
				disableConnector(tab.tabId);
			},
		},
		{
			namei18n: 'menuDisableUntilTabClosed',
			icon: Timer,
			action: () => {
				disableUntilClosed(tab.tabId);
			},
		},
	];
}

export async function getMobileNavigatorGroup(): Promise<NavigatorButtonGroup> {
	const group: NavigatorButtonGroup = {
		namei18n: 'optionsOptions',
		icon: Settings,
		group: [
			{
				namei18n: 'optionsOptions',
				icon: Settings,
				action: () => {
					browser.tabs.create({
						url: browser.runtime.getURL(
							'src/ui/options/index.html'
						),
					});
				},
			},
		],
	};

	const toggleNavigators = await getToggleNavigators();
	group.group.push(...toggleNavigators);

	return group;
}

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
	return !('group' in item);
}
