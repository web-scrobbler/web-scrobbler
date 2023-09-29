import * as BrowserStorage from '@/core/storage/browser-storage';

const allowlist = BrowserStorage.getStorage(BrowserStorage.YOUTUBE_ALLOWLIST);

async function setupDefaultAllowlist() {
	let data = await allowlist.getLocking();
	if (!data) {
		data = {
			useAllowlist: false,
			allowlist: {},
			blocklist: {},
		};
	}
	await allowlist.setLocking(data);
}

void setupDefaultAllowlist();

export async function addToAllowlist(id: string) {
	const data = await allowlist.getLocking();
	if (!data) {
		allowlist.unlock();
		return;
	}
	if (data.useAllowlist) {
		data.allowlist = { ...data.allowlist, [id]: true };
	} else {
		data.blocklist = { ...data.blocklist, [id]: true };
	}
	allowlist.setLocking(data);
}

export async function removeFromAllowlist(id: string) {
	const data = await allowlist.getLocking();
	if (!data) {
		allowlist.unlock();
		return;
	}
	if (data.useAllowlist) {
		delete data.allowlist[id];
	} else {
		delete data.blocklist[id];
	}
	allowlist.setLocking(data);
}

export async function shouldScrobbleChannel(id: string): Promise<boolean> {
	const data = await allowlist.get();
	if (!data) {
		return true;
	}

	if (data.useAllowlist) {
		return data.allowlist[id] === true;
	}
	return data.blocklist[id] !== true;
}

export async function isUsingAllowlist(): Promise<boolean> {
	const data = await allowlist.get();
	if (!data) {
		return false;
	}

	return data.useAllowlist;
}
