export interface LastFmImage {
	size: string;
	'#text': string;
}

export interface LastFmTag {
	name: string;
	url: string;
}

export interface LastFmTrackInfo extends Record<string, unknown> {
	track: {
		name: string;
		mbid: string;
		url: string;
		duration: string;
		streamable: { '#text': string; fulltrack: string };
		listeners: string;
		playcount: string;
		artist: {
			name: string;
			mbid: string;
			url: string;
		};
		album: {
			artist: string;
			title: string;
			mbid: string;
			url: string;
			'@attr': { position: string };
			image: LastFmImage[];
		};
		userplaycount: string;
		userloved: string;
		toptags: { tag: LastFmTag[] };
		wiki?: {
			published: string;
			summary: string;
			content: string;
		};
	};
}
