interface ArtistCredit {
	name: string;
	artist: {
		disambiguation: string;
		id: string;
		name: string;
		'sort-name': string;
	};
}

interface MusicBrainzRelease {
	'artist-credit': ArtistCredit[];
	asin: string;
	barcode: string;
	count: number;
	country: string;
	date: string;
	id: string;
	'label-info': {
		'catalog-number': string;
		label: {
			id: string;
			name: string;
		};
	}[];
	media: {
		'disc-count': number;
		format: string;
		'track-count': number;
	}[];
	'release-events': {
		date: string;
		area: {
			id: string;
			'iso-3166-1-codes': string[];
			name: string;
			'sort-name': string;
		};
	}[];
	'release-group': {
		id: string;
		'primary-type': string;
		'primary-type-id': string;
		title: string;
		'type-id': string;
	};
	score: number;
	status: string;
	'status-id': string;
	'text-representation': {
		language: string;
		script: string;
	};
	title: string;
	'track-count': number;
}

interface MusicBrainzReleaseSearch {
	count: number;
	created: string;
	offset: number;
	releases: MusicBrainzRelease[];
}

interface MusicBrainzReleaseGroup {
	'artist-credit': ArtistCredit[];
	count: number;
	'first-release-date': string;
	id: string;
	'primary-type': string;
	'primary-type-id': string;
	releases: {
		id: string;
		status: string;
		'status-id': string;
		title: string;
	}[];
	score: number;
	tags: {
		name: string;
		count: number;
	}[];
	title: string;
	'type-id': string;
}

interface MusicBrainzReleaseGroupSearch {
	count: number;
	created: string;
	offset: number;
	'release-groups': MusicBrainzReleaseGroup[];
}

export type MusicBrainzSearch =
	| MusicBrainzReleaseSearch
	| MusicBrainzReleaseGroupSearch;
