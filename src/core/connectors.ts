export interface ConnectorMeta {
	label: string;
	matches: string[];
	js: string;
	id: string;
	allFrames?: true;
}

export default <ConnectorMeta[]>[
	{
		label: 'YouTube',
		matches: ['*://www.youtube.com/*', '*://m.youtube.com/*'],
		js: 'youtube.js',
		id: 'youtube',
	},
	{
		label: 'MySpace',
		matches: ['*://myspace.com/*'],
		js: 'myspace.js',
		id: 'myspace',
	},
	{
		label: 'Bandcamp Daily',
		matches: ['*://daily.bandcamp.com/*'],
		js: 'bandcamp-embed.js',
		id: 'bandcamp-embed',
		allFrames: true,
	},
	{
		label: 'Bandcamp',
		matches: ['*://*.bandcamp.com/*', '*://bandcamp.com/*'],
		js: 'bandcamp.js',
		id: 'bandcamp',
	},
	{
		label: 'BNDCMPR',
		matches: ['*://bndcmpr.co/*'],
		js: 'bndcmpr.js',
		id: 'bndcmpr',
		allFrames: true,
	},
	{
		label: 'Pandora',
		matches: ['*://www.pandora.com/*'],
		js: 'pandora.js',
		id: 'pandora',
	},
	{
		label: 'Pakartot',
		matches: ['*://www.pakartot.lt/*'],
		js: 'pakartot.js',
		id: 'pakartot',
	},
	{
		label: 'Deezer',
		matches: ['*://www.deezer.com/*'],
		js: 'deezer.js',
		id: 'deezer',
	},
	{
		label: 'SoundCloud',
		matches: ['*://soundcloud.com/*'],
		js: 'soundcloud.js',
		id: 'soundcloud',
	},
	{
		label: 'Amazon Music',
		matches: [
			'*://music.amazon.*/*',
			'*://www.amazon.*/gp/dmusic/cloudplayer/*',
		],
		js: 'amazon.js',
		id: 'amazon',
	},
	{
		label: 'Amazon Echo',
		matches: ['*://alexa.amazon.*/spa/*'],
		js: 'amazon-alexa.js',
		id: 'amazon-alexa',
	},
	{
		label: 'VK',
		matches: ['*://vk.com/*'],
		js: 'vk.js',
		id: 'vk',
	},
	{
		label: 'Megalyrics',
		matches: ['*://megalyrics.ru/*'],
		js: 'megalyrics.js',
		id: 'megalyrics',
	},
	{
		label: 'iHeartRadio',
		matches: ['*://*.iheart.com/*'],
		js: 'iheart.js',
		id: 'iheart',
	},
	{
		label: 'Indie Shuffle',
		matches: ['*://www.indieshuffle.com/*'],
		js: 'indieshuffle.js',
		id: 'indieshuffle',
	},
	{
		label: 'Tuba.FM',
		matches: ['*://fm.tuba.pl/*'],
		js: 'tubafm.js',
		id: 'tubafm',
	},
	{
		label: 'Spotify',
		matches: ['*://open.spotify.com/*'],
		js: 'spotify.js',
		id: 'spotify',
	},
	{
		label: 'plug.dj',
		matches: ['*://plug.dj/*'],
		js: 'plug.dj.js',
		id: 'plug.dj',
	},
	{
		label: 'Dandelion Radio',
		matches: ['*://www.dandelionradio.com/player.htm'],
		js: 'dandelionradio.js',
		id: 'dandelionradio',
	},
	{
		label: 'HillyDilly',
		matches: ['*://www.hillydilly.com/*'],
		js: 'hillydilly.js',
		id: 'hillydilly',
	},
	{
		label: '8tracks',
		matches: ['*://8tracks.com/*'],
		js: '8tracks.js',
		id: '8tracks',
	},
	{
		label: 'Radio Nova',
		matches: ['*://www.nova.fr/*'],
		js: 'nova.js',
		id: 'nova',
	},
	{
		label: 'Radioplus',
		matches: ['*://www.radioplus.be/*', '*://radioplus.be/*'],
		js: 'radioplus.js',
		id: 'radioplus',
	},
	{
		label: 'Douban.FM',
		matches: ['*://douban.fm/*', '*://fm.douban.fm/*'],
		js: 'douban.fm.js',
		id: 'douban.fm',
	},
	{
		label: 'Focus@Will',
		matches: ['*://www.focusatwill.com/*'],
		js: 'focusatwill.js',
		id: 'focusatwill',
	},
	{
		label: 'Subphonic (owncloud plugin)',
		matches: ['*://*/*/apps/subphonic/minisub/*'],
		js: 'subphonic.js',
		id: 'subphonic',
	},
	{
		label: 'Digitally Imported',
		matches: ['*://www.di.fm/*'],
		js: 'radiotunes.js',
		id: 'di',
	},
	{
		label: 'BBC Sounds',
		matches: ['*://*.bbc.co.uk/*'],
		js: 'bbc-sounds.js',
		id: 'bbc-sounds',
	},
	{
		label: 'Gaana',
		matches: ['*://gaana.com/*'],
		js: 'gaana.js',
		id: 'gaana',
	},
	{
		label: 'Яндекс.Музыка',
		matches: [
			'*://music.yandex.ru/*',
			'*://music.yandex.by/*',
			'*://music.yandex.kz/*',
			'*://music.yandex.ua/*',
		],
		js: 'yandex-music.js',
		id: 'yandex-music',
	},
	{
		label: 'Plex',
		matches: [
			'*://*32400/web/*',
			'*://plex.tv/web/*',
			'*://*.plex.tv/web/*',
			'*://*.plex.tv/desktop*',
		],
		js: 'plex.js',
		id: 'plex',
	},
	{
		label: 'TuneIn',
		matches: ['*://tunein.com/*'],
		js: 'tunein.js',
		id: 'tunein',
	},
	{
		label: 'Mixcloud',
		matches: ['*://mixcloud.com/*', '*://*.mixcloud.com/*'],
		js: 'mixcloud.js',
		id: 'mixcloud',
	},
	{
		label: 'ReverbNation',
		matches: ['*://www.reverbnation.com/*'],
		js: 'reverbnation.js',
		id: 'reverbnation',
	},
	{
		label: 'NRK Radio',
		matches: ['*://radio.nrk.no/*'],
		js: 'nrk-radio.js',
		id: 'nrk-radio',
	},
	{
		label: 'Internet Archive',
		matches: ['*://archive.org/details/*'],
		js: 'archive.js',
		id: 'archive',
	},
	{
		label: 'Odnoklassniki',
		matches: ['*://odnoklassniki.ru/*', '*://ok.ru/*'],
		js: 'odnoklassniki.js',
		id: 'odnoklassniki',
	},
	{
		label: 'Online Radio Box',
		matches: ['*://onlineradiobox.com/*'],
		js: 'onlineradiobox.js',
		id: 'onlineradiobox',
	},
	{
		label: '163 Music',
		matches: ['*://music.163.com/*'],
		js: '163-music.js',
		id: '163-music',
	},
	{
		label: 'Ambient Sleeping Pill',
		matches: ['*://ambientsleepingpill.com/'],
		js: 'ambientsleepingpill.js',
		id: 'ambientsleepingpill',
	},
	{
		label: 'a.m. ambient',
		matches: ['*://amambient.com/'],
		js: 'ambientsleepingpill.js',
		id: 'amambient',
	},
	{
		label: 'Tidal',
		matches: ['*://listen.tidalhifi.com/*', '*://listen.tidal.com/*'],
		js: 'tidal.js',
		id: 'tidal',
	},
	{
		label: 'Hype Machine Featured Albums',
		matches: ['*://hypem.com/album/*'],
		js: 'hypem-albums.js',
		id: 'hypem-premieres',
	},
	{
		label: 'Hype Machine',
		matches: ['*://hypem.com/*'],
		js: 'hypem.js',
		id: 'hypem',
	},
	{
		label: 'Radionomy',
		matches: ['*://www.radionomy.com/*'],
		js: 'radionomy.js',
		id: 'radionomy',
	},
	{
		label: 'JazzAndRain',
		matches: ['*://*.jazzandrain.com/*'],
		js: 'jazzandrain.js',
		id: 'jazzandrain',
	},
	{
		label: 'RelaxingBeats',
		matches: ['*://*.relaxingbeats.com/*'],
		js: 'jazzandrain.js',
		id: 'relaxingbeats',
	},
	{
		label: 'EpicMusicTime',
		matches: ['*://*.epicmusictime.com/*'],
		js: 'jazzandrain.js',
		id: 'epicmusictime',
	},
	{
		label: 'AccuJazz',
		matches: ['*://www.accuradio.com/pop_player/accujazz/*'],
		js: 'accujazz.js',
		id: 'accujazz',
	},
	{
		label: 'AccuRadio',
		matches: ['*://www.accuradio.com/*'],
		js: 'accuradio.js',
		id: 'accuradio',
	},
	{
		label: 'Imusic.am',
		matches: ['*://imusic.am/*'],
		js: 'imusic.am.js',
		id: 'imusic.am',
	},
	{
		label: 'Earbits',
		matches: ['*://www.earbits.com/*'],
		js: 'earbits.js',
		id: 'earbits',
	},
	{
		label: 'Player.fm',
		matches: ['*://player.fm/*'],
		js: 'player.fm.js',
		id: 'player.fm',
	},
	{
		label: 'Sound Test',
		matches: ['*://sndtst.com/*'],
		js: 'sndtst.js',
		id: 'sndtst',
	},
	{
		label: 'RadioTunes',
		matches: ['*://www.radiotunes.com/*'],
		js: 'radiotunes.js',
		id: 'radiotunes',
	},
	{
		label: 'RockRadio',
		matches: ['*://www.rockradio.com/*'],
		js: 'radiotunes.js',
		id: 'rockradio',
	},
	{
		label: 'ClassicalRadio',
		matches: ['*://www.classicalradio.com/*'],
		js: 'radiotunes.js',
		id: 'classicalradio',
	},
	{
		label: 'Audacy',
		matches: ['*://www.audacy.com/*'],
		js: 'audacy.js',
		id: 'audacy',
	},
	{
		label: 'GetWorkDoneMusic',
		matches: ['*://*.getworkdonemusic.com/*'],
		js: 'getworkdonemusic.js',
		id: 'getworkdonemusic',
	},
	{
		label: 'Jamendo',
		matches: ['*://www.jamendo.com/*'],
		js: 'jamendo.js',
		id: 'jamendo',
	},
	{
		label: 'Bandzone.cz',
		matches: ['*://bandzone.cz/*'],
		js: 'bandzone.cz.js',
		id: 'bandzone.cz',
	},
	{
		label: 'Music Player for Google Drive',
		matches: ['*://www.driveplayer.com/*'],
		js: 'driveplayer.js',
		id: 'driveplayer',
	},
	{
		label: 'Kodi',
		js: 'kodi.js',
		id: 'kodi',
	},
	{
		label: 'Superplayer',
		matches: ['*://www.superplayer.fm/*'],
		js: 'superplayer.js',
		id: 'superplayer',
	},
	{
		label: 'RMFON',
		matches: ['*://www.rmfon.pl/*'],
		js: 'rmfon.js',
		id: 'rmfon',
	},
	{
		label: 'Radio 357',
		matches: ['*://radio357.pl/*'],
		js: 'radio357.js',
		id: 'radio357',
	},
	{
		label: 'JazzRadio',
		matches: ['*://www.jazzradio.com/*'],
		js: 'radiotunes.js',
		id: 'jazzradio',
	},
	{
		label: 'Zen Radio',
		matches: ['*://www.zenradio.com/*'],
		js: 'radiotunes.js',
		id: 'zenradio',
	},
	{
		label: 'SomaFM',
		matches: ['*://somafm.com/player/*'],
		js: 'somafm.js',
		id: 'somafm',
	},
	{
		label: 'Free Music Archive',
		matches: ['*://*.freemusicarchive.org/*'],
		js: 'freemusicarchive.js',
		id: 'freemusicarchive',
	},
	{
		label: 'Reddit Music Player',
		matches: ['*://reddit.musicplayer.io/'],
		js: 'redditmusicplayer.js',
		id: 'redditmusicplayer',
	},
	{
		label: 'Новое Радио',
		matches: ['*://www.novoeradio.by/*'],
		js: 'novoeradio.js',
		id: 'novoeradio',
	},
	{
		label: 'Яндекс.Радио',
		matches: [
			'*://radio.yandex.ru/*',
			'*://radio.yandex.by/*',
			'*://radio.yandex.kz/*',
			'*://radio.yandex.ua/*',
		],
		js: 'yandex-music.js',
		id: 'yandex-radio',
	},
	{
		label: 'Radio Paradise',
		matches: ['*://radioparadise.com/*'],
		js: 'radioparadise.js',
		id: 'radioparadise',
		allFrames: true,
	},
	{
		label: 'Beatport',
		matches: ['*://www.beatport.com/*'],
		js: 'beatport.js',
		id: 'beatport',
	},
	{
		label: 'wavo',
		matches: ['*://wavo.me/*'],
		js: 'wavo.js',
		id: 'wavo',
	},
	{
		label: 'FluxFM Berlin',
		matches: ['*://www.fluxfm.de/*'],
		js: 'fluxfm.js',
		id: 'fluxfm',
	},
	{
		label: 'Noise FM',
		matches: ['*://noisefm.ru/*', '*://en.noisefm.ru/*'],
		js: 'noisefm.js',
		id: 'noisefm',
		allFrames: true,
	},
	{
		label: 'WWOZ',
		matches: ['*://www.wwoz.org/listen/player/*'],
		js: 'wwoz.js',
		id: 'wwoz',
	},
	{
		label: 'Sonerezh',
		matches: ['*://sonerezh.*/*', '*://*/*sonerezh*'],
		js: 'sonerezh.js',
		id: 'sonerezh',
	},
	{
		label: 'Youradio',
		matches: ['*://www.youradio.cz/*'],
		js: 'youradio.js',
		id: 'youradio',
	},
	{
		label: 'GPMusic',
		matches: ['*://player.gpmusic.co/*'],
		js: 'gpmusic.js',
		id: 'gpmusic',
	},
	{
		label: 'Nightwave Plaza',
		matches: ['*://plaza.one/*'],
		js: 'plaza.js',
		id: 'plaza',
	},
	{
		label: 'Retrowave',
		matches: ['*://retrowave.ru/*'],
		js: 'retrowave.js',
		id: 'retrowave',
	},
	{
		label: 'Genie',
		matches: ['*://www.genie.co.kr/player/fPlayer*'],
		js: 'genie.js',
		id: 'genie',
	},
	{
		label: 'Bugs',
		matches: ['*://music.bugs.co.kr/newPlayer*'],
		js: 'bugs.js',
		id: 'bugs',
	},
	{
		label: 'openfm',
		matches: ['*://open.fm/*'],
		js: 'openfm.js',
		id: 'openfm',
	},
	{
		label: 'Playmoss',
		matches: ['*://playmoss.com/*'],
		js: 'playmoss.js',
		id: 'playmoss',
	},
	{
		label: 'Apidog',
		matches: ['*://apidog.ru/*'],
		js: 'apidog.js',
		id: 'apidog',
	},
	{
		label: 'Pinguin Radio',
		matches: ['*://pinguinradio.com/*'],
		js: 'pinguinradio.js',
		id: 'pinguinradio',
	},
	{
		label: 'JioSaavn',
		matches: ['*://www.jiosaavn.com/*'],
		js: 'jiosaavn.js',
		id: 'jiosaavn',
	},
	{
		label: 'Anghami',
		matches: ['*://*.anghami.com/*'],
		js: 'anghami.js',
		id: 'anghami',
	},
	{
		label: 'Mail.ru Music',
		matches: ['*://my.mail.ru/music', '*://my.mail.ru/music/*'],
		js: 'mail.ru.js',
		id: 'mail.ru',
	},
	{
		label: 'Emby/Jellyfin',
		matches: ['*://*8096/web/*', '*://*8920/web/*', '*://app.emby.media/*'],
		js: 'emby.js',
		id: 'emby',
	},
	{
		label: 'Freegal Music',
		matches: ['*://*.freegalmusic.com/*'],
		js: 'freegalmusic.js',
		id: 'freegalmusic',
	},
	{
		label: 'hoopla',
		matches: ['*://www.hoopladigital.com/*'],
		js: 'hoopladigital.js',
		id: 'hoopladigital',
	},
	{
		label: 'Amplify 817',
		matches: ['*://amplify817.org/*'],
		js: 'musicat.js',
		id: 'amplify817',
	},
	{
		label: 'Capital City Records',
		matches: ['*://capitalcityrecords.ca/*'],
		js: 'musicat.js',
		id: 'capitalcityrecords',
	},
	{
		label: 'Electric Lady Bird',
		matches: ['*://atxlibrary.musicat.co/*'],
		js: 'musicat.js',
		id: 'musicat-atxlibrary',
	},
	{
		label: 'FlipSide',
		matches: ['*://flipside.apl.org/*'],
		js: 'musicat.js',
		id: 'apl-flipside',
	},
	{
		label: 'HUM (Hear Utah Music)',
		matches: ['*://hum.slcpl.org/*'],
		js: 'musicat.js',
		id: 'slcpl-hum',
	},
	{
		label: 'KDL Vibes',
		matches: ['*://vibes.kdl.org/*'],
		js: 'musicat.js',
		id: 'kdl-vibes',
	},
	{
		label: 'Library Music Project',
		matches: ['*://librarymusicproject.com/*'],
		js: 'musicat.js',
		id: 'librarymusicproject',
	},
	{
		label: 'MNspin',
		matches: ['*://hclib.musicat.co/*'],
		js: 'musicat.js',
		id: 'musicat-hclib',
	},
	{
		label: 'Nashville BoomBox',
		matches: ['*://boombox.library.nashville.org/*'],
		js: 'musicat.js',
		id: 'nashville-library-boombox',
	},
	{
		label: 'QC Beats',
		matches: ['*://qcbeats.org/*'],
		js: 'musicat.js',
		id: 'qcbeats',
	},
	{
		label: 'Sawdust City Sounds',
		matches: ['*://sawdustcitysounds.org/*'],
		js: 'musicat.js',
		id: 'sawdustcitysounds',
	},
	{
		label: 'Seattle PlayBack',
		matches: ['*://playback.spl.org/*'],
		js: 'musicat.js',
		id: 'spl-playback',
	},
	{
		label: 'STACKS',
		matches: ['*://stacks.carnegielibrary.org/*'],
		js: 'musicat.js',
		id: 'carnegielibrary-stacks',
	},
	{
		label: 'Tracks Music Library',
		matches: ['*://tracksmusiclibrary.org/*'],
		js: 'musicat.js',
		id: 'tracksmusiclibrary',
	},
	{
		label: 'Monstercat',
		matches: ['*://www.monstercat.com/*'],
		js: 'monstercat.js',
		id: 'monstercat',
	},
	{
		label: 'Listen.moe',
		matches: ['*://listen.moe/*'],
		js: 'listen.moe.js',
		id: 'listen.moe',
	},
	{
		label: 'anime(bits)',
		matches: [
			'*://radio.animebits.moe/',
			'*://radio.animebits.moe/player/*',
		],
		js: 'animebits.js',
		id: 'animebits',
	},
	{
		label: 'Fair Price Music',
		matches: ['*://www.fairpricemusic.com/*'],
		js: 'fairpricemusic.js',
		id: 'fairpricemusic',
	},
	{
		label: 'Radio ULTRA',
		matches: ['*://player.radioultra.ru/*'],
		js: 'radioultra.js',
		id: 'radioultra',
	},
	{
		label: 'Наше Радио',
		matches: ['*://player.nashe.ru/*'],
		js: 'radioultra.js',
		id: 'nashe',
	},
	{
		label: 'RockFM',
		matches: ['*://player.rockfm.ru/*'],
		js: 'radioultra.js',
		id: 'rockfm',
	},
	{
		label: 'Radio JAZZ',
		matches: ['*://player.radiojazzfm.ru/*'],
		js: 'radioultra.js',
		id: 'radiojazzfm',
	},
	{
		label: 'WO Streaming',
		matches: ['*://*player.wostreaming.net/*'],
		js: 'wostreaming.js',
		id: 'wostreaming',
	},
	{
		label: 'Listen Live',
		matches: ['*://player.listenlive.co/*'],
		js: 'listenlive.js',
		id: 'listenlive',
	},
	{
		label: 'Planet Radio',
		matches: ['*://planetradio.co.uk/*/player/*'],
		js: 'planetradio.js',
		id: 'planetradio',
	},
	{
		label: 'Roxx Radio',
		matches: ['*://roxx.gr/radio/*'],
		js: 'roxx.js',
		id: 'roxx',
	},
	{
		label: 'ListenOnRepeat',
		matches: ['*://listenonrepeat.com/*'],
		js: 'listenonrepeat.js',
		id: 'listenonrepeat',
	},
	{
		label: 'Duckburg Radio',
		matches: ['*://*.radio-mb.com/*'],
		js: 'radio-mb.js',
		id: 'radio-mb',
	},
	{
		label: 'Webradio.de',
		matches: ['*://www.webradio.de/*'],
		js: 'radioplayer.js',
		id: 'webradio.de',
	},
	{
		label: 'The Breeze',
		matches: ['*://www.thebreeze.com/*/radioplayer/*'],
		js: 'radioplayer.js',
		id: 'thebreeze',
	},
	{
		label: 'RadioPlayer',
		matches: [
			'*://ukradioplayer.*/*',
			'*://radioplayer.*/*',
			// Generic patterns
			'*://*/radioplayer/*',
			'*://*/radio/player/',
			'*://*/*/radio/player/',
		],
		js: 'radioplayer.js',
		id: 'radioplayer',
	},
	{
		label: 'deltaradio',
		matches: ['*://www.deltaradio.de/*'],
		js: 'deltaradio.de.js',
		id: 'deltaradio.de',
	},
	{
		label: 'ByteFM',
		matches: ['*://www.byte.fm/*'],
		js: 'byte.fm.js',
		id: 'byte.fm',
	},
	{
		label: 'Deutschlandfunk Nova',
		matches: ['*://www.deutschlandfunknova.de/*'],
		js: 'deutschlandfunknova.js',
		id: 'deutschlandfunknova',
	},
	{
		label: 'QQ Music',
		matches: ['*://y.qq.com/portal/*'],
		js: 'qq-music.js',
		id: 'qq-music',
	},
	{
		label: 'QQ Video',
		matches: ['*://v.qq.com/x/*'],
		js: 'qq-video.js',
		id: 'qq-video',
	},
	{
		label: 'Naver',
		matches: ['*://playerui.music.naver.com/*'],
		js: 'naver.js',
		id: 'naver',
	},
	{
		label: 'Soribada',
		matches: ['*://www.soribada.com/*'],
		js: 'soribada.js',
		id: 'soribada',
	},
	{
		label: 'Flo',
		matches: ['*://www.music-flo.com/*'],
		js: 'music-flo.js',
		id: 'music-flo',
	},
	{
		label: 'Discogs',
		matches: ['*://www.discogs.com/*'],
		js: 'youtube-embed.js',
		id: 'youtube-embed',
		allFrames: true,
	},
	{
		label: 'NPR',
		matches: ['*://www.npr.org/*'],
		js: 'npr.js',
		id: 'npr',
	},
	{
		label: 'Streamsquid',
		matches: ['*://streamsquid.com/*'],
		js: 'streamsquid.js',
		id: 'streamsquid',
	},
	{
		label: 'Streemlion',
		matches: ['*://listen.streemlion.com/*'],
		js: 'streemlion.js',
		id: 'streemlion',
	},
	{
		label: 'eMusic',
		matches: ['*://www.emusic.com/*'],
		js: 'emusic.js',
		id: 'emusic',
	},
	{
		label: 'LyricsTraining',
		matches: ['*://lyricstraining.com/*'],
		js: 'lyricstraining.js',
		id: 'lyricstraining',
	},
	{
		label: 'Music Walker',
		matches: ['*://arkanath.com/MusicWalker/*'],
		js: 'musicwalker.js',
		id: 'musicwalker',
	},
	{
		label: 'radioeins',
		matches: ['*://www.radioeins.de/livestream/*'],
		js: 'radioeins.js',
		id: 'radioeins',
	},
	{
		label: 'Fritz',
		matches: ['*://www.fritz.de/livestream/*'],
		js: 'fritz.js',
		id: 'fritz',
	},
	{
		label: 'Musicoin',
		matches: ['*://musicoin.org/*'],
		js: 'musicoin.js',
		id: 'musicoin',
	},
	{
		label: '181.fm',
		matches: ['*://player.181fm.com/*'],
		js: '181.fm.js',
		id: '181.fm',
	},
	{
		label: 'Phish.in',
		matches: ['*://phish.in/*'],
		js: 'phish.in.js',
		id: 'phish.in',
	},
	{
		label: 'Rainwave',
		matches: [
			'*://rainwave.cc/*',
			'*://all.rainwave.cc/*',
			'*://game.rainwave.cc/*',
			'*://chiptune.rainwave.cc/*',
			'*://ocr.rainwave.cc/*',
			'*://covers.rainwave.cc/*',
		],
		js: 'rainwave.js',
		id: 'rainwave',
	},
	{
		label: 'Retro Synthwave',
		matches: ['*://www.retro-synthwave.com/*'],
		js: 'retro-synthwave.js',
		id: 'retro-synthwave',
	},
	{
		label: 'Радиоволна.нет',
		matches: ['*://radiovolna.net/*'],
		js: 'radiovolna.js',
		id: 'radiovolna',
	},
	{
		label: 'Feedbands',
		matches: ['*://feedbands.com/*'],
		js: 'feedbands.js',
		id: 'feedbands',
	},
	{
		label: 'Taazi',
		matches: ['*://taazi.com/*'],
		js: 'taazi.js',
		id: 'taazi',
	},
	{
		label: 'Patari',
		matches: ['*://patari.pk/*'],
		js: 'patari.js',
		id: 'patari',
	},
	{
		label: 'pCloud',
		matches: ['*://my.pcloud.com/*'],
		js: 'pcloud.js',
		id: 'pcloud',
	},
	{
		label: 'JetSetRadio Live',
		matches: ['*://jetsetradio.live/*'],
		js: 'jetsetradio.live.js',
		id: 'jetsetradio.live',
	},
	{
		label: 'Radio France',
		matches: ['*://www.radiofrance.fr/*'],
		js: 'radiofrance.js',
		id: 'radiofrance',
	},
	{
		label: 'RemixRotation',
		matches: ['*://remixrotation.com/*'],
		js: 'remixrotation.js',
		id: 'remixrotation',
	},
	{
		label: 'WFMU',
		matches: ['*://wfmu.org/*'],
		js: 'wfmu.js',
		id: 'wfmu',
	},
	{
		label: 'SiriusXM',
		matches: ['*://player.siriusxm.com/*', '*://player.siriusxm.ca/*'],
		js: 'siriusxm-player.js',
		id: 'siriusxm-player',
	},
	{
		label: '1ting',
		matches: [
			'*://www.1ting.com/player/*',
			'*://www.1ting.com/p_*',
			'*://www.1ting.com/album*',
			'*://www.1ting.com/rand.php*',
			'*://www.1ting.com/day/*',
			'*://h5.1ting.com/*',
		],
		js: '1ting.js',
		id: '1ting',
	},
	{
		label: 'Douban Artists',
		matches: ['*://music.douban.com/artists/player/*'],
		js: 'douban-artists.js',
		id: 'douban-artists',
	},
	{
		label: 'Kugou',
		matches: ['*://www.kugou.com/song/*'],
		js: 'kugou.js',
		id: 'kugou',
	},
	{
		label: 'Gimme Radio',
		matches: [
			'*://gimmeradio.com/*',
			'*://www.gimmeradio.com/*',
			'*://gimmecountry.com/*',
			'*://www.gimmecountry.com/*',
			'*://gimmemetal.com/*',
			'*://www.gimmemetal.com/*',
		],
		js: 'gimmeradio.js',
		id: 'gimmeradio',
	},
	{
		label: '9sky',
		matches: ['*://www.9sky.com/music*', '*://www.9sky.com/mv/detail*'],
		js: '9sky.js',
		id: '9sky',
	},
	{
		label: 'Vagalume.FM',
		matches: ['*://vagalume.fm/*', '*://*.vagalume.com.br/*'],
		js: 'vagalume.js',
		id: 'vagalume',
	},
	{
		label: 'Radiooooo',
		matches: ['*://radiooooo.com/*', '*://mobile.radiooooo.com/*'],
		js: 'radiooooo.js',
		id: 'radiooooo',
	},
	{
		label: 'LetsLoop',
		matches: ['*://letsloop.com/*'],
		js: 'letsloop.js',
		id: 'letsloop',
	},
	{
		label: 'Mideast Tunes',
		matches: ['*://mideastunes.com/*', '*://map.mideastunes.com/*'],
		js: 'mideastunes.js',
		id: 'mideastunes',
	},
	{
		label: 'Český Rozhlas',
		matches: ['*://prehravac.rozhlas.cz/*'],
		js: 'rozhlas.js',
		id: 'rozhlas',
	},
	{
		label: 'blocSonic',
		matches: ['*://*.blocsonic.com/*'],
		js: 'blocsonic.js',
		id: 'blocsonic',
	},
	{
		label: 'Resonate',
		matches: ['*://stream.resonate.coop/*'],
		js: 'resonate.js',
		id: 'resonate',
	},
	{
		label: 'KEXP',
		matches: ['*://*.kexp.org/*'],
		js: 'kexp.js',
		id: 'kexp',
	},
	{
		label: 'Hotmixradio.fr',
		matches: ['*://www.hotmixradio.fr/*'],
		js: 'hotmixradio.js',
		id: 'hotmixradio',
	},
	{
		label: 'Aphex Twin',
		matches: ['*://aphextwin.warp.net/*'],
		js: 'warp-aphextwin.js',
		id: 'warp-aphextwin',
	},
	{
		label: 'Resident Advisor',
		matches: ['*://www.residentadvisor.net/*'],
		js: 'residentadvisor.js',
		id: 'residentadvisor',
	},
	{
		label: 'Zachary Seguin Music',
		matches: ['*://music.zacharyseguin.ca/*'],
		js: 'musickit.js',
		id: 'zacharyseguin',
	},
	{
		label: 'Joox',
		matches: ['*://www.joox.com/*'],
		js: 'joox.js',
		id: 'joox',
	},
	{
		label: 'Musish',
		matches: ['*://musi.sh/*'],
		js: 'musickit.js',
		id: 'musish',
	},
	{
		label: '1001tracklists',
		matches: ['*://www.1001tracklists.com/tracklist/*'],
		js: '1001tracklists.js',
		id: '1001tracklists',
	},
	{
		label: 'YouTube Music',
		matches: ['*://music.youtube.com/*'],
		js: 'youtube-music.js',
		id: 'youtube-music',
	},
	{
		label: 'Radiozenders.FM',
		matches: ['*://www.radiozenders.fm/*'],
		js: 'radiozenders.js',
		id: 'radiozenders',
	},
	{
		label: 'Invidious',
		matches: ['*://*.invidio.us/*'],
		js: 'invidious.js',
		id: 'invidious',
	},
	{
		label: 'Piped',
		matches: ['*://piped.video/*'],
		js: 'piped.js',
		id: 'piped',
	},
	{
		label: 'Pretzel',
		matches: ['*://*.pretzel.rocks/*'],
		js: 'pretzel.js',
		id: 'pretzel',
	},
	{
		label: 'Radio Kyivstar',
		matches: ['*://radio.kyivstar.ua/*'],
		js: 'kyivstar.js',
		id: 'kyivstar',
	},
	{
		label: 'Funkwhale',
		js: 'funkwhale.js',
		id: 'funkwhale',
	},
	{
		label: '9128.live',
		matches: ['*://9128.live/*'],
		js: 'radioco.js',
		id: '9128.live',
		allFrames: true,
	},
	{
		label: 'Radio.co',
		matches: ['*://embed.radio.co/player/*'],
		js: 'radioco.js',
		id: 'radioco',
	},
	{
		label: 'Super45.fm',
		matches: ['*://super45.fm/'],
		js: 'radioco.js',
		id: 'super45fm',
		allFrames: true,
	},
	{
		label: 'R/a/dio',
		matches: ['*://r-a-d.io/*'],
		js: 'r-a-d.io.js',
		id: 'r-a-d.io',
	},
	{
		label: 'Apple Music',
		matches: ['*://*music.apple.com/*'],
		js: 'musickit.js',
		id: 'apple-music',
	},
	{
		label: 'Primephonic',
		matches: ['*://play.primephonic.com/*'],
		js: 'primephonic.js',
		id: 'primephonic',
	},
	{
		label: 'Watch2Gether',
		matches: ['*://w2g.tv/*'],
		js: 'watch2gether.js',
		id: 'watch2gether',
	},
	{
		label: 'Poolsuite',
		matches: ['*://poolsuite.net/*'],
		js: 'poolsuite.js',
		id: 'poolsuite',
	},
	{
		label: 'GDS.FM',
		matches: ['*://www.gds.fm/*', '*://gds.fm/*'],
		js: 'gds.fm.js',
		id: 'gds',
	},
	{
		label: 'Wynk Music',
		matches: ['*://wynk.in/music*'],
		js: 'wynk.js',
		id: 'wynk',
	},
	{
		label: 'RadioJavan',
		matches: ['*://www.radiojavan.com/*'],
		js: 'radiojavan.js',
		id: 'radiojavan',
	},
	{
		label: 'Audiomack',
		matches: ['*://audiomack.com/*'],
		js: 'audiomack.js',
		id: 'audiomack',
	},
	{
		label: 'Global Player',
		matches: ['*://www.globalplayer.com/*'],
		js: 'globalplayer.js',
		id: 'globalplayer',
	},
	{
		label: 'The Current',
		matches: ['*://www.thecurrent.org/*'],
		js: 'thecurrent.js',
		id: 'thecurrent',
	},
	{
		label: 'pan y rosas discos',
		matches: ['*://www.panyrosasdiscos.net/*'],
		js: 'panyrosasdiscos.js',
		id: 'panyrosasdiscos',
	},
	{
		label: 'GRRIF',
		matches: ['*://*.grrif.ch/*'],
		js: 'grrif.js',
		id: 'grrif',
	},
	{
		label: 'newgrounds',
		matches: ['*://www.newgrounds.com/audio*'],
		js: 'newgrounds.js',
		id: 'newgrounds',
	},
	{
		label: 'Jango',
		matches: ['*://www.jango.com/*'],
		js: 'jango.js',
		id: 'jango',
	},
	{
		label: 'PlayIrish',
		matches: ['*://*.playirish.ie/*'],
		js: 'playirish.js',
		id: 'playirish',
	},
	{
		label: 'Radio Record',
		matches: ['*://www.radiorecord.ru/*'],
		js: 'radiorecord.js',
		id: 'radiorecord',
	},
	{
		label: 'Imago Radio',
		matches: ['*://*.imago.fm/*'],
		js: 'imago.js',
		id: 'imago',
	},
	{
		label: 'Provoda.ch',
		matches: ['*://*.provoda.ch/*'],
		js: 'provoda.ch.js',
		id: 'provoda.ch',
	},
	{
		label: 'Atomic Music Space',
		matches: ['*://stream.atomicmusic.space/*'],
		js: 'atomicmusic.space.js',
		id: 'atomicmusic.space',
	},
	{
		label: 'The-radio.ru',
		matches: ['*://the-radio.ru/*'],
		js: 'the-radio.ru.js',
		id: 'the-radio.ru',
	},
	{
		label: 'HQ Radio',
		matches: ['*://hqradio.ru/*'],
		js: 'hqradio.js',
		id: 'hqradio',
	},
	{
		label: 'Smooth FM',
		matches: ['*://smoothfm.iol.pt/*'],
		js: 'smoothfm.js',
		id: 'smoothfm',
	},
	{
		label: 'Vodafone.fm',
		matches: ['*://vodafone.fm/*'],
		js: 'vodafone.fm.js',
		id: 'vodafonefm',
	},
	{
		label: 'Relisten.net',
		matches: ['*://relisten.net/*'],
		js: 'relisten.js',
		id: 'relisten',
	},
	{
		label: 'UpBeatRadio',
		matches: ['*://upbeatradio.net/*'],
		js: 'upbeatradio.js',
		id: 'upbeatradio',
	},
	{
		label: 'Chillhop',
		matches: ['*://chillhop.com/*'],
		js: 'chillhop.js',
		id: 'chillhop',
	},
	{
		label: 'DatPiff',
		matches: ['*://www.datpiff.com/player/*'],
		js: 'datpiff.js',
		id: 'datpiff',
		allFrames: true,
	},
	{
		label: 'Shuffle',
		matches: ['*://shuffle.one/play*'],
		js: 'shuffleone.js',
		id: 'shuffleone',
	},
	{
		label: 'JB FM',
		matches: ['*://jb.fm/player/*'],
		js: 'jb.fm.js',
		id: 'jbfm',
	},
	{
		label: 'SECTOR Radio',
		matches: ['*://sectorradio.ru/*'],
		js: 'sectorradio.js',
		id: 'sectorradio',
	},
	{
		label: 'LiveOne',
		matches: ['*://*.liveone.com/*'],
		js: 'liveone.js',
		id: 'liveone',
	},
	{
		label: 'PocketCasts',
		matches: ['*://play.pocketcasts.com/*'],
		js: 'pocketcasts.js',
		id: 'pocketcasts',
	},
	{
		label: 'Clyp',
		matches: ['*://clyp.it/*'],
		js: 'clyp.js',
		id: 'clyp',
	},
	{
		label: 'RTBF Radio',
		matches: ['*://www.rtbf.be/radio/*'],
		js: 'rtbf.js',
		id: 'rtbf',
	},
	{
		label: 'TuneTrack',
		matches: ['*://tunetrack.net/*'],
		js: 'tunetrack.js',
		id: 'tunetrack',
	},
	{
		label: 'Musify',
		matches: ['*://*.musify.club/*'],
		js: 'musify.js',
		id: 'musify',
	},
	{
		label: 'Radio Rethink',
		matches: ['*://www.radiorethink.com/*'],
		js: 'radiorethink.js',
		id: 'radiorethink',
	},
	{
		label: 'SoundClick',
		matches: ['*://www.soundclick.com/*'],
		js: 'soundclick.js',
		id: 'soundclick',
	},
	{
		label: 'Napster',
		matches: ['*://app.napster.com/*'],
		js: 'napster.js',
		id: 'napster',
	},
	{
		label: 'abc.net.au',
		matches: ['*://www.abc.net.au/*/listen-live/*'],
		js: 'abc.net.au.js',
		id: 'abcnetau',
	},
	{
		label: 'JQBX',
		matches: ['*://app.jqbx.fm/*'],
		js: 'jqbx.js',
		id: 'jqbx',
	},
	{
		label: 'music.jsososo.com',
		matches: ['*://y.jsososo.com/*', '*://music.jsososo.com/*'],
		js: 'jsososo.js',
		id: 'jsososo',
	},
	{
		label: 'Supla',
		matches: ['*://*.supla.fi/*'],
		js: 'supla.js',
		id: 'supla',
	},
	{
		label: 'swr3',
		matches: ['*://www.swr3.de/*'],
		js: 'swr3.js',
		id: 'swr3',
	},
	{
		label: 'Epidemic Sound',
		matches: ['*://*.epidemicsound.com/*'],
		js: 'epidemicsound.js',
		id: 'epidemicsound',
	},
	{
		label: 'Rekt Network',
		matches: ['*://rekt.network/*'],
		js: 'rekt.network.js',
		id: 'rektnetwork',
	},
	{
		label: 'Nightride FM',
		matches: ['*://nightride.fm/*'],
		js: 'nightride.fm.js',
		id: 'nightridefm',
	},
	{
		label: 'Qobuz',
		matches: ['*://*.qobuz.com/*'],
		js: 'qobuz.js',
		id: 'qobuz',
	},
	{
		label: 'TruckersFM',
		matches: ['*://*.truckers.fm/*'],
		js: 'truckersfm.js',
		id: 'truckersfm',
	},
	{
		id: 'winampify',
		label: 'Winampify',
		js: 'winampify.js',
		matches: ['*://winampify.io/*'],
	},
	{
		label: 'detektor.fm',
		matches: ['*://detektor.fm/*'],
		js: 'detektorfm.js',
		id: 'detektorfm',
	},
	{
		label: 'iBroadcast',
		matches: ['*://media.ibroadcast.com/*'],
		js: 'ibroadcast.js',
		id: 'ibroadcast',
	},
	{
		label: 'Radio7',
		matches: ['*://radio7.lv/*'],
		js: 'radio7.js',
		id: 'radio7lv',
	},
	{
		label: 'TOWER RECORDS MUSIC',
		matches: ['*://music.tower.jp/*'],
		js: 'towerrecordsmusic.js',
		id: 'towerrecordsmusic',
	},
	{
		label: 'Eggs',
		matches: ['*://eggs.mu/*'],
		js: 'eggs.js',
		id: 'eggs',
	},
	{
		label: 'Jamstash',
		matches: ['*://jamstash.com/*'],
		js: 'jamstash.js',
		id: 'jamstash',
	},
	{
		label: 'SubFire',
		matches: ['*://p.subfireplayer.net/*'],
		js: 'subfire.js',
		id: 'subfire',
	},
	{
		label: 'Idagio',
		matches: ['*://app.idagio.com/*'],
		js: 'idagio.js',
		id: 'idagio',
	},
	{
		label: 'Relax FM',
		matches: ['*://relax-fm.ru/*'],
		js: 'relaxfm.js',
		id: 'relaxfm',
	},
	{
		label: 'Laut.fm',
		matches: ['*://laut.fm/*'],
		js: 'laut.fm.js',
		id: 'laut.fm',
	},
	{
		label: 'Magnatune',
		matches: ['*://magnatune.com/*'],
		js: 'magnatune.js',
		id: 'magnatune',
	},
	{
		label: 'Libre.fm',
		matches: ['*://libre.fm/*'],
		js: 'librefm.js',
		id: 'librefm',
	},
	{
		label: 'Brain.fm',
		matches: ['*://www.brain.fm/*'],
		js: 'brainfm.js',
		id: 'brainfm',
	},
	{
		label: 'bullofheaven.com',
		matches: ['*://bullofheaven.com/*'],
		js: 'bullofheaven.com.js',
		id: 'bullofheavencom',
	},
	{
		label: 'All Classical Portland',
		matches: ['*://player.allclassical.org/*'],
		js: 'allclassical.org.js',
		id: 'allclassicalportland',
	},
	{
		label: 'Migu Music',
		matches: ['*://music.migu.cn/*'],
		js: 'migu-music.js',
		id: 'migu-music',
	},
	{
		label: 'Weibo',
		matches: ['*://weibo.com/*', '*://*.weibo.com/*'],
		js: 'weibo.js',
		id: 'weibo',
	},
	{
		label: 'Street Voice',
		matches: ['*://streetvoice.cn/*', '*://streetvoice.com/*'],
		js: 'streetvoice.js',
		id: 'streetvoice',
	},
	{
		label: 'Red Bull',
		matches: ['*://www.redbull.com/*'],
		js: 'redbull.js',
		id: 'redbull',
	},
	{
		label: 'Synology',
		matches: [
			'*://*5000/*',
			'*://*/?launchApp=SYNO.SDS.AudioStation.Application*',
		],
		js: 'synology.js',
		id: 'synology',
	},
	{
		label: 'Ragya',
		matches: ['*://www.ragya.com/*'],
		js: 'ragya.js',
		id: 'ragya',
	},
	{
		label: 'CodeRadio',
		matches: ['*://coderadio.freecodecamp.org/*'],
		js: 'coderadio.js',
		id: 'coderadio',
	},
	{
		label: 'Dash Radio',
		matches: ['*://dashradio.com/*'],
		js: 'dashradio.js',
		id: 'dashradio',
	},
	{
		label: 'Niconico',
		matches: ['*://www.nicovideo.jp/*'],
		js: 'nicovideo.js',
		id: 'nicovideo',
	},
	{
		label: 'СберЗвук',
		matches: ['*://sber-zvuk.com/*'],
		js: 'sber-zvuk.js',
		id: 'sber-zvuk',
	},
	{
		label: 'Navidrome',
		js: 'navidrome.js',
		id: 'navidrome',
	},
	{
		label: 'turntable.fm',
		matches: ['*://turntable.fm/*'],
		js: 'turntable.fm.js',
		id: 'turntable.fm',
	},
	{
		label: 'Burntable',
		matches: ['*://*.burntable.com/*'],
		js: 'burntable.js',
		id: 'burntable',
	},
	{
		label: 'Stingray Music',
		matches: ['*://*.stingray.com/*'],
		js: 'stingray.js',
		id: 'stingray',
	},
	{
		label: 'CBC Music',
		matches: ['*://www.cbc.ca/listen/cbc-music-playlists*'],
		js: 'cbcmusic.js',
		id: 'cbcmusic',
	},
	{
		label: 'Indie88',
		matches: [
			'*://indie88.com/lean-stream-player/*',
			'*://cob.leanplayer.com/CINDFM*',
		],
		js: 'indie88.js',
		id: 'indie88',
	},
	{
		label: 'Playlist Randomizer',
		matches: [
			'*://www.playlist-randomizer.com/*',
			'*://playlist-randomizer.com/*',
		],
		js: 'playlist-randomizer.js',
		id: 'playlist-randomizer',
	},
	{
		label: 'QueUp',
		matches: ['*://www.queup.net/*'],
		js: 'queup.js',
		id: 'queup',
	},
	{
		label: 'Live 365',
		matches: ['*://*.live365.com/*'],
		js: 'live365.js',
		id: 'live365',
	},
	{
		label: 'Lounge.fm',
		matches: ['*://www.lounge.fm/*'],
		js: 'lounge.fm.js',
		id: 'lounge.fm',
	},
	{
		label: 'EulerBeats',
		matches: ['*://eulerbeats.com/*'],
		js: 'eulerbeats.js',
		id: 'eulerbeats',
	},
	{
		label: 'FilmMusic.io',
		matches: ['*://*.filmmusic.io/*'],
		js: 'filmmusic.io.js',
		id: 'filmmusic.io',
	},
	{
		label: 'X-Team Radio',
		matches: ['*://radio.x-team.com/*'],
		js: 'xteam-radio.js',
		id: 'xteam-radio',
	},
	{
		label: 'Calm',
		matches: ['*://*.calm.com/*'],
		js: 'calm.js',
		id: 'calm',
	},
	{
		label: 'Keakie',
		matches: ['*://*.keakie.com/*'],
		js: 'keakie.js',
		id: 'keakie',
	},
	{
		label: 'KKBOX',
		matches: ['*://*play.kkbox.com/*'],
		js: 'kkbox.js',
		id: 'kkbox',
	},
	{
		label: 'Thrill Jockey',
		matches: ['*://thrilljockey.com/products/*'],
		js: 'thrilljockey.js',
		id: 'thrilljockey',
	},
	{
		label: 'Radio Horizonte',
		matches: ['*://horizonte.cl/*'],
		js: 'mediastream.js',
		id: 'horizontecl',
	},
	{
		label: 'Sonar FM',
		matches: ['*://sonarfm.cl/*'],
		js: 'mediastream.js',
		id: 'sonarfmcl',
	},
	{
		label: 'Play FM',
		matches: ['*://playfm.cl/*'],
		js: 'mediastream.js',
		id: 'playfmcl',
	},
	{
		label: 'WKM Radio',
		matches: ['*://www.wkmradio.com/*'],
		js: 'mediastream.js',
		id: 'wkmradio',
	},
	{
		label: 'Rockaxis',
		matches: ['*://www.rockaxis.com/*'],
		js: 'mediastream.js',
		id: 'rockaxis',
	},
	{
		label: 'Rock&Pop Chile',
		matches: ['*://www.rockandpop.cl/*'],
		js: 'rockandpopcl.js',
		id: 'rockandpopcl',
	},
	{
		label: 'WYEP',
		matches: ['*://wyep.org/*'],
		js: 'wyep.js',
		id: 'wyep',
	},
	{
		label: 'ZENO',
		matches: ['*://*zeno.fm/*'],
		js: 'zeno.js',
		id: 'zeno',
	},
	{
		label: 'Naxos Music Library',
		matches: ['*://*.naxosmusiclibrary.com/*'],
		js: 'naxosmusiclibrary.js',
		id: 'naxosmusiclibrary',
	},
	{
		label: 'Klassik Radio',
		matches: ['*://*klassikradio.de/*'],
		js: 'klassikradio.de.js',
		id: 'klassikradio',
	},
	{
		label: 'Beetle',
		js: 'beetle.js',
		id: 'beetle',
	},
	{
		label: 'RefNet',
		matches: ['*://listen.refnet.fm/*'],
		js: 'refnet.js',
		id: 'refnet',
	},
	{
		label: "La Radio du bord de l'eau",
		matches: ['*://*auborddeleau.radio/*'],
		js: 'auborddeleau.radio.js',
		id: 'auborddeleau.radio',
		allFrames: true,
	},
	{
		label: 'Radio Willy',
		matches: ['*://*willy.radio/player/willy/*'],
		js: 'willy.radio.js',
		id: 'willy.radio',
	},
	{
		label: 'NIGHT.FM',
		matches: ['*://*night.fm/*'],
		js: 'night.fm.js',
		id: 'night.fm',
	},
	{
		label: 'Radio Nowy Swiat',
		matches: ['*://nowyswiat.online/*'],
		js: 'nowyswiat.js',
		id: 'nowyswiat',
	},
	{
		label: 'Radiolla',
		matches: ['*://*radiolla.com/*'],
		js: 'radiolla.js',
		id: 'radiolla',
	},
	{
		label: 'Oxigenio.fm',
		matches: ['*://*oxigenio.fm/*'],
		js: 'oxigenio.fm.js',
		id: 'oxigenio.fm',
	},
	{
		label: 'Intergalactic FM',
		matches: ['*://*intergalactic.fm/*'],
		js: 'intergalacticfm.js',
		id: 'intergalactic.fm',
	},
	{
		label: 'Radio Cuca',
		matches: ['*://*radiocuca.es/*'],
		js: 'radiocuca.js',
		id: 'radiocuca',
	},
	{
		label: 'Irama Nusantara',
		matches: ['*://*.iramanusantara.org/*'],
		js: 'iramanusantara.js',
		id: 'iramanusantara',
	},
	{
		label: 'Yammat FM',
		matches: ['*://*yammat.fm/*'],
		js: 'yammat.fm.js',
		id: 'yammat.fm',
	},
	{
		label: 'Husk Recordings',
		matches: ['*://huskrecordings.com/music/*'],
		js: 'huskrecordings.js',
		id: 'huskrecordings',
	},
	{
		label: 'nugs.net',
		matches: ['*://play.nugs.net/*'],
		js: 'nugs.js',
		id: 'nugs',
	},
	{
		label: 'livephish.com',
		matches: ['*://plus.livephish.com/*'],
		js: 'livephish.js',
		id: 'livephish.com',
	},
	{
		label: "Ishkur's Guide to Electronic Music",
		matches: ['*://music.ishkur.com/*'],
		js: 'ishkur.js',
		id: 'music.ishkur.com',
	},
	{
		label: 'Nonoki',
		matches: ['*://nonoki.com/music/*'],
		js: 'nonoki.js',
		id: 'nonoki',
	},
	{
		label: 'Beatbump',
		matches: ['*://beatbump.ml/*'],
		js: 'beatbump.js',
		id: 'beatbump',
	},
	{
		label: 'LINE MUSIC',
		matches: ['*://music.line.me/*'],
		js: 'line-music.js',
		id: 'linemusic',
	},
	{
		label: 'KCRW',
		matches: ['*://www.kcrw.com/*'],
		js: 'kcrw.js',
		id: 'kcrw',
	},
	{
		label: 'World Fusion Radio',
		matches: ['*://worldfusionradio.com/*'],
		js: 'worldfusionradio.js',
		id: 'worldfusionradio',
	},
	{
		label: 'Hardtunes',
		matches: [
			'*://www.hard-tunes.de/*',
			'*://www.hardtunes.com/*',
			'*://www.hardtunes.fr/*',
			'*://www.hardtunes.it/*',
			'*://www.hardtunes.nl/*',
		],
		js: 'hardtunes.js',
		id: 'hardtunes',
	},
	{
		label: 'KINK',
		matches: ['*://kink.nl/player', '*://kink.nl/player/*'],
		js: 'kinknl.js',
		id: 'kinknl',
	},
	{
		label: 'The Jazz Groove',
		matches: ['*://jazzgroove.org/*'],
		js: 'jazzgroove.js',
		id: 'jazzgroove',
	},
	{
		label: 'XRAY.FM',
		matches: ['*://*.xray.fm/*'],
		js: 'xrayfm.js',
		id: 'xrayfm',
	},
	{
		label: 'DKFM Shoegaze Radio',
		matches: ['*://decayfm.com/*'],
		js: 'decayfm.js',
		id: 'decayfm',
	},
	{
		label: 'QCIndie',
		matches: ['*://www.qcindie.com/listen-live/*'],
		js: 'qcindie.js',
		id: 'qcindie',
	},
	{
		label: 'Colorado Public Radio',
		matches: ['*://www.cpr.org/*'],
		js: 'cpr.js',
		id: 'cpr',
	},
	{
		label: 'Indie 102.3',
		matches: ['*://indie.cpr.org/'],
		js: 'cpr-indie.js',
		id: 'cpr-indie',
	},
	{
		label: 'WXPN',
		matches: ['*://xpn.org/*'],
		js: 'xpn.js',
		id: 'xpn',
	},
	{
		label: 'FRISKY',
		matches: ['*://*.frisky.fm/*'],
		js: 'friskyfm.js',
		id: 'friskyfm',
	},
	{
		label: 'GotRadio',
		matches: ['*://player.gotradio.com/*'],
		js: 'gotradio.js',
		id: 'gotradio',
	},
	{
		label: 'LightningStream',
		matches: [
			'*://*.lightningstream.com/Player*',
			'*://*.lightningstream.com/player*',
		],
		js: 'lightningstream.js',
		id: 'lightningstream',
	},
	{
		label: 'Securenet Systems',
		matches: [
			'*://radio.securenetsystems.net/*',
			'*://stream*.securenetsystems.net/*',
		],
		js: 'securenetsystems.js',
		id: 'securenetsystems',
	},
	{
		label: 'WBRU',
		matches: ['*://www.wbru.com/*'],
		js: 'radioco.js',
		id: 'wbru',
		allFrames: true,
	},
	{
		label: 'uwu radio',
		matches: ['*://radio.uwu.network/*'],
		js: 'uwu-radio.js',
		id: 'uwu-radio',
	},
	{
		label: 'MyStreamPlayer',
		matches: ['*://*.mystreamplayer.com/*'],
		js: 'mystreamplayer.js',
		id: 'mystreamplayer',
	},
	{
		label: 'BagelRadio',
		matches: ['*://*.bagelradio.com/*'],
		js: 'mystreamplayer.js',
		id: 'bagelradio',
		allFrames: true,
	},
	{
		label: 'Amazing Radio',
		matches: ['*://amazingradio.com/*', '*://amazingradio.us/*'],
		js: 'amazingradio.js',
		id: 'amazingradio',
	},
	{
		label: 'DR Lyd',
		matches: ['*://www.dr.dk/lyd*'],
		js: 'dr-lyd.js',
		id: 'dr-lyd',
	},
	{
		label: 'lulu.fm',
		matches: ['*://*lulu.fm/*'],
		js: 'lulu.fm.js',
		id: 'lulufm',
	},
	{
		label: 'ROCK ANTENNE',
		matches: ['*://*rockantenne.*/webradio/*'],
		js: 'rockantenne.js',
		id: 'rockantenne',
	},
	{
		label: 'copyparty',
		matches: ['*://127.0.0.1:3923/*', '*://a.ocv.me/*'],
		js: 'copyparty.js',
		id: 'copyparty',
	},
	{
		label: 'Fungjai',
		matches: ['*://*.fungjai.com/*'],
		js: 'fungjai.js',
		id: 'fungjai',
	},
	{
		label: 'Radio Caprice',
		matches: ['*://radcap.ru/*'],
		js: 'radcap.js',
		id: 'radcap',
	},
	{
		label: 'TrackerHub',
		matches: ['*://trackerhub.vercel.app/*'],
		js: 'trackerhub.js',
		id: 'trackerhub',
	}.
];
