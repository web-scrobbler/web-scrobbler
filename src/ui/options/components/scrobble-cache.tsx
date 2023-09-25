import scrobbleCache from '@/core/storage/scrobble-cache';
import { ScrobbleStatus } from '@/core/storage/wrapper';
import { t } from '@/util/i18n';
import {
	For,
	Setter,
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
import { ModalType } from './navigator';
import savedEdits from '@/core/storage/saved-edits';

const [scrobbles, setScrobbles] = createResource(
	scrobbleCache.getScrobbleCacheStorage.bind(scrobbleCache),
);

const [songToEdit, setSongToEdit] = createSignal<ClonedSong>();
const [scrobbleId, setScrobbleId] = createSignal<number>();
const [isSelectingScrobbles, setSelectingScrobbles] = createSignal(false);

export default function ScrobbleCache(props: {
	setActiveModal: Setter<ModalType>;
	modal: HTMLDialogElement | undefined;
}) {
	return (
		<>
			<h1>{t('optionsScrobbleCache')}</h1>
			<div class={styles.scrobbleButtonsWrapper}>
				<button
					class={styles.resetButton}
					onClick={() => setSelectingScrobbles((prev) => !prev)}
				>
					Select Scrobbles
				</button>
				<Show when={isSelectingScrobbles()}>
					<button class={styles.resetButton}>
						Scrobble Selected
					</button>
				</Show>
			</div>
			<div class={styles.scrobbleCacheList}>
				<Suspense fallback={t('optionsScrobbleCacheLoading')}>
					<ScrobbleList
						title="optionsScrobbleCacheUnrecognized"
						type={ScrobbleStatus.INVALID}
						setActiveModal={props.setActiveModal}
						modal={props.modal}
					/>
					<ScrobbleList
						title="optionsScrobbleCacheDisallowed"
						type={ScrobbleStatus.DISALLOWED}
						setActiveModal={props.setActiveModal}
						modal={props.modal}
					/>
					<ScrobbleList
						title="optionsScrobbleCacheIgnored"
						type={ScrobbleStatus.IGNORED}
						setActiveModal={props.setActiveModal}
						modal={props.modal}
					/>
					<ScrobbleList
						title="optionsScrobbleCacheError"
						type={ScrobbleStatus.ERROR}
						setActiveModal={props.setActiveModal}
						modal={props.modal}
					/>
					<ScrobbleList
						title="optionsScrobbleCacheSuccess"
						type={ScrobbleStatus.SUCCESSFUL}
						setActiveModal={props.setActiveModal}
						modal={props.modal}
					/>
				</Suspense>
			</div>
		</>
	);
}

export function CacheEditModal() {
	const [track, setTrack] = createSignal(songToEdit()?.getTrack() ?? '');
	const [artist, setArtist] = createSignal(songToEdit()?.getArtist() ?? '');
	const [album, setAlbum] = createSignal(songToEdit()?.getAlbum() ?? '');
	const [albumArtist, setAlbumArtist] = createSignal(
		songToEdit()?.getAlbumArtist() ?? '',
	);
	const [isLoading, setLoading] = createSignal(false);

	return (
		<>
			<h1>{t('infoEditTitle')}</h1>
			<table class={styles.editTable}>
				<tbody>
					<tr>
						<td>
							<label for="scrobble-cache-edit-track">
								{t('infoTrackPlaceholder')}
							</label>
						</td>
						<td>
							<input
								type="text"
								value={track()}
								onInput={(e) => setTrack(e.currentTarget.value)}
								id="scrobble-cache-edit-track"
								onKeyDown={(e) => {
									if (
										e.key === 'Enter' &&
										!e.isComposing &&
										artist() &&
										track()
									) {
										setLoading(true);
										void editCacheScrobble(
											songToEdit(),
											artist(),
											track(),
											album(),
											albumArtist(),
										).then(() => {
											setLoading(false);
											setScrobbles.refetch();
											e.target.closest('dialog')?.close();
										});
									}
								}}
							/>
						</td>
					</tr>
					<tr>
						<td>
							<label for="scrobble-cache-edit-artist">
								{t('infoArtistPlaceholder')}
							</label>
						</td>
						<td>
							<input
								type="text"
								value={artist()}
								onInput={(e) =>
									setArtist(e.currentTarget.value)
								}
								id="scrobble-cache-edit-artist"
								onKeyDown={(e) => {
									if (
										e.key === 'Enter' &&
										!e.isComposing &&
										artist() &&
										track()
									) {
										setLoading(true);
										void editCacheScrobble(
											songToEdit(),
											artist(),
											track(),
											album(),
											albumArtist(),
										).then(() => {
											setLoading(false);
											setScrobbles.refetch();
											e.target.closest('dialog')?.close();
										});
									}
								}}
							/>
						</td>
					</tr>
					<tr>
						<td>
							<label for="scrobble-cache-edit-album">
								{t('infoAlbumPlaceholder')}
							</label>
						</td>
						<td>
							<input
								type="text"
								value={album()}
								onInput={(e) => setAlbum(e.currentTarget.value)}
								id="scrobble-cache-edit-album"
								onKeyDown={(e) => {
									if (
										e.key === 'Enter' &&
										!e.isComposing &&
										artist() &&
										track()
									) {
										setLoading(true);
										void editCacheScrobble(
											songToEdit(),
											artist(),
											track(),
											album(),
											albumArtist(),
										).then(() => {
											setLoading(false);
											setScrobbles.refetch();
											e.target.closest('dialog')?.close();
										});
									}
								}}
							/>
						</td>
					</tr>
					<tr>
						<td>
							<label for="scrobble-cache-edit-album-artist">
								{t('infoAlbumArtistPlaceholder')}
							</label>
						</td>
						<td>
							<input
								type="text"
								value={albumArtist()}
								onInput={(e) =>
									setAlbumArtist(e.currentTarget.value)
								}
								id="scrobble-cache-edit-album-artist"
								onKeyDown={(e) => {
									if (
										e.key === 'Enter' &&
										!e.isComposing &&
										artist() &&
										track()
									) {
										setLoading(true);
										void editCacheScrobble(
											songToEdit(),
											artist(),
											track(),
											album(),
											albumArtist(),
										).then(() => {
											setLoading(false);
											setScrobbles.refetch();
											e.target.closest('dialog')?.close();
										});
									}
								}}
							/>
						</td>
					</tr>
				</tbody>
			</table>
			<button
				disabled={!track() || !artist() || isLoading()}
				class={styles.resetButton}
				onClick={(e) => {
					if (artist() && track()) {
						setLoading(true);
						void editCacheScrobble(
							songToEdit(),
							artist(),
							track(),
							album(),
							albumArtist(),
						).then(() => {
							setLoading(false);
							setScrobbles.refetch();
							e.target.closest('dialog')?.close();
						});
					}
				}}
			>
				{t('buttonScrobble')}
			</button>
		</>
	);
}

function timeSince(time: number) {
	const seconds = (time - Date.now()) / 1000;
	let interval = seconds / 31_536_000;
	const formatter = new Intl.RelativeTimeFormat();
	if (Math.abs(interval) > 1) {
		return formatter.format(Math.floor(interval), 'year');
	}
	interval = seconds / 2_629_744;
	if (Math.abs(interval) > 1) {
		return formatter.format(Math.floor(interval), 'month');
	}
	interval = seconds / 604_800;
	if (Math.abs(interval) > 1) {
		return formatter.format(Math.floor(interval), 'week');
	}
	interval = seconds / 86400;
	if (Math.abs(interval) > 1) {
		return formatter.format(Math.floor(interval), 'day');
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

function ScrobbleList(props: {
	title: string;
	type: ScrobbleStatus;
	setActiveModal: Setter<ModalType>;
	modal: HTMLDialogElement | undefined;
}) {
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
							<label
								class={styles.scrobble}
								onClick={(e) => {
									if (!isSelectingScrobbles()) {
										e.preventDefault();
									}
								}}
							>
								<input
									type="checkbox"
									class={styles.scrobbleCheckbox}
									hidden={
										props.type ===
											ScrobbleStatus.SUCCESSFUL ||
										!isSelectingScrobbles()
									}
								/>
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
										setActiveModal={props.setActiveModal}
										modal={props.modal}
									/>
								</div>
								<span title={dateString}>{relativeString}</span>
							</label>
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
	setActiveModal: Setter<ModalType>;
	modal: HTMLDialogElement | undefined;
}) {
	return (
		<div class={styles.scrobbleActions}>
			<Show when={props.status !== ScrobbleStatus.SUCCESSFUL}>
				<button
					class={styles.scrobbleActionButton}
					onClick={(e) => {
						e.stopImmediatePropagation();
						setSongToEdit(props.song);
						setScrobbleId(props.id);
						props.setActiveModal('cacheEdit');
						props.modal?.showModal();
					}}
				>
					{t('infoEditTitleShort')}
				</button>
			</Show>
			<button
				class={styles.scrobbleActionButton}
				onClick={() => {
					void scrobbleCache.deleteScrobble(props.id).then(() => {
						setScrobbles.refetch();
					});
				}}
			>
				{t('buttonRemove')}
			</button>
		</div>
	);
}

async function editCacheScrobble(
	song: ClonedSong | undefined,
	artist: string,
	track: string,
	album: string,
	albumArtist: string,
) {
	if (!artist || !track || !song) {
		return;
	}
	const id = scrobbleId() ?? -1;
	savedEdits.saveSongInfo(song, {
		artist,
		track,
		album: album || null,
		albumArtist: albumArtist || null,
	});
	song.processed.track = track;
	song.processed.artist = artist;
	song.processed.album = album;
	song.processed.albumArtist = albumArtist;

	await scrobbleFromCache([song], id);
}

async function scrobbleFromCache(songs: ClonedSong[], id: number) {
	await scrobbleCache.deleteScrobble(id);
	await sendContentMessage({
		type: 'scrobble',
		payload: {
			songs,
			currentlyPlaying: false,
		},
	});
}
