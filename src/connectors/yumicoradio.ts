export {};

Connector.playerSelector = 'fos-window[name="yrcplayer2"]';

Connector.artistTrackSelector = '#songTitle';

Connector.isPlaying = () => {
	const audioSrc = Util.getAttrFromSelectors('#audioplayer', 'src');

	return !(
		audioSrc === 'https://yumicoradio.net/hls/yumi_co._radio/live.m3u8' ||
		audioSrc === '' ||
		audioSrc === null
	);
};

const AD_ARTIST = 'Yumi Co. Radio';
const AD_KEYWORD = 'AD';

Connector.scrobblingDisallowedReason = () => {
	const artist = Connector.getArtistTrack()?.artist;
	const track = Connector.getArtistTrack()?.track;

	if (artist === AD_ARTIST && track?.includes(AD_KEYWORD)) {
		return 'FilteredTag';
	}
	return null;
};
