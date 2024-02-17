import { Component, Setter } from 'solid-js';
import {
	InfoOutlined,
	HelpOutlined,
	ContactsOutlined,
	SettingsOutlined,
	EditOutlined,
	ExtensionOutlined,
	ManageAccountsOutlined,
	TuneOutlined,
	ToggleOnOutlined,
	ToggleOffOutlined,
	TimerOutlined,
	FavoriteOutlined,
	PersonOutlined,
	PersonOffOutlined,
	QueueMusicOutlined,
} from '@/ui/components/icons';

import InfoComponent from '@/ui/options/components/info';
import ShowSomeLove from '@/ui/options/components/show-some-love';
import FAQ from '@/ui/options/components/faq';
import ContactComponent from '@/ui/options/components/contact';
import OptionsComponent from '@/ui/options/components/options/options';
import Accounts from '@/ui/options/components/accounts';
import ConnectorOverrideOptions from '@/ui/options/components/connector-override';
import EditOptions from '@/ui/options/components/edit-options/edit-options';
import browser from 'webextension-polyfill';
import {
	addToBlocklist,
	disableConnector,
	disableUntilClosed,
	enableConnector,
	getChannelBlocklistLabel,
	getChannelDetails,
	getCurrentTab,
	removeFromBlocklist,
} from '@/core/background/util';
import * as ControllerMode from '@/core/object/controller/controller-mode';
import ScrobbleCache from './scrobble-cache';
import AdvancedOptionsComponent from './advanced-settings';

/**
 * Type indicating possible states for modal
 */
export type ModalType =
	| 'savedEdits'
	| 'regexEdits'
	| 'cacheEdit'
	| 'blockedTags'
	| 'blocklist'
	| '';

/**
 * Mutual base button
 */
interface NavigatorButtonBase {
	namei18n: string;
	i18nSubstitution?: string | string[];
	icon: typeof ManageAccountsOutlined;
}

/**
 * Singular navigator button
 */
export interface NavigatorNavigationButton extends NavigatorButtonBase {
	element: Component<{
		setActiveModal: Setter<ModalType>;
		modal: HTMLDialogElement | undefined;
	}>;
}

/**
 * Singular navigator button that performs an action rather than opening a page
 */
export interface NavigatorActionButton extends NavigatorButtonBase {
	action: () => void;
}

export type NavigatorButton = NavigatorNavigationButton | NavigatorActionButton;

/**
 * Group of navigator buttons
 */
export interface NavigatorButtonGroup extends NavigatorButtonBase {
	group: NavigatorButton[];
}

/**
 * A navigator consisting of a list of buttons and button groups
 */
export type Navigator = (NavigatorButton | NavigatorButtonGroup)[];

export const accountItem: NavigatorNavigationButton = {
	namei18n: 'optionsAccounts',
	icon: ManageAccountsOutlined,
	element: Accounts,
};

export const optionsItem: NavigatorNavigationButton = {
	namei18n: 'optionsOptions',
	icon: SettingsOutlined,
	element: OptionsComponent,
};

export const scrobbleCache: NavigatorNavigationButton = {
	namei18n: 'optionsScrobbleCache',
	icon: QueueMusicOutlined,
	element: ScrobbleCache,
};

export const editOptionsItem: NavigatorNavigationButton = {
	namei18n: 'optionsEdits',
	icon: EditOutlined,
	element: EditOptions,
};

export const connectorOverrideOptionsItem: NavigatorNavigationButton = {
	namei18n: 'optionsConnectors',
	icon: ExtensionOutlined,
	element: ConnectorOverrideOptions,
};

export const advancedOptionsItem: NavigatorNavigationButton = {
	namei18n: 'optionsAdvanced',
	icon: TuneOutlined,
	element: AdvancedOptionsComponent,
};

export const optionsGroup: NavigatorButtonGroup = {
	namei18n: 'optionsOptions',
	icon: SettingsOutlined,
	group: [
		optionsItem,
		scrobbleCache,
		editOptionsItem,
		connectorOverrideOptionsItem,
		advancedOptionsItem,
	],
};

export const contactItem: NavigatorNavigationButton = {
	namei18n: 'contactTitle',
	icon: ContactsOutlined,
	element: ContactComponent,
};

export const faqItem: NavigatorNavigationButton = {
	namei18n: 'faqTitle',
	icon: HelpOutlined,
	element: FAQ,
};

export const aboutItem: NavigatorNavigationButton = {
	namei18n: 'optionsAbout',
	icon: InfoOutlined,
	element: InfoComponent,
};

export const aboutGroup: NavigatorButtonGroup = {
	namei18n: 'optionsAbout',
	icon: InfoOutlined,
	group: [contactItem, faqItem, aboutItem],
};

export const showSomeLoveItem: NavigatorNavigationButton = {
	namei18n: 'showSomeLoveTitle',
	icon: FavoriteOutlined,
	element: ShowSomeLove,
};

/**
 * All the different options pages, their sidebar labels, and icons.
 */
export const settings: Navigator = [
	accountItem,
	optionsGroup,
	aboutGroup,
	// #v-ifdef !VITE_SAFARI
	showSomeLoveItem,
	// #v-endif
];

async function getToggleNavigators(): Promise<NavigatorActionButton[]> {
	const tab = await getCurrentTab();

	if (tab.mode === ControllerMode.Unsupported) {
		return [];
	}
	const navigators: NavigatorActionButton[] = [];

	if (tab.mode === ControllerMode.Disabled) {
		navigators.push({
			namei18n: 'menuEnableConnector',
			icon: ToggleOnOutlined,
			action: () => {
				enableConnector(tab.tabId);
			},
		});
	} else {
		navigators.push(
			{
				namei18n: 'menuDisableConnector',
				icon: ToggleOffOutlined,
				action: () => {
					disableConnector(tab.tabId);
				},
			},
			{
				namei18n: 'menuDisableUntilTabClosed',
				icon: TimerOutlined,
				action: () => {
					disableUntilClosed(tab.tabId);
				},
			},
		);
	}

	const channelDetails = await getChannelDetails(tab.tabId);
	if (
		!channelDetails ||
		!channelDetails.channelInfo?.id ||
		!channelDetails.connector
	) {
		return navigators;
	} else if (
		await getChannelBlocklistLabel(
			channelDetails.channelInfo.id,
			channelDetails.connector,
		)
	) {
		navigators.push({
			namei18n: 'menuEnableChannel',
			i18nSubstitution: channelDetails.channelInfo.label,
			icon: PersonOutlined,
			action: () => {
				removeFromBlocklist(tab.tabId);
			},
		});
	} else {
		navigators.push({
			namei18n: 'menuDisableChannel',
			i18nSubstitution: channelDetails.channelInfo.label,
			icon: PersonOffOutlined,
			action: () => {
				addToBlocklist(tab.tabId);
			},
		});
	}
	return navigators;
}

export async function getMobileNavigatorGroup(): Promise<NavigatorButtonGroup> {
	const group: NavigatorButtonGroup = {
		namei18n: 'optionsOptions',
		icon: SettingsOutlined,
		group: [
			{
				namei18n: 'optionsOptions',
				icon: SettingsOutlined,
				action: () => {
					browser.tabs.create({
						url: browser.runtime.getURL(
							'src/ui/options/index.html',
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
	setActiveSetting: Setter<NavigatorNavigationButton>,
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
	item: NavigatorButton | NavigatorButtonGroup,
): item is NavigatorButton {
	return !('group' in item);
}
