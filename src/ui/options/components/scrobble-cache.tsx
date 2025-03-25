import scrobbleCache from '@/core/storage/scrobble-cache';
import type { CacheScrobble } from '@/core/storage/wrapper';
import { ScrobbleStatus } from '@/core/storage/wrapper';
import { t } from '@/util/i18n';
import type { Setter } from 'solid-js';
import {
	For,
	Show,
	Suspense,
	createMemo,
	createResource,
	createSignal,
	onCleanup,
	onMount,
} from 'solid-js';
import styles from './components.module.scss';
import { ExpandMoreOutlined } from '@/ui/components/icons';
import ClonedSong from '@/core/object/cloned-song';
import browser from 'webextension-polyfill';
import { sendContentMessage } from '@/util/communication';
import type { ModalType } from './navigator';
import savedEdits from '@/core/storage/saved-edits';
import type { CloneableSong } from '@/core/object/song';
import { debugLog } from '@/core/content/util';
import SavedEditsModel from '@/core/storage/saved-edits.model';

const [scrobbles, setScrobbles] = createResource(
	scrobbleCache.getScrobbleCacheStorage.bind(scrobbleCache),
);

const [songToEdit, setSongToEdit] = createSignal<ClonedSong>();
const [scrobbleId, setScrobbleId] = createSignal<number>();
const [isSelectingScrobbles, setSelectingScrobbles] = createSignal(false);
const [selectedScrobbles, setSelectedScrobbles] = createSignal<CacheScrobble[]>(
	[],
);
const [isScrobblingMultiple, setScrobblingMultiple] = createSignal(false);

export default function ScrobbleCache(props: {
	setActiveModal: Setter<ModalType>;
	modal: HTMLDialogElement | undefined;
}) {
	return (
		<>
			<h1>{t('optionsScrobbleCache')}</h1>
			<div class={styles.scrobbleButtonsWrapper}>
				<button
					class={styles.button}
					onClick={() => {
						const buttons = document.querySelectorAll(
							`.${styles.scrobbleCheckbox}`,
						);
						if (selectedScrobbles().length) {
							buttons.forEach((checkbox) => {
								(checkbox as HTMLInputElement).checked = false;
							});
							setSelectedScrobbles([]);
						} else {
							setSelectingScrobbles(true);
							buttons.forEach((checkbox) => {
								(checkbox as HTMLInputElement).checked = true;
							});
							setSelectedScrobbles(
								(scrobbles() ?? []).filter(
									(scrobble) =>
										scrobble.status !==
										ScrobbleStatus.SUCCESSFUL,
								),
							);
						}
					}}
				>
					{selectedScrobbles().length
						? t('optionsScrobbleCacheUnselectAll')
						: t('optionsScrobbleCacheSelectAll')}
				</button>
				<button
					class={styles.button}
					onClick={() =>
						setSelectingScrobbles((prev) => {
							const isSelecting = !prev;
							if (!isSelecting) {
								document
									.querySelectorAll(
										`.${styles.scrobbleCheckbox}`,
									)
									.forEach((checkbox) => {
										(checkbox as HTMLInputElement).checked =
											false;
									});
								setSelectedScrobbles([]);
							}
							return isSelecting;
						})
					}
				>
					{t('optionsScrobbleCacheSelectScrobbles')}
				</button>
				<Show when={isSelectingScrobbles()}>
					<button
						class={styles.button}
						disabled={
							isScrobblingMultiple() ||
							selectedScrobbles().length === 0
						}
						onClick={() => {
							setScrobblingMultiple(true);
							void scrobbleMultipleFromCache(
								selectedScrobbles(),
							).then(() => {
								setScrobbles.refetch();
								setSelectedScrobbles([]);
								setSelectingScrobbles(false);
								setScrobblingMultiple(false);
							});
						}}
					>
						{t('optionsScrobbleCacheScrobbleSelected')}
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
									saveEditsWithKeyboard(
										e,
										artist(),
										track(),
										album(),
										albumArtist(),
										setLoading,
									);
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
									saveEditsWithKeyboard(
										e,
										artist(),
										track(),
										album(),
										albumArtist(),
										setLoading,
									);
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
									saveEditsWithKeyboard(
										e,
										artist(),
										track(),
										album(),
										albumArtist(),
										setLoading,
									);
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
									saveEditsWithKeyboard(
										e,
										artist(),
										track(),
										album(),
										albumArtist(),
										setLoading,
									);
								}}
							/>
						</td>
					</tr>
				</tbody>
			</table>
			<input id="should-edit-multiple" type="checkbox" checked={true} />
			<label for="should-edit-multiple">
				{t('optionsScrobbleCacheEditAll')}
			</label>
			<button
				disabled={!track() || !artist() || isLoading()}
				class={styles.button}
				onClick={(e) => {
					saveEdits(
						e,
						artist(),
						track(),
						album(),
						albumArtist(),
						setLoading,
					);
				}}
			>
				{t('buttonScrobble')}
			</button>
		</>
	);
}

function timeSince(time: number, isShort: boolean) {
	const seconds = (time - Date.now()) / 1000;
	let interval = seconds / 31_536_000;
	const formatter = new Intl.RelativeTimeFormat(
		Intl.DateTimeFormat().resolvedOptions().locale,
		{ style: isShort ? 'short' : 'long' },
	);
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
	const filteredScrobbles = createMemo(() =>
		scrobbles()
			?.slice()
			.reverse()
			.filter((e) => e.status === props.type),
	);

	return (
		<Show when={filteredScrobbles()?.length}>
			<details>
				<summary>
					<ExpandMoreOutlined class={styles.expandVector} />
					<span class={styles.summarySpan}>{t(props.title)}</span>
				</summary>
				<For each={filteredScrobbles()}>
					{(scrobble) => {
						return (
							<ScrobbleDetailsWrapper
								scrobble={scrobble}
								type={props.type}
								title={props.title}
								setActiveModal={props.setActiveModal}
								modal={props.modal}
							/>
						);
					}}
				</For>
			</details>
		</Show>
	);
}

function ScrobbleDetailsWrapper(props: {
	scrobble: CacheScrobble;
	type: ScrobbleStatus;
	title: string;
	setActiveModal: Setter<ModalType>;
	modal: HTMLDialogElement | undefined;
}) {
	return (
		<Show
			when={props.type === ScrobbleStatus.SUCCESSFUL}
			fallback={
				<label
					class={`${styles.scrobble}${
						isSelectingScrobbles()
							? ` ${styles.selectingScrobble}`
							: ''
					}`}
					onClick={(e) => {
						if (!isSelectingScrobbles()) {
							e.preventDefault();
						}
					}}
				>
					<ScrobbleDetails
						scrobble={props.scrobble}
						type={props.type}
						title={props.title}
						setActiveModal={props.setActiveModal}
						modal={props.modal}
					/>
				</label>
			}
		>
			<div class={styles.scrobble}>
				<ScrobbleDetails
					scrobble={props.scrobble}
					type={props.type}
					title={props.title}
					setActiveModal={props.setActiveModal}
					modal={props.modal}
				/>
			</div>
		</Show>
	);
}

function ScrobbleDetails(props: {
	scrobble: CacheScrobble;
	type: ScrobbleStatus;
	title: string;
	setActiveModal: Setter<ModalType>;
	modal: HTMLDialogElement | undefined;
}) {
	const song = createMemo(() => new ClonedSong(props.scrobble.song, -1));
	const dateString = createMemo(() =>
		new Date(song().metadata.startTimestamp * 1000).toLocaleString(),
	);

	const [useShortMeta, setUseShortMeta] = createSignal(
		window.innerWidth < 600,
	);
	const updateShortMeta = () => {
		setUseShortMeta(window.innerWidth < 600);
	};
	const relativeString = createMemo(() =>
		timeSince(song().metadata.startTimestamp * 1000, useShortMeta()),
	);

	onMount(() => {
		window.addEventListener('resize', updateShortMeta);
	});

	onCleanup(() => {
		window.removeEventListener('resize', updateShortMeta);
	});

	return (
		<>
			<Show when={props.scrobble.status !== ScrobbleStatus.SUCCESSFUL}>
				<input
					type="checkbox"
					class={styles.scrobbleCheckbox}
					hidden={
						props.type === ScrobbleStatus.SUCCESSFUL ||
						!isSelectingScrobbles()
					}
					onChange={(e) => {
						if (e.currentTarget.checked) {
							setSelectedScrobbles((prev) => [
								...prev,
								props.scrobble,
							]);
						} else {
							setSelectedScrobbles((prev) =>
								prev.filter((e) => e.id !== props.scrobble.id),
							);
						}
					}}
				/>
			</Show>
			<img
				class={styles.coverArt}
				src={
					song().getTrackArt() ??
					browser.runtime.getURL('img/cover_art_default.png')
				}
			/>
			<div class={styles.scrobbleDetails}>
				<div class={styles.scrobbleMetadata}>
					<span class={styles.trackName}>{song().getTrack()}</span>
					<span class={styles.artistName}>{song().getArtist()}</span>
					<span class={styles.albumName}>{song().getAlbum()}</span>
					<span class={styles.albumArtistName}>
						{song().getAlbumArtist()}
					</span>
				</div>
				<ScrobbleActions
					song={song()}
					id={props.scrobble.id}
					status={props.scrobble.status}
					setActiveModal={props.setActiveModal}
					modal={props.modal}
				/>
			</div>
			<span class={styles.scrobbleDate} title={dateString()}>
				{relativeString()}
			</span>
		</>
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
					void scrobbleCache.deleteScrobbles([props.id]).then(() => {
						setScrobbles.refetch();
					});
				}}
			>
				{t('buttonRemove')}
			</button>
		</div>
	);
}

function saveEditsWithKeyboard(
	e: KeyboardEvent & {
		currentTarget: HTMLInputElement;
		target: Element;
	},
	artist: string,
	track: string,
	album: string,
	albumArtist: string,
	setLoading: Setter<boolean>,
) {
	if (e.key === 'Enter' && !e.isComposing && artist && track) {
		saveEdits(e, artist, track, album, albumArtist, setLoading);
	}
}

function saveEdits(
	e: {
		currentTarget: HTMLInputElement | HTMLButtonElement;
		target: Element;
	},
	artist: string,
	track: string,
	album: string,
	albumArtist: string,
	setLoading: Setter<boolean>,
) {
	setLoading(true);
	const shouldEditAll = (
		document.getElementById('should-edit-multiple') as HTMLInputElement
	).checked;
	void editCacheScrobbles(
		songToEdit(),
		artist,
		track,
		album,
		albumArtist,
		shouldEditAll,
	).then(() => {
		setLoading(false);
		setScrobbles.refetch();
		e.target.closest('dialog')?.close();
	});
}

async function editCacheScrobbles(
	song: ClonedSong | undefined,
	artist: string,
	track: string,
	album: string,
	albumArtist: string,
	shouldEditAll: boolean,
) {
	if (!artist || !track || !song) {
		return;
	}
	const id = scrobbleId() ?? -1;
	if (shouldEditAll) {
		savedEdits.saveSongInfo(song, {
			artist,
			track,
			album: album || null,
			albumArtist: albumArtist || null,
		});
	}

	const songId = SavedEditsModel.getSongId(song);
	const filteredScrobbles = shouldEditAll
		? scrobbles()?.filter(
				(scrobble) =>
					scrobble.status !== ScrobbleStatus.SUCCESSFUL &&
					SavedEditsModel.getSongId(
						new ClonedSong(scrobble.song, -1),
					) === songId,
			)
		: scrobbles()?.filter((scrobble) => scrobble.id === id);
	const editedScrobbles = filteredScrobbles?.map((scrobble) => {
		scrobble.song.processed.track = track;
		scrobble.song.processed.artist = artist;
		scrobble.song.processed.album = album;
		scrobble.song.processed.albumArtist = albumArtist;
		return scrobble;
	});

	await scrobbleMultipleFromCache(editedScrobbles ?? []);
}

async function scrobbleMultipleFromCache(scrobbles: CacheScrobble[]) {
	const scrobblesLimited = scrobbles.slice(0, 50);
	await scrobbleCache.deleteScrobbles(
		scrobblesLimited.map((scrobble) => scrobble.id),
	);
	try {
		await sendContentMessage({
			type: 'scrobble',
			payload: {
				songs: scrobblesLimited.map((scrobble) => scrobble.song),
				currentlyPlaying: false,
			},
		});
	} catch (err) {
		debugLog(err, 'error');
	}
}

async function scrobbleFromCache(song: CloneableSong, id: number) {
	await scrobbleCache.deleteScrobbles([id]);
	try {
		await sendContentMessage({
			type: 'scrobble',
			payload: {
				songs: [song],
				currentlyPlaying: false,
			},
		});
	} catch (err) {
		debugLog(err, 'error');
	}
}
