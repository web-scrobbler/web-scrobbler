import { t } from '@/util/i18n';
import type { Setter } from 'solid-js';
import { For, createEffect, createResource, createSignal } from 'solid-js';
import * as BrowserStorage from '@/core/storage/browser-storage';
import styles from '../components.module.scss';
import { DeleteOutlined } from '@/ui/components/icons';
import { ExportBlocklist, ImportBlocklist, ViewBlocklist } from './util';
import type { ModalType } from '../navigator';
import type { ConnectorMeta } from '@/core/connectors';
import type { Blocklists } from '@/core/storage/wrapper';

const blocklistStorage = BrowserStorage.getStorage(BrowserStorage.BLOCKLISTS);
const [blocklists, { mutate }] = createResource(
	blocklistStorage.get.bind(blocklistStorage),
);
const [connector, setConnector] = createSignal<ConnectorMeta>();

/**
 * Component that allows the user to see, import, and export connector blocklists.
 */
export default function BlockedChannels(props: {
	setActiveModal: Setter<ModalType>;
	modal: HTMLDialogElement | undefined;
	connector: ConnectorMeta;
}) {
	createEffect(() => {
		setConnector(props.connector);
	});

	return (
		<>
			<h3>{t('optionsBlockedSources')}</h3>
			<p>{t('optionsBlockedSourcesDesc')}</p>
			<div
				class={styles.buttonContainer}
				role="group"
				aria-label={t('optionsBlockedSources')}
			>
				<ViewBlocklist
					setActiveModal={props.setActiveModal}
					modal={props.modal}
					type={'blocklist'}
				/>
				<ExportBlocklist
					blocklistWrapper={blocklistStorage}
					connector={props.connector}
					filename={`${props.connector.id}-blocklist.json`}
				/>
				<ImportBlocklist
					blocklistWrapper={blocklistStorage}
					connector={props.connector}
					mutate={mutate}
				/>
			</div>
		</>
	);
}

/**
 * Component that shows all the currently registered blocked channels and allows the user to unblock them.
 * To be displayed in a modal.
 */
export function BlocklistModal() {
	return (
		<>
			<h1>
				{t(
					'optionsBlockedSourcesPopupTitle',
					Object.keys(
						blocklists()?.[connector()?.id ?? ''] ?? {},
					).length.toString(),
				)}
			</h1>
			<ul class={styles.optionList}>
				<For
					each={Object.entries(
						blocklists()?.[connector()?.id ?? ''] ?? {},
					)}
				>
					{([channelId, channelLabel]) => (
						<ChannelInfo
							channelId={channelId}
							channelLabel={channelLabel}
							connector={connector()}
							mutate={mutate}
						/>
					)}
				</For>
			</ul>
		</>
	);
}

/**
 * Component that shows a blocked channel and allows the user to delete it.
 */
function ChannelInfo(props: {
	channelId: string;
	channelLabel: string;
	connector: ConnectorMeta | undefined;
	mutate: Setter<Blocklists | null | undefined>;
}) {
	return (
		<li class={styles.deleteListing}>
			<button
				class={`${styles.button} ${styles.small} ${styles.marginRight}`}
				onClick={(event) => {
					event.stopPropagation();
					const channelId = props.channelId;
					const connector = props.connector;
					props.mutate((e) => {
						if (!e || !connector || !e[connector.id]) {
							return e;
						}
						delete e[connector.id][channelId];
						blocklistStorage.set(e);
						return {
							...e,
						};
					});
				}}
				title={t('optionsDelete', props.channelLabel)}
			>
				<DeleteOutlined />
			</button>
			<span>{props.channelLabel}</span>
		</li>
	);
}
