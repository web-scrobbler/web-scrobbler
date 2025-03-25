import { t } from '@/util/i18n';
import styles from './popup.module.scss';
import type { Accessor, Resource, Setter } from 'solid-js';
import {
	Match,
	Show,
	Switch,
	createMemo,
	createResource,
	createSignal,
	onCleanup,
	onMount,
} from 'solid-js';
import type { ManagerTab } from '@/core/storage/wrapper';
import browser from 'webextension-polyfill';
import ClonedSong from '@/core/object/cloned-song';
import {
	CheckOutlined,
	EditNoteOutlined,
	PublishedWithChangesOutlined,
} from '@/ui/components/icons';
import { sendBackgroundMessage } from '@/util/communication';
import savedEdits from '@/core/storage/saved-edits';
import Regex, { RegexEditContextMenu } from './regex';
import { PopupAnchor, Squircle, isIos } from '../components/util';
import type { Navigator } from '../options/components/navigator';
import { getMobileNavigatorGroup } from '../options/components/navigator';
import ContextMenu from '../components/context-menu/context-menu';

/**
 * Component that allows the user to edit the currently playing track
 */
export default function Edit(props: { tab: Resource<ManagerTab> }) {
	const clonedSong = createMemo(() => {
		const tab = props.tab();
		if (!tab) {
			return;
		}
		const rawSong = tab.song;
		if (!rawSong) {
			return;
		}
		return new ClonedSong(rawSong, tab.tabId);
	});

	const [track, setTrack] = createSignal('');
	const [artist, setArtist] = createSignal('');
	const [album, setAlbum] = createSignal('');
	const [albumArtist, setAlbumArtist] = createSignal('');

	const [isRegex, setIsRegex] = createSignal(false);

	// manually set popup width property, safari does not play well with dynamic width
	let nowplaying: HTMLDivElement | undefined;
	function resizeWindow() {
		if (!nowplaying || nowplaying.scrollWidth < 10) {
			return;
		}
		document.body.style.width = `${nowplaying.scrollWidth}px`;
	}
	const observer = new ResizeObserver(resizeWindow);

	onMount(() => {
		setTrack(clonedSong()!.getTrack() ?? '');
		setArtist(clonedSong()!.getArtist() ?? '');
		setAlbum(clonedSong()!.getAlbum() ?? '');
		setAlbumArtist(clonedSong()!.getAlbumArtist() ?? '');

		sendBackgroundMessage(props.tab()?.tabId ?? -1, {
			type: 'setEditState',
			payload: true,
		});

		if (!nowplaying) {
			return;
		}
		if (nowplaying.scrollWidth > 10) {
			document.body.style.width = `${nowplaying.scrollWidth}px`;
		}
		observer.observe(nowplaying);

		const interval = setInterval(() => {
			sendBackgroundMessage(props.tab()?.tabId ?? -1, {
				type: 'setEditState',
				payload: true,
			});
		}, 1000);
		return () => {
			clearInterval(interval);
		};
	});

	onCleanup(() => {
		sendBackgroundMessage(props.tab()?.tabId ?? -1, {
			type: 'setEditState',
			payload: false,
		});

		observer.disconnect();
		document.body.style.width = 'auto';
	});

	return (
		<>
			<Show when={isIos()}>
				<Switch>
					<Match when={isRegex()}>
						<RegexEditContextMenu tab={props.tab} />
					</Match>
					<Match when={!isRegex()}>
						<EditContextMenu
							tab={props.tab}
							clonedSong={clonedSong()}
							setIsRegex={setIsRegex}
							track={track}
							artist={artist}
							album={album}
							albumArtist={albumArtist}
						/>
					</Match>
				</Switch>
			</Show>
			<div class={styles.nowPlayingPopup} ref={nowplaying}>
				<Switch>
					<Match when={isRegex()}>
						<Regex clonedSong={clonedSong()} tab={props.tab} />
					</Match>
					<Match when={!isRegex()}>
						<PopupAnchor
							class={styles.coverArtWrapper}
							href={
								clonedSong()?.getTrackArt() ??
								browser.runtime.getURL(
									'img/cover_art_default.png',
								)
							}
							title={t('infoOpenAlbumArt')}
						>
							<div
								class={styles.coverArtBackground}
								style={{
									'background-image': `url(${
										clonedSong()?.getTrackArt() ??
										browser.runtime.getURL(
											'img/cover_art_default.png',
										)
									})`,
								}}
							>
								<img
									class={styles.coverArt}
									src={
										clonedSong()?.getTrackArt() ??
										browser.runtime.getURL(
											'img/cover_art_default.png',
										)
									}
								/>
							</div>
							<Squircle id="coverArtClip" />
						</PopupAnchor>
						<div
							class={styles.songDetails}
							onKeyDown={(event) => {
								if (
									event.key === 'Enter' &&
									!event.isComposing
								) {
									saveEdit(props.tab, clonedSong(), {
										artist: artist(),
										track: track(),
										album: album() || null,
										albumArtist: albumArtist() || null,
									});
								}
							}}
						>
							<input
								class={styles.editField}
								type="text"
								value={clonedSong()?.getTrack() ?? ''}
								title={t('infoTrackPlaceholder')}
								placeholder={t('infoTrackPlaceholder')}
								onInput={(e) => {
									setTrack(e.currentTarget.value);
								}}
							/>
							<input
								class={styles.editField}
								type="text"
								value={clonedSong()?.getArtist() ?? ''}
								title={t('infoArtistPlaceholder')}
								placeholder={t('infoArtistPlaceholder')}
								onInput={(e) => {
									setArtist(e.currentTarget.value);
								}}
							/>
							<input
								class={styles.editField}
								type="text"
								value={clonedSong()?.getAlbum() ?? ''}
								title={t('infoAlbumPlaceholder')}
								placeholder={t('infoAlbumPlaceholder')}
								onInput={(e) => {
									setAlbum(e.currentTarget.value);
								}}
							/>
							<input
								class={styles.editField}
								type="text"
								value={clonedSong()?.getAlbumArtist() ?? ''}
								title={t('infoAlbumArtistPlaceholder')}
								placeholder={t('infoAlbumArtistPlaceholder')}
								onInput={(e) => {
									setAlbumArtist(e.currentTarget.value);
								}}
							/>
							<Show when={!isIos()}>
								<div class={styles.controlButtons}>
									<button
										class={styles.controlButton}
										disabled={!track() || !artist()}
										title={
											!track() || !artist()
												? t('infoSubmitUnableTitle')
												: t('infoSubmitTitle')
										}
										onClick={() => {
											saveEdit(props.tab, clonedSong(), {
												artist: artist(),
												track: track(),
												album: album() || null,
												albumArtist:
													albumArtist() || null,
											});
										}}
									>
										<CheckOutlined />
									</button>
									<button
										class={styles.controlButton}
										disabled={!track() || !artist()}
										title={
											!track() || !artist()
												? t('infoSwapUnableTitle')
												: t('infoSwapTitle')
										}
										onClick={() => {
											saveEdit(props.tab, clonedSong(), {
												artist: track(),
												track: artist(),
												album: album() || null,
												albumArtist:
													albumArtist() || null,
											});
										}}
										onKeyDown={(event) => {
											if (event.key !== 'Enter') {
												return;
											}
											event.stopImmediatePropagation();
											saveEdit(props.tab, clonedSong(), {
												artist: track(),
												track: artist(),
												album: album() || null,
												albumArtist:
													albumArtist() || null,
											});
										}}
									>
										<PublishedWithChangesOutlined />
									</button>
									<button
										class={styles.controlButton}
										title={t('infoRegexTitle')}
										onClick={() => setIsRegex(true)}
										onKeyDown={(event) => {
											if (event.key !== 'Enter') {
												return;
											}
											event.stopImmediatePropagation();
											setIsRegex(true);
										}}
									>
										<EditNoteOutlined />
									</button>
								</div>
							</Show>
						</div>
					</Match>
				</Switch>
			</div>
		</>
	);
}

function EditContextMenu(props: {
	tab: Resource<ManagerTab>;
	clonedSong: ClonedSong | undefined;
	setIsRegex: Setter<boolean>;
	track: Accessor<string>;
	artist: Accessor<string>;
	album: Accessor<string>;
	albumArtist: Accessor<string>;
}) {
	const [navigatorResource] = createResource(getMobileNavigatorGroup);
	const items = createMemo(() => {
		const items: Navigator = [
			{
				namei18n:
					!props.track() || !props.artist()
						? 'infoSubmitUnableTitleShort'
						: 'infoSubmitTitleShort',
				icon: CheckOutlined,
				action: () =>
					void saveEdit(props.tab, props.clonedSong, {
						artist: props.artist(),
						track: props.track(),
						album: props.album() || null,
						albumArtist: props.albumArtist() || null,
					}),
			},
			{
				namei18n:
					!props.track() || !props.artist()
						? 'infoSwapUnableTitleShort'
						: 'infoSwapTitleShort',
				icon: PublishedWithChangesOutlined,
				action: () =>
					void saveEdit(props.tab, props.clonedSong, {
						artist: props.track(),
						track: props.artist(),
						album: props.album() || null,
						albumArtist: props.albumArtist() || null,
					}),
			},
			{
				namei18n: 'infoRegexTitleShort',
				icon: EditNoteOutlined,
				action: () => props.setIsRegex(true),
			},
		];
		if (!navigatorResource.loading) {
			const navigatorGroup = navigatorResource();
			if (navigatorGroup) {
				items.push(navigatorGroup);
			}
		}
		return items;
	});

	return <ContextMenu items={items()} />;
}

/**
 * Save edit to storage
 * @param tab - tab data of the tab whose data is being edited
 * @param clonedSong - cloned song from the tab
 * @param data - the new song data to edit to
 */
async function saveEdit(
	tab: Resource<ManagerTab>,
	clonedSong: ClonedSong | undefined,
	data: {
		artist: string;
		track: string;
		album: string | null;
		albumArtist: string | null;
	},
) {
	if (!clonedSong) {
		return;
	}
	await savedEdits.saveSongInfo(clonedSong, data);
	sendBackgroundMessage(tab()?.tabId ?? -1, {
		type: 'reprocessSong',
		payload: undefined,
	});
}
