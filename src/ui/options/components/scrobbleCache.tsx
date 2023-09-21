import scrobbleCache from '@/core/storage/scrobble-cache';
import { CacheScrobble, ScrobbleStatus } from '@/core/storage/wrapper';
import { t } from '@/util/i18n';
import {
	For,
	Show,
	Suspense,
	createMemo,
	createResource,
	createSignal,
} from 'solid-js';
import styles from './components.module.scss';
import ExpandMore from '@suid/icons-material/ExpandMoreOutlined';
import ClonedSong from '@/core/object/cloned-song';
import browser from 'webextension-polyfill';
import { sendContentMessage } from '@/util/communication';

const [scrobbles, setScrobbles] = createResource(
	scrobbleCache.getScrobbleCacheStorage.bind(scrobbleCache),
);

const [cacheDialog, setCacheDialog] = createSignal<HTMLDialogElement>();
const [songToEdit, setSongToEdit] = createSignal<ClonedSong>();

export default function ScrobbleCache() {
	let trackInput: HTMLInputElement | undefined;
	let artistInput: HTMLInputElement | undefined;
	let albumInput: HTMLInputElement | undefined;
	let albumArtistInput: HTMLInputElement | undefined;
	return (
		<>
			<h1>{t('optionsScrobbleCache')}</h1>
			<div class={styles.scrobbleCacheList}>
				<Suspense fallback={t('optionsScrobbleCacheLoading')}>
					<ScrobbleList
						title="optionsScrobbleCacheUnrecognized"
						type={ScrobbleStatus.INVALID}
					/>
					<ScrobbleList
						title="optionsScrobbleCacheDisallowed"
						type={ScrobbleStatus.DISALLOWED}
					/>
					<ScrobbleList
						title="optionsScrobbleCacheIgnored"
						type={ScrobbleStatus.IGNORED}
					/>
					<ScrobbleList
						title="optionsScrobbleCacheError"
						type={ScrobbleStatus.ERROR}
					/>
					<ScrobbleList
						title="optionsScrobbleCacheSuccess"
						type={ScrobbleStatus.SUCCESSFUL}
					/>
				</Suspense>
			</div>
			<dialog class={styles.scrobbleCacheDialog} ref={setCacheDialog}>
				<label>
					{t('infoTrackPlaceholder')}
					<input
						type="text"
						ref={trackInput}
						value={songToEdit()?.getTrack() ?? ''}
					/>
				</label>
				<label>
					{t('infoArtistPlaceholder')}
					<input
						type="text"
						ref={artistInput}
						value={songToEdit()?.getArtist() ?? ''}
					/>
				</label>
				<label>
					{t('infoAlbumPlaceholder')}
					<input
						type="text"
						ref={albumInput}
						value={songToEdit()?.getAlbum() ?? ''}
					/>
				</label>
				<label>
					{t('infoAlbumArtistPlaceholder')}
					<input
						type="text"
						ref={albumArtistInput}
						value={songToEdit()?.getAlbumArtist() ?? ''}
					/>
				</label>
			</dialog>
		</>
	);
}

function timeSince(time: number) {
	const seconds = (time - Date.now()) / 1000;
	let interval = seconds / 31536000;
	const formatter = new Intl.RelativeTimeFormat();
	if (Math.abs(interval) > 1) {
		return formatter.format(Math.floor(interval), 'year');
	}
	interval = seconds / 86400;
	if (Math.abs(interval) > 1) {
		return formatter.format(Math.floor(interval), 'month');
	}
	interval = seconds / 3600;
	if (Math.abs(interval) > 1) {
		return formatter.format(Math.floor(interval), 'hour');
	}
	interval = seconds / 60;
	if (Math.abs(interval) > 1) {
		return formatter.format(Math.floor(interval), 'minute');
	}
	return formatter.format(Math.floor(seconds), 'second');
}

function ScrobbleList(props: { title: string; type: ScrobbleStatus }) {
	const filteredScrobbles = createMemo(
		() =>
			scrobbles()
				?.slice()
				.reverse()
				.filter((e) => e.status === props.type),
	);

	return (
		<Show when={filteredScrobbles()?.length}>
			<details>
				<summary>
					<ExpandMore class={styles.expandVector} />
					<span class={styles.summarySpan}>{t(props.title)}</span>
				</summary>
				<For each={filteredScrobbles()}>
					{(scrobble) => {
						const song = new ClonedSong(scrobble.song, -1);
						const dateString = new Date(
							song.metadata.startTimestamp * 1000,
						).toLocaleString();
						const relativeString = timeSince(
							song.metadata.startTimestamp * 1000,
						);
						return (
							<div class={styles.scrobble}>
								<img
									class={styles.coverArt}
									src={
										song.getTrackArt() ??
										browser.runtime.getURL(
											'img/cover_art_default.png',
										)
									}
								/>
								<div class={styles.scrobbleDetails}>
									<div class={styles.scrobbleMetadata}>
										<span class={styles.trackName}>
											{song.getTrack()}
										</span>
										<span class={styles.artistName}>
											{song.getArtist()}
										</span>
										<span class={styles.albumName}>
											{song.getAlbum()}
										</span>
										<span class={styles.albumArtistName}>
											{song.getAlbumArtist()}
										</span>
									</div>
									<ScrobbleActions
										song={song}
										id={scrobble.id}
										status={scrobble.status}
									/>
								</div>
								<span title={dateString}>{relativeString}</span>
							</div>
						);
					}}
				</For>
			</details>
		</Show>
	);
}

function ScrobbleActions(props: {
	song: ClonedSong;
	id: number;
	status: ScrobbleStatus;
}) {
	return (
		<div class={styles.scrobbleActions}>
			<Show when={props.status !== ScrobbleStatus.SUCCESSFUL}>
				<button
					class={styles.scrobbleActionButton}
					onClick={() => {
						setSongToEdit(props.song);
						cacheDialog()?.showModal();
					}}
				>
					{t('infoEditTitleShort')}
				</button>
				<button
					class={styles.scrobbleActionButton}
					onClick={(e) => {
						e.currentTarget.disabled = true;
						void scrobbleFromCache(props.song, props.id).then(
							() => {
								e.currentTarget.disabled = false;
							},
						);
					}}
				>
					{t('buttonScrobble')}
				</button>
			</Show>
			<button class={styles.scrobbleActionButton}>Remove</button>
		</div>
	);
}

async function scrobbleFromCache(song: ClonedSong, id: number) {
	scrobbleCache.deleteScrobble(id);
	await sendContentMessage({
		type: 'scrobble',
		payload: {
			song,
		},
	});
	setScrobbles.refetch();
}
