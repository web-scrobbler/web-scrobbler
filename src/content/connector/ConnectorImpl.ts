import { ArtistTrack } from '@/content/connector/ArtistTrack';
import { Connector } from '@/content/connector/Connector';
import { ConnectorState } from '@/background/model/ConnectorState';
import { Selectors } from '@/content/connector/Selectors';
import { Stateful } from '@/content/connector/Stateful';
import { TimeInfo } from '@/content/connector/TimeInfo';

export class ConnectorImpl implements Connector, Stateful<ConnectorState> {
	public artistSelector: Selectors = null;
	public trackSelector: Selectors = null;
	public albumSelector: Selectors = null;

	getArtist(): string {
		throw new Error('Method not implemented.');
	}

	getAlbum(): string {
		throw new Error('Method not implemented.');
	}

	getTrack(): string {
		throw new Error('Method not implemented.');
	}

	getAlbumArtist(): string {
		throw new Error('Method not implemented.');
	}

	getArtistTrack(): ArtistTrack {
		throw new Error('Method not implemented.');
	}

	getTrackInfo(): string {
		throw new Error('Method not implemented.');
	}

	getTimeInfo(): TimeInfo {
		throw new Error('Method not implemented.');
	}

	getDuration(): number {
		throw new Error('Method not implemented.');
	}

	getCurrentTime(): number {
		throw new Error('Method not implemented.');
	}

	getRemainingTime(): number {
		throw new Error('Method not implemented.');
	}

	getTrackArt(): string {
		throw new Error('Method not implemented.');
	}

	isTrackArtDefault(): string {
		throw new Error('Method not implemented.');
	}

	getUniqueId(): string {
		throw new Error('Method not implemented.');
	}

	isPlaying(): boolean {
		return false;
	}

	isPodcast(): boolean {
		return false;
	}

	getOriginUrl(): string {
		return null;
	}

	getState(): ConnectorState {
		const state: ConnectorState = {
			artist: null,
			track: null,
			albumArtist: this.getAlbumArtist(),
			uniqueID: this.getUniqueId(),
			duration: this.getDuration(),
			currentTime: this.getCurrentTime(),
			isPlaying: this.isPlaying(),
			isPodcast: this.isPodcast(),
			originUrl: this.getOriginUrl(),
		};

		return state;
	}
}
