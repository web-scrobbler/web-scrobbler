import type { TrackContextInfo } from '@/background/scrobbler/TrackContextInfo';
import type { TrackContextInfoProvider } from '@/background/provider/TrackContextInfoProvider';

export class TrackContextInfoProviderStub implements TrackContextInfoProvider {
	private trackContextInfo: TrackContextInfo[] = [];

	useTrackContextInfo(trackContextInfo: TrackContextInfo[]): void {
		this.trackContextInfo = trackContextInfo;
	}

	getTrackContextInfo(): Promise<TrackContextInfo[]> {
		return Promise.resolve(this.trackContextInfo);
	}
}
