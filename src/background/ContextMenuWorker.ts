import { Controller } from '@/background/object/controller';

import { L } from '@/common/i18n';

import type { ContextMenuMananger } from '@/background/browser/context-menu/ContextMenuManager';
import type { TabWorker } from '@/background/object/tab-worker';

export class ContextMenuWorker {
	constructor(
		private tabWorker: TabWorker,
		private menuManager: ContextMenuMananger
	) {}

	/**
	 * Setup context menu for a tab with given tab ID.
	 *
	 * @param tabId Tab ID
	 */
	updateMenuForTab(tabId: number): void {
		this.menuManager.resetContextMenu();

		const currentCtrl = this.tabWorker.getController(tabId);
		const activeCtrl = this.tabWorker.getActiveController();

		if (currentCtrl) {
			this.addToggleConnectorMenu(tabId, currentCtrl);
			if (currentCtrl.isEnabled) {
				this.addDisableUntilTabClosedItem(tabId, currentCtrl);
			}
		}

		if (!(activeCtrl && currentCtrl)) {
			return;
		}

		// Add additional menu items for active tab (if it's not current)...
		if (activeCtrl !== currentCtrl) {
			if (
				activeCtrl.getConnector().id === currentCtrl.getConnector().id
			) {
				return;
			}

			// ...but only if it has a different connector injected.
			this.addToggleConnectorMenu(tabId, activeCtrl);
		}
	}

	resetMenu(): void {
		this.menuManager.resetContextMenu();
	}

	/**
	 * Add a "Enable/Disable X" menu item for a given controller.
	 *
	 * @param tabId Tab ID
	 * @param ctrl Controller instance
	 */
	private addToggleConnectorMenu(tabId: number, ctrl: Controller): void {
		const { label } = ctrl.getConnector();
		const titleId = ctrl.isEnabled
			? 'menuDisableConnector'
			: 'menuEnableConnector';
		const itemTitle = L(titleId, label);
		const newState = !ctrl.isEnabled;

		this.menuManager.addContextMenuItem(tabId, itemTitle, () => {
			this.tabWorker.setConnectorState(ctrl, newState);
		});
	}

	/**
	 * Add a "Disable X until tab is closed" menu item for a given controller.
	 *
	 * @param tabId Tab ID
	 * @param ctrl Controller instance
	 */
	private addDisableUntilTabClosedItem(
		tabId: number,
		ctrl: Controller
	): void {
		const { label } = ctrl.getConnector();
		const itemTitle2 = L`menuDisableUntilTabClosed ${label}`;
		this.menuManager.addContextMenuItem(tabId, itemTitle2, () => {
			ctrl.setEnabled(false);
		});
	}
}
