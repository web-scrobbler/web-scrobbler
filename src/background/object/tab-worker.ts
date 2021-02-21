import { browser } from 'webextension-polyfill-ts';

import { BrowserAction } from '@/background/browser/browser-action';
import { Controller } from '@/background/object/controller';

import {
	isActiveMode,
	isInactiveMode,
} from '@/background/object/controller-mode';
import { ConnectorEntry } from '@/common/connector-entry';
import { getCurrentTab } from '@/common/util-browser';
import { getConnectorByUrl } from '@/common/util-connector';
import {
	isConnectorEnabled,
	setConnectorEnabled,
} from '@/background/storage/options';
import { LoveStatus } from '@/background/object/song';
import { BrowserTabListener } from '@/background/BrowserTabListener';
import { ConnectorState } from '@/background/model/ConnectorState';
import { ActiveControllerProvider } from '@/background/object/ActiveControllerProvider';
import { ConnectorInjector, InjectResult } from '@/background/browser/inject';
import { GlobalMessageSender } from '@/communication/sender/GlobalMessageSender';
import { ContentScriptMessageSender } from '@/communication/sender/ContentScriptMessageSender';
import { ControllerFactory } from '@/background/object/controller/ControllerFactory';
import { ContextMenuWorkerFactory } from '@/background/ContextMenuWorkerFactory';
import { ContextMenuWorker } from '@/background/ContextMenuWorker';
import { NotificationDisplayer } from '@/background/NotificationDisplayer';

export class TabWorker implements BrowserTabListener, ActiveControllerProvider {
	private activeTabId: number = browser.tabs.TAB_ID_NONE;
	private currentTabId: number = browser.tabs.TAB_ID_NONE;

	private tabControllers: Record<number, Controller> = {};
	private browserAction: BrowserAction;

	private contextMenuWorker: ContextMenuWorker;

	constructor(
		private controllerFactory: ControllerFactory,
		private connectorInjector: ConnectorInjector,
		private notificationDisplayer: NotificationDisplayer,
		contextMenuFactory: ContextMenuWorkerFactory
	) {
		this.contextMenuWorker = contextMenuFactory(this);

		this.initialize();
	}

	/** ActiveControllerProvider implementation  */

	getActiveController(): Controller {
		return this.tabControllers[this.activeTabId] ?? null;
	}

	getController(tabId: number): Controller {
		return this.tabControllers[tabId] ?? null;
	}

	/**
	 * Enable or disable a connector attached to a given controller.
	 *
	 * @param ctrl Controller instance
	 * @param isEnabled Flag value
	 */
	setConnectorState(ctrl: Controller, isEnabled: boolean): void {
		const connector = ctrl.getConnector();

		ctrl.setEnabled(isEnabled);
		setConnectorEnabled(connector, isEnabled);
	}

	/**
	 * Called when a command is executed.
	 *
	 * @param command Command ID
	 */
	async processCommand(command: string): Promise<void> {
		const ctrl =
			this.tabControllers[this.activeTabId] ||
			this.tabControllers[this.currentTabId];
		if (!ctrl) {
			return;
		}

		switch (command) {
			case 'toggle-connector':
				this.setConnectorState(ctrl, !ctrl.isEnabled);
				break;

			case 'love-song':
			case 'unlove-song': {
				const loveStatus =
					command === 'love-song'
						? LoveStatus.Loved
						: LoveStatus.Unloved;

				await ctrl.toggleLove(loveStatus);
				this.browserAction.setSongLoved(
					loveStatus,
					ctrl.getCurrentSong()
				);
				break;
			}
		}
	}

	/**
	 * Called when something sent message to the background script via port.
	 *
	 * @param tabId ID of a tab to which the message is addressed
	 * @param state Connector state
	 */
	processConnectorState(tabId: number, state: ConnectorState): void {
		const ctrl = this.tabControllers[tabId];
		if (ctrl) {
			ctrl.onStateChanged(state);
		} else {
			// TODO add logging
		}
	}

	/**
	 * Called when a tab is updated.
	 *
	 * @param tabId Tab ID
	 * @param url Object contains changes of updated tab
	 */
	async processTabUpdate(tabId: number, url: string): Promise<void> {
		const connector = await getConnectorByUrl(url);
		await this.tryToInjectConnector(tabId, connector);
	}

	/**
	 * Called when a current tab is changed.
	 *
	 * @param tabId Tab ID
	 */
	processTabChange(tabId: number): void {
		this.currentTabId = tabId;

		if (this.shouldUpdateBrowserAction(tabId)) {
			this.updateBrowserAction(tabId);
			this.activeTabId = tabId;
		}

		this.contextMenuWorker.updateMenuForTab(tabId);
	}

	/**
	 * Called when a tab is removed.
	 *
	 * @param removedTabId Tab ID
	 */
	processTabRemove(removedTabId: number): void {
		this.unloadController(removedTabId);

		if (removedTabId === this.activeTabId) {
			this.activeTabId = browser.tabs.TAB_ID_NONE;
			this.updateLastActiveTab();
		}
	}

	private async initialize(): Promise<void> {
		const currentTab = await getCurrentTab();
		// We cannot get a current tab in some cases on startup
		if (currentTab) {
			this.currentTabId = currentTab.id;
		}

		this.browserAction = new BrowserAction();
		/*
		 * Prevent restoring the browser action icon
		 * from the previous session.
		 */
		this.browserAction.reset();
	}

	/**
	 * Update the browser action in context of a given tab ID.
	 *
	 * @param tabId Tab ID
	 */
	private updateBrowserAction(tabId: number): void {
		const ctrl = this.tabControllers[tabId];
		if (ctrl) {
			const controllerMode = ctrl.getMode();
			const currentSong = ctrl.getCurrentSong();

			this.browserAction.update(controllerMode, currentSong);
		} else {
			this.browserAction.reset();
		}
	}

	/**
	 * Check if the browser action should be updated
	 * in context of a given tab ID.
	 *
	 * @param tabId Tab ID
	 *
	 * @return Check result
	 */
	private shouldUpdateBrowserAction(tabId: number): boolean {
		const activeCtrl = this.tabControllers[this.activeTabId];
		if (activeCtrl && isActiveMode(activeCtrl.mode)) {
			return false;
		}

		const ctrl = this.tabControllers[tabId];
		if (ctrl) {
			if (tabId !== this.currentTabId && isInactiveMode(ctrl.mode)) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Get ID of a tab with recent active controller.
	 *
	 * @return Tab ID
	 */
	private findActiveTabId(): number {
		const ctrl = this.tabControllers[this.currentTabId];
		if (ctrl && isActiveMode(ctrl.mode)) {
			return this.currentTabId;
		}

		for (const tabId in this.tabControllers) {
			const ctrl = this.tabControllers[tabId];
			const mode = ctrl.getMode();
			if (isActiveMode(mode)) {
				// NOTE: Don't use `tabId` directly, it's a string.
				return ctrl.tabId;
			}
		}

		if (ctrl) {
			return this.currentTabId;
		}

		return browser.tabs.TAB_ID_NONE;
	}

	/**
	 * Update the browser action and the context menu in context of a last
	 * active tab. If no active tab is found, reset the browser action icon
	 * and the context menu.
	 */
	private updateLastActiveTab(): void {
		const lastActiveTabId = this.findActiveTabId();
		if (lastActiveTabId !== browser.tabs.TAB_ID_NONE) {
			this.activeTabId = lastActiveTabId;

			this.updateBrowserAction(this.activeTabId);
			this.contextMenuWorker.updateMenuForTab(this.activeTabId);
		} else {
			this.browserAction.reset();
			this.contextMenuWorker.resetMenu();
		}
	}

	/**
	 * Called when a controller changes its mode.
	 *
	 * @param ctrl  Controller instance
	 */
	private onModeChanged(ctrl: Controller): void {
		const tabId = ctrl.tabId;
		const isCtrlModeInactive = isInactiveMode(ctrl.getMode());
		let isActiveCtrlChanged = false;

		if (this.activeTabId !== tabId) {
			if (isCtrlModeInactive) {
				return;
			}

			this.activeTabId = tabId;
			isActiveCtrlChanged = true;
		}

		if (isActiveCtrlChanged) {
			this.contextMenuWorker.updateMenuForTab(this.currentTabId);
		}

		if (isCtrlModeInactive) {
			// Use the current tab as a context
			this.updateBrowserAction(this.currentTabId);
		} else {
			// Use a tab to which the given controller attached as a context
			this.updateBrowserAction(tabId);
		}
	}

	/**
	 * Notify other modules if a controller updated the song.
	 *
	 * @param ctrl Controller instance
	 */
	private async onSongUpdated(ctrl: Controller): Promise<void> {
		const track = ctrl.getCurrentSong().serialize();
		try {
			await new GlobalMessageSender().sendMessage({
				type: 'EVENT_TRACK_UPDATED',
				data: { track },
			});
		} catch {
			// Do nothing
		}
	}

	/**
	 * Make an attempt to inject a connector into a page.
	 *
	 * @param tabId An ID of a tab where the connector will be injected
	 * @param connector Connector match object
	 */
	private async tryToInjectConnector(
		tabId: number,
		connector: ConnectorEntry
	): Promise<void> {
		const result = await this.connectorInjector.inject(tabId, connector);

		switch (result) {
			case InjectResult.Injected: {
				return;
			}

			case InjectResult.NoMatch: {
				if (this.tabControllers[tabId]) {
					this.unloadController(tabId);
					this.updateLastActiveTab();
				}
				break;
			}

			case InjectResult.Matched: {
				this.unloadController(tabId);
				this.createController(tabId, connector);

				if (this.shouldUpdateBrowserAction(tabId)) {
					this.updateBrowserAction(tabId);
				}
				this.contextMenuWorker.updateMenuForTab(tabId);

				new ContentScriptMessageSender().sendMessage(tabId, {
					type: 'EVENT_READY',
				});
				break;
			}
		}
	}

	/**
	 * Create a controller for a tab.
	 *
	 * @param tabId An ID of a tab bound to the controller
	 * @param connector A connector match object
	 */
	private createController(tabId: number, connector: ConnectorEntry): void {
		const isEnabled = isConnectorEnabled(connector);
		const ctrl = this.controllerFactory.createController(
			tabId,
			connector,
			isEnabled
		);

		ctrl.onReset.addListener((ctrl) => {
			this.notificationDisplayer.hideNotification(ctrl);
		});

		ctrl.onSongNowPlaying.addListener((ctrl) => {
			this.notificationDisplayer.showNotification(ctrl);
		});

		ctrl.onModeChanged.addListener((ctrl) => {
			this.onModeChanged(ctrl);
		});

		ctrl.onSongUpdated.addListener((ctrl) => {
			this.onSongUpdated(ctrl);
		});

		this.tabControllers[tabId] = ctrl;
	}

	/**
	 * Stop and remove controller for a tab with a given tab ID.
	 *
	 * @param tabId Tab ID
	 */
	private unloadController(tabId: number): void {
		const controller = this.tabControllers[tabId];
		if (!controller) {
			return;
		}

		controller.finish();
		delete this.tabControllers[tabId];
	}
}
