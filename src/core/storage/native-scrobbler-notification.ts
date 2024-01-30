import * as BrowserStorage from '@/core/storage/browser-storage';

export default class NativeScrobblerNotification {
	private storage = BrowserStorage.getStorage(
		BrowserStorage.NATIVE_SCROBBLER_NOTIFICATION,
	);

	/**
	 * Add connector ID to list of connectors that has been notified about.
	 *
	 * @param id - ID of connector to add
	 */
	public async saveHasNotified(id: string): Promise<void> {
		if (!id) {
			return;
		}
		let data = await this.storage.getLocking();
		if (!data) {
			data = {};
		}
		data[id] = true;
		await this.storage.setLocking(data);
	}

	/**
	 * @param id - ID of connector to check
	 *
	 * @returns true if notification has not been given for connector; false otherwise
	 */
	public async shouldNotifyAboutNativeScrobbler(
		id: string,
	): Promise<boolean> {
		const data = await this.storage.get();
		if (!data) {
			return true;
		}
		return !data[id];
	}
}
