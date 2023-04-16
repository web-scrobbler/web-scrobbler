import { Setter, Show, createSignal } from 'solid-js';
import browser from 'webextension-polyfill';
import styles from './components.module.scss';
import { t } from '@/util/i18n';

const desiredPermissions = {
	origins: ['http://*/', 'https://*/'],
};

export default function Permissions() {
	const [perms, setPerms] = createSignal(true);
	hasPermissions(setPerms);

	return (
		<Show when={!perms()}>
			<div class={styles.permissionsPopup}>
				<button
					type="button"
					onClick={() => {
						// This is inline and not async, as when it was not there were some issues with safari isTrusted
						browser.permissions
							.request(desiredPermissions)
							.then(setPerms);
					}}
				>
					{t('optionsPermissionsLabel')}
				</button>
			</div>
		</Show>
	);
}

async function hasPermissions(setPerms: Setter<boolean>) {
	setPerms(await browser.permissions.contains(desiredPermissions));
}
