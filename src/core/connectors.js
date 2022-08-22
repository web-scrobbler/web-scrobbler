'use strict';

/**
 * All match entries are defined here, instead of manifest.
 *
 * Matching connector is injected to the page after document_end event.
 *
 * Supported fields:
 *   @param {String} label Website label
 *   @param {Array} matches Array of match patterns.
 *   Connectors are processed in order and the first match is used;
 *   you can use this behavior to emulate exclude matches,
 *   @param {String} js Path to connector file.
 *   @param {String} id Entry ID. This value must be unique.
 *   Do not change this property w/o any serious reason.
 *   @param {Boolean} allFrames Value representing InjectDetails.allFrames.
 *   False by default.
 */

const connectors = [{
	label: 'YouTube',
	matches: [
		'*://www.youtube.com/*',
	],
	js: 'connectors/youtube.js',
	id: 'youtube',
}, {
	label: 'MySpace',
	matches: [
		'*://myspace.com/*',
	],
	js: 'connectors/myspace.js',
	id: 'myspace',
}, {
	label: 'Bandcamp Daily',
	matches: [
		'*://daily.bandcamp.com/*',
	],
	js: 'connectors/bandcamp-embed.js',
	id: 'bandcamp-embed',
	allFrames: true,
}, {
	label: 'Bandcamp',
	matches: [
		'*://*.bandcamp.com/*',
		'*://bandcamp.com/*',
	],
	js: 'connectors/bandcamp.js',
	id: 'bandcamp',
}, {
	label: 'BNDCMPR',
	matches: [
		'*://bndcmpr.co/*',
	],
	js: 'connectors/bndcmpr.js',
	id: 'bndcmpr',
	allFrames: true,
}, {
	label: 'Pandora',
	matches: [
		'*://www.pandora.com/*',
	],
	js: 'connectors/pandora.js',
	id: 'pandora',
}, {
	label: 'Pakartot',
	matches: [
		'*://www.pakartot.lt/*',
	],
	js: 'connectors/pakartot.js',
	id: 'pakartot',
}, {
	label: 'Deezer',
	matches: [
		'*://www.deezer.com/*',
	],
	js: 'connectors/deezer.js',
	id: 'deezer',
}, {
	label: 'SoundCloud',
	matches: [
		'*://soundcloud.com/*',
	],
	js: 'connectors/soundcloud.js',
	id: 'soundcloud',
}, {
	label: 'Amazon',
	matches: [
		'*://music.amazon.*/*',
		'*://www.amazon.*/gp/dmusic/cloudplayer/*',
	],
	js: 'connectors/amazon.js',
	id: 'amazon',
}, {
	label: 'Amazon Echo',
	matches: [
		'*://alexa.amazon.*/spa/*',
	],
	js: 'connectors/amazon-alexa.js',
	id: 'amazon-alexa',
}, {
	label: 'VK',
	matches: [
		'*://vk.com/*',
	],
	js: 'connectors/vk.js',
	id: 'vk',
}, {
	label: 'Megalyrics',
	matches: [
		'*://megalyrics.ru/*',
	],
	js: 'connectors/megalyrics.js',
	id: 'megalyrics',
}, {
	label: 'iHeartRadio',
	matches: [
		'*://*.iheart.com/*',
	],
	js: 'connectors/iheart.js',
	id: 'iheart',
}, {
	label: 'Indie Shuffle',
	matches: [
		'*://www.indieshuffle.com/*',
	],
	js: 'connectors/indieshuffle.js',
	id: 'indieshuffle',
}, {
	label: 'Tuba.FM',
	matches: [
		'*://fm.tuba.pl/*',
	],
	js: 'connectors/tubafm.js',
	id: 'tubafm',
}, {
	label: 'Spotify',
	matches: [
		'*://open.spotify.com/*',
	],
	js: 'connectors/spotify.js',
	id: 'spotify',
}, {
	label: 'plug.dj',
	matches: [
		'*://plug.dj/*',
	],
	js: 'connectors/plug.dj.js',
	id: 'plug.dj',
}, {
	label: 'Dandelion Radio',
	matches: [
		'*://www.dandelionradio.com/player.htm',
	],
	js: 'connectors/dandelionradio.js',
	id: 'dandelionradio',
}, {
	label: 'HillyDilly',
	matches: [
		'*://www.hillydilly.com/*',
	],
	js: 'connectors/hillydilly.js',
	id: 'hillydilly',
}, {
	label: '8tracks',
	matches: [
		'*://8tracks.com/*',
	],
	js: 'connectors/8tracks.js',
	id: '8tracks',
}, {
	label: 'Radio Nova',
	matches: [
		'*://www.nova.fr/*',
	],
	js: 'connectors/nova.js',
	id: 'nova',
}, {
	label: 'Radioplus',
	matches: [
		'*://www.radioplus.be/*',
		'*://radioplus.be/*',
	],
	js: 'connectors/radioplus.js',
	id: 'radioplus',
}, {
	label: 'Douban.FM',
	matches: [
		'*://douban.fm/*',
	],
	js: 'connectors/douban.fm.js',
	id: 'douban.fm',
}, {
	label: 'Focus@Will',
	matches: [
		'*://www.focusatwill.com/*',
	],
	js: 'connectors/focusatwill.js',
	id: 'focusatwill',
}, {
	label: 'Subphonic (owncloud plugin)',
	matches: [
		'*://*/*/apps/subphonic/minisub/*',
	],
	js: 'connectors/subphonic.js',
	id: 'subphonic',
}, {
	label: 'Digitally Imported',
	matches: [
		'*://www.di.fm/*',
	],
	js: 'connectors/radiotunes.js',
	id: 'di',
}, {
	label: 'BBC Sounds',
	matches: [
		'*://*.bbc.co.uk/*',
	],
	js: 'connectors/bbc-sounds.js',
	id: 'bbc-sounds',
}, {
	label: 'Gaana',
	matches: [
		'*://gaana.com/*',
	],
	js: 'connectors/gaana.js',
	id: 'gaana',
}, {
	label: 'Яндекс.Музыка',
	matches: [
		'*://music.yandex.ru/*',
		'*://music.yandex.by/*',
		'*://music.yandex.kz/*',
		'*://music.yandex.ua/*',
	],
	js: 'connectors/yandex-music.js',
	id: 'yandex-music',
}, {
	label: 'Plex',
	matches: [
		'*://*32400/web/*',
		'*://plex.tv/web/*',
		'*://*.plex.tv/web/*',
		'*://*.plex.tv/desktop*',
	],
	js: 'connectors/plex.js',
	id: 'plex',
}, {
	label: 'TuneIn',
	matches: [
		'*://tunein.com/*',
	],
	js: 'connectors/tunein.js',
	id: 'tunein',
}, {
	label: 'MixCloud',
	matches: [
		'*://mixcloud.com/*',
		'*://*.mixcloud.com/*',
	],
	js: 'connectors/mixcloud.js',
	id: 'mixcloud',
}, {
	label: 'ReverbNation',
	matches: [
		'*://www.reverbnation.com/*',
	],
	js: 'connectors/reverbnation.js',
	id: 'reverbnation',
}, {
	label: 'NRK Radio',
	matches: [
		'*://radio.nrk.no/*',
	],
	js: 'connectors/nrk-radio.js',
	id: 'nrk-radio',
}, {
	label: 'Internet Archive',
	matches: [
		'*://archive.org/details/*',
	],
	js: 'connectors/archive.js',
	id: 'archive',
}, {
	label: 'Odnoklassniki',
	matches: [
		'*://odnoklassniki.ru/*',
		'*://ok.ru/*',
	],
	js: 'connectors/odnoklassniki.js',
	id: 'odnoklassniki',
}, {
	label: 'Online Radio Box',
	matches: [
		'*://onlineradiobox.com/*',
	],
	js: 'connectors/onlineradiobox.js',
	id: 'onlineradiobox',
}, {
	label: '163 Music',
	matches: [
		'*://music.163.com/*',
	],
	js: 'connectors/163-music.js',
	id: '163-music',
}, {
	label: 'Ambient Sleeping Pill',
	matches: [
		'*://ambientsleepingpill.com/',
	],
	js: 'connectors/ambientsleepingpill.js',
	id: 'ambientsleepingpill',
}, {
	label: 'a.m. ambient',
	matches: [
		'*://amambient.com/',
	],
	js: 'connectors/ambientsleepingpill.js',
	id: 'amambient',
}, {
	label: 'Tidal',
	matches: [
		'*://listen.tidalhifi.com/*',
		'*://listen.tidal.com/*',
	],
	js: 'connectors/tidal.js',
	id: 'tidal',
}, {
	label: 'Hype Machine Featured Albums',
	matches: [
		'*://hypem.com/album/*',
	],
	js: 'connectors/hypem-albums.js',
	id: 'hypem-premieres',
}, {
	label: 'Hype Machine',
	matches: [
		'*://hypem.com/*',
	],
	js: 'connectors/hypem.js',
	id: 'hypem',
}, {
	label: 'Radionomy',
	matches: [
		'*://www.radionomy.com/*',
	],
	js: 'connectors/radionomy.js',
	id: 'radionomy',
}, {
	label: 'JazzAndRain',
	matches: [
		'*://*.jazzandrain.com/*',
	],
	js: 'connectors/jazzandrain.js',
	id: 'jazzandrain',
}, {
	label: 'RelaxingBeats',
	matches: [
		'*://*.relaxingbeats.com/*',
	],
	js: 'connectors/jazzandrain.js',
	id: 'relaxingbeats',
}, {
	label: 'EpicMusicTime',
	matches: [
		'*://*.epicmusictime.com/*',
	],
	js: 'connectors/jazzandrain.js',
	id: 'epicmusictime',
}, {
	label: 'AccuJazz',
	matches: [
		'*://www.accuradio.com/pop_player/accujazz/*',
	],
	js: 'connectors/accujazz.js',
	id: 'accujazz',
}, {
	label: 'AccuRadio',
	matches: [
		'*://www.accuradio.com/*',
	],
	js: 'connectors/accuradio.js',
	id: 'accuradio',
}, {
	label: 'Imusic.am',
	matches: [
		'*://imusic.am/*',
	],
	js: 'connectors/imusic.am.js',
	id: 'imusic.am',
}, {
	label: 'Earbits',
	matches: [
		'*://www.earbits.com/*',
	],
	js: 'connectors/earbits.js',
	id: 'earbits',
}, {
	label: 'Player.fm',
	matches: [
		'*://player.fm/*',
	],
	js: 'connectors/player.fm.js',
	id: 'player.fm',
}, {
	label: 'Sound Test',
	matches: [
		'*://sndtst.com/*',
	],
	js: 'connectors/sndtst.js',
	id: 'sndtst',
}, {
	label: 'RadioTunes',
	matches: [
		'*://www.radiotunes.com/*',
	],
	js: 'connectors/radiotunes.js',
	id: 'radiotunes',
}, {
	label: 'RockRadio',
	matches: [
		'*://www.rockradio.com/*',
	],
	js: 'connectors/radiotunes.js',
	id: 'rockradio',
}, {
	label: 'ClassicalRadio',
	matches: [
		'*://www.classicalradio.com/*',
	],
	js: 'connectors/radiotunes.js',
	id: 'classicalradio',
}, {
	label: 'Audacy',
	matches: [
		'*://www.audacy.com/*',
	],
	js: 'connectors/audacy.js',
	id: 'audacy',
}, {
	label: 'GetWorkDoneMusic',
	matches: [
		'*://*.getworkdonemusic.com/*',
	],
	js: 'connectors/getworkdonemusic.js',
	id: 'getworkdonemusic',
}, {
	label: 'Jamendo',
	matches: [
		'*://www.jamendo.com/*',
	],
	js: 'connectors/jamendo.js',
	id: 'jamendo',
}, {
	label: 'Bandzone.cz',
	matches: [
		'*://bandzone.cz/*',
	],
	js: 'connectors/bandzone.cz.js',
	id: 'bandzone.cz',
}, {
	label: 'Music Player for Google Drive',
	matches: [
		'*://www.driveplayer.com/*',
	],
	js: 'connectors/driveplayer.js',
	id: 'driveplayer',
}, {
	label: 'Kodi',
	js: 'connectors/kodi.js',
	id: 'kodi',
}, {
	label: 'Superplayer',
	matches: [
		'*://www.superplayer.fm/*',
	],
	js: 'connectors/superplayer.js',
	id: 'superplayer',
}, {
	label: 'RMFON',
	matches: [
		'*://www.rmfon.pl/*',
	],
	js: 'connectors/rmfon.js',
	id: 'rmfon',
}, {
	label: 'JazzRadio',
	matches: [
		'*://www.jazzradio.com/*',
	],
	js: 'connectors/radiotunes.js',
	id: 'jazzradio',
}, {
	label: 'Zen Radio',
	matches: [
		'*://www.zenradio.com/*',
	],
	js: 'connectors/radiotunes.js',
	id: 'zenradio',
}, {
	label: 'SomaFM',
	matches: [
		'*://somafm.com/player/*',
	],
	js: 'connectors/somafm.js',
	id: 'somafm',
}, {
	label: 'Free Music Archive',
	matches: [
		'*://*.freemusicarchive.org/*',
	],
	js: 'connectors/freemusicarchive.js',
	id: 'freemusicarchive',
}, {
	label: 'Reddit Music Player',
	matches: [
		'*://reddit.musicplayer.io/',
	],
	js: 'connectors/redditmusicplayer.js',
	id: 'redditmusicplayer',
}, {
	label: 'Новое Радио',
	matches: [
		'*://www.novoeradio.by/*',
	],
	js: 'connectors/novoeradio.js',
	id: 'novoeradio',
}, {
	label: 'Яндекс.Радио',
	matches: [
		'*://radio.yandex.ru/*',
		'*://radio.yandex.by/*',
		'*://radio.yandex.kz/*',
		'*://radio.yandex.ua/*',
	],
	js: 'connectors/yandex-music.js',
	id: 'yandex-radio',
}, {
	label: 'Radio Paradise',
	matches: [
		'*://radioparadise.com/*',
	],
	js: 'connectors/radioparadise.js',
	id: 'radioparadise',
	allFrames: true,
}, {
	label: 'Beatport',
	matches: [
		'*://www.beatport.com/*',
	],
	js: 'connectors/beatport.js',
	id: 'beatport',
}, {
	label: 'wavo',
	matches: [
		'*://wavo.me/*',
	],
	js: 'connectors/wavo.js',
	id: 'wavo',
}, {
	label: 'FluxFM Berlin',
	matches: [
		'*://www.fluxfm.de/*',
	],
	js: 'connectors/fluxfm.js',
	id: 'fluxfm',
}, {
	label: 'Noise FM',
	matches: [
		'*://noisefm.ru/*',
		'*://en.noisefm.ru/*',
	],
	js: 'connectors/noisefm.js',
	id: 'noisefm',
	allFrames: true,
}, {
	label: 'WWOZ',
	matches: [
		'*://www.wwoz.org/listen/player/*',
	],
	js: 'connectors/wwoz.js',
	id: 'wwoz',
}, {
	label: 'Sonerezh',
	matches: [
		'*://sonerezh.*/*',
		'*://*/*sonerezh*',
	],
	js: 'connectors/sonerezh.js',
	id: 'sonerezh',
}, {
	label: 'Youradio',
	matches: [
		'*://www.youradio.cz/*',
	],
	js: 'connectors/youradio.js',
	id: 'youradio',
}, {
	label: 'GPMusic',
	matches: [
		'*://player.gpmusic.co/*',
	],
	js: 'connectors/gpmusic.js',
	id: 'gpmusic',
}, {
	label: 'Nightwave Plaza',
	matches: [
		'*://plaza.one/*',
	],
	js: 'connectors/plaza.js',
	id: 'plaza',
}, {
	label: 'Retrowave',
	matches: [
		'*://retrowave.ru/*',
	],
	js: 'connectors/retrowave.js',
	id: 'retrowave',
}, {
	label: 'Genie',
	matches: [
		'*://www.genie.co.kr/player/fPlayer*',
	],
	js: 'connectors/genie.js',
	id: 'genie',
}, {
	label: 'Bugs',
	matches: [
		'*://music.bugs.co.kr/newPlayer*',
	],
	js: 'connectors/bugs.js',
	id: 'bugs',
}, {
	label: 'openfm',
	matches: [
		'*://open.fm/*',
	],
	js: 'connectors/openfm.js',
	id: 'openfm',
}, {
	label: 'Playmoss',
	matches: [
		'*://playmoss.com/*',
	],
	js: 'connectors/playmoss.js',
	id: 'playmoss',
}, {
	label: 'Apidog',
	matches: [
		'*://apidog.ru/*',
	],
	js: 'connectors/apidog.js',
	id: 'apidog',
}, {
	label: 'Pinguin Radio',
	matches: [
		'*://pinguinradio.com/*',
	],
	js: 'connectors/pinguinradio.js',
	id: 'pinguinradio',
}, {
	label: 'JioSaavn',
	matches: [
		'*://www.jiosaavn.com/*',
	],
	js: 'connectors/jiosaavn.js',
	id: 'jiosaavn',
}, {
	label: 'Anghami',
	matches: [
		'*://*.anghami.com/*',
	],
	js: 'connectors/anghami.js',
	id: 'anghami',
}, {
	label: 'Mail.ru Music',
	matches: [
		'*://my.mail.ru/music',
		'*://my.mail.ru/music/*',
	],
	js: 'connectors/mail.ru.js',
	id: 'mail.ru',
}, {
	label: 'Emby/Jellyfin',
	matches: [
		'*://*8096/web/*',
		'*://*8920/web/*',
		'*://app.emby.media/*',
	],
	js: 'connectors/emby.js',
	id: 'emby',
}, {
	label: 'Freegal',
	matches: [
		'*://*.freegalmusic.com/*',
	],
	js: 'connectors/freegalmusic.js',
	id: 'freegalmusic',
}, {
	label: 'hoopla',
	matches: [
		'*://www.hoopladigital.com/*',
	],
	js: 'connectors/hoopladigital.js',
	id: 'hoopladigital',
}, {
	label: 'Monstercat',
	matches: [
		'*://www.monstercat.com/*',
	],
	js: 'connectors/monstercat.js',
	id: 'monstercat',
}, {
	label: 'Listen.moe',
	matches: [
		'*://listen.moe/*',
	],
	js: 'connectors/listen.moe.js',
	id: 'listen.moe',
}, {
	label: 'Fair Price Music',
	matches: [
		'*://www.fairpricemusic.com/*',
	],
	js: 'connectors/fairpricemusic.js',
	id: 'fairpricemusic',
}, {
	label: 'Radio ULTRA',
	matches: [
		'*://player.radioultra.ru/*',
	],
	js: 'connectors/radioultra.js',
	id: 'radioultra',
}, {
	label: 'Наше Радио',
	matches: [
		'*://player.nashe.ru/*',
	],
	js: 'connectors/radioultra.js',
	id: 'nashe',
}, {
	label: 'RockFM',
	matches: [
		'*://player.rockfm.ru/*',
	],
	js: 'connectors/radioultra.js',
	id: 'rockfm',
}, {
	label: 'Radio JAZZ',
	matches: [
		'*://player.radiojazzfm.ru/*',
	],
	js: 'connectors/radioultra.js',
	id: 'radiojazzfm',
}, {
	label: 'Jazz24',
	matches: [
		'*://www.jazz24.org/',
		'*://v6.player.abacast.net/854',
	],
	js: 'connectors/jazz24.js',
	id: 'jazz24',
}, {
	label: 'Planet Radio',
	matches: [
		'*://planetradio.co.uk/*/player/*',
	],
	js: 'connectors/planetradio.js',
	id: 'planetradio',
}, {
	label: 'Roxx Radio',
	matches: [
		'*://roxx.gr/radio/*',
	],
	js: 'connectors/roxx.js',
	id: 'roxx',
}, {
	label: 'ListenOnRepeat',
	matches: [
		'*://listenonrepeat.com/*',
	],
	js: 'connectors/listenonrepeat.js',
	id: 'listenonrepeat',
}, {
	label: 'Duckburg Radio',
	matches: [
		'*://*.radio-mb.com/*',
	],
	js: 'connectors/radio-mb.js',
	id: 'radio-mb',
}, {
	label: 'Webradio.de',
	matches: [
		'*://www.webradio.de/*',
	],
	js: 'connectors/radioplayer.js',
	id: 'webradio.de',
}, {
	label: 'The Breeze',
	matches: [
		'*://www.thebreeze.com/*/radioplayer/*',
	],
	js: 'connectors/radioplayer.js',
	id: 'thebreeze',
}, {
	label: 'RadioPlayer',
	matches: [
		'*://ukradioplayer.*/*',
		'*://radioplayer.*/*',
		// Generic patterns
		'*://*/radioplayer/*',
		'*://*/radio/player/',
		'*://*/*/radio/player/',
	],
	js: 'connectors/radioplayer.js',
	id: 'radioplayer',
}, {
	label: 'deltaradio',
	matches: [
		'*://www.deltaradio.de/*',
	],
	js: 'connectors/deltaradio.de.js',
	id: 'deltaradio.de',
}, {
	label: 'ByteFM',
	matches: [
		'*://www.byte.fm/*',
	],
	js: 'connectors/byte.fm.js',
	id: 'byte.fm',
}, {
	label: 'Deutschlandfunk Nova',
	matches: [
		'*://www.deutschlandfunknova.de/*',
	],
	js: 'connectors/deutschlandfunknova.js',
	id: 'deutschlandfunknova',
}, {
	label: 'QQ Music',
	matches: [
		'*://y.qq.com/portal/*',
	],
	js: 'connectors/qq-music.js',
	id: 'qq-music',
}, {
	label: 'QQ Video',
	matches: [
		'*://v.qq.com/x/*',
	],
	js: 'connectors/qq-video.js',
	id: 'qq-video',
}, {
	label: 'Naver',
	matches: [
		'*://playerui.music.naver.com/*',
	],
	js: 'connectors/naver.js',
	id: 'naver',
}, {
	label: 'Soribada',
	matches: [
		'*://www.soribada.com/*',
	],
	js: 'connectors/soribada.js',
	id: 'soribada',
}, {
	label: 'Flo',
	matches: [
		'*://www.music-flo.com/*',
	],
	js: 'connectors/music-flo.js',
	id: 'music-flo',
}, {
	label: 'Discogs',
	matches: [
		'*://www.discogs.com/*',
	],
	js: 'connectors/youtube-embed.js',
	id: 'youtube-embed',
	allFrames: true,
}, {
	label: 'NPR',
	matches: [
		'*://www.npr.org/*',
	],
	js: 'connectors/npr.js',
	id: 'npr',
}, {
	label: 'Streamsquid',
	matches: [
		'*://streamsquid.com/*',
	],
	js: 'connectors/streamsquid.js',
	id: 'streamsquid',
}, {
	label: 'eMusic',
	matches: [
		'*://www.emusic.com/*',
	],
	js: 'connectors/emusic.js',
	id: 'emusic',
}, {
	label: 'LyricsTraining',
	matches: [
		'*://lyricstraining.com/*',
	],
	js: 'connectors/lyricstraining.js',
	id: 'lyricstraining',
}, {
	label: 'Music Walker',
	matches: [
		'*://arkanath.com/MusicWalker/*',
	],
	js: 'connectors/musicwalker.js',
	id: 'musicwalker',
}, {
	label: 'radioeins',
	matches: [
		'*://www.radioeins.de/livestream/*',
	],
	js: 'connectors/radioeins.js',
	id: 'radioeins',
}, {
	label: 'Fritz',
	matches: [
		'*://www.fritz.de/livestream/*',
	],
	js: 'connectors/fritz.js',
	id: 'fritz',
}, {
	label: 'Musicoin',
	matches: [
		'*://musicoin.org/*',
	],
	js: 'connectors/musicoin.js',
	id: 'musicoin',
}, {
	label: '181.fm',
	matches: [
		'*://player.181fm.com/*',
	],
	js: 'connectors/181.fm.js',
	id: '181.fm',
}, {
	label: 'Phish.in',
	matches: [
		'*://phish.in/*',
	],
	js: 'connectors/phish.in.js',
	id: 'phish.in',
}, {
	label: 'Rainwave',
	matches: [
		'*://rainwave.cc/*',
		'*://all.rainwave.cc/*',
		'*://game.rainwave.cc/*',
		'*://chiptune.rainwave.cc/*',
		'*://ocr.rainwave.cc/*',
		'*://covers.rainwave.cc/*',
	],
	js: 'connectors/rainwave.js',
	id: 'rainwave',
}, {
	label: 'Retro Synthwave',
	matches: [
		'*://www.retro-synthwave.com/*',
	],
	js: 'connectors/retro-synthwave.js',
	id: 'retro-synthwave',
}, {
	label: 'Радиоволна.нет',
	matches: [
		'*://radiovolna.net/*',
	],
	js: 'connectors/radiovolna.js',
	id: 'radiovolna',
}, {
	label: 'Feedbands',
	matches: [
		'*://feedbands.com/*',
	],
	js: 'connectors/feedbands.js',
	id: 'feedbands',
}, {
	label: 'Taazi',
	matches: [
		'*://taazi.com/*',
	],
	js: 'connectors/taazi.js',
	id: 'taazi',
}, {
	label: 'Patari',
	matches: [
		'*://patari.pk/*',
	],
	js: 'connectors/patari.js',
	id: 'patari',
}, {
	label: 'pCloud',
	matches: [
		'*://my.pcloud.com/*',
	],
	js: 'connectors/pcloud.js',
	id: 'pcloud',
}, {
	label: 'JetSetRadio Live',
	matches: [
		'*://jetsetradio.live/*',
	],
	js: 'connectors/jetsetradio.live.js',
	id: 'jetsetradio.live',
}, {
	label: 'FIP',
	matches: [
		'*://www.fip.fr/*',
		'*://www.radiofrance.fr/fip/*',
		'*://www.radiofrance.fr/fip*',
	],
	js: 'connectors/fip.js',
	id: 'fip',
}, {
	label: 'RemixRotation',
	matches: [
		'*://remixrotation.com/*',
	],
	js: 'connectors/remixrotation.js',
	id: 'remixrotation',
}, {
	label: 'WFMU',
	matches: [
		'*://wfmu.org/*',
	],
	js: 'connectors/wfmu.js',
	id: 'wfmu',
}, {
	label: 'SiriusXM',
	matches: [
		'*://player.siriusxm.com/*',
		'*://player.siriusxm.ca/*',
	],
	js: 'connectors/siriusxm-player.js',
	id: 'siriusxm-player',
}, {
	label: '1ting',
	matches: [
		'*://www.1ting.com/player/*',
		'*://www.1ting.com/p_*',
		'*://www.1ting.com/album*',
		'*://www.1ting.com/rand.php*',
		'*://www.1ting.com/day/*',
		'*://h5.1ting.com/*',
	],
	js: 'connectors/1ting.js',
	id: '1ting',
}, {
	label: 'Douban Artists',
	matches: [
		'*://music.douban.com/artists/player/*',
	],
	js: 'connectors/douban-artists.js',
	id: 'douban-artists',
}, {
	label: 'Kugou',
	matches: [
		'*://www.kugou.com/song/*',
	],
	js: 'connectors/kugou.js',
	id: 'kugou',
}, {
	label: 'Gimme Radio',
	matches: [
		'*://gimmeradio.com/*',
		'*://www.gimmeradio.com/*',
		'*://gimmecountry.com/*',
		'*://www.gimmecountry.com/*',
	],
	js: 'connectors/gimmeradio.js',
	id: 'gimmeradio',
}, {
	label: '9sky',
	matches: [
		'*://www.9sky.com/music*',
		'*://www.9sky.com/mv/detail*',
	],
	js: 'connectors/9sky.js',
	id: '9sky',
}, {
	label: 'Vagalume.FM',
	matches: [
		'*://vagalume.fm/*',
		'*://*.vagalume.com.br/*',
	],
	js: 'connectors/vagalume.js',
	id: 'vagalume',
}, {
	label: 'Radiooooo',
	matches: [
		'*://radiooooo.com/*',
		'*://mobile.radiooooo.com/*',
	],
	js: 'connectors/radiooooo.js',
	id: 'radiooooo',
}, {
	label: 'LetsLoop',
	matches: [
		'*://letsloop.com/*',
	],
	js: 'connectors/letsloop.js',
	id: 'letsloop',
}, {
	label: 'Mideast Tunes',
	matches: [
		'*://mideastunes.com/*',
		'*://map.mideastunes.com/*',
	],
	js: 'connectors/mideastunes.js',
	id: 'mideastunes',
}, {
	label: 'Český Rozhlas',
	matches: [
		'*://prehravac.rozhlas.cz/*',
	],
	js: 'connectors/rozhlas.js',
	id: 'rozhlas',
}, {
	label: 'blocSonic',
	matches: [
		'*://*.blocsonic.com/*',
	],
	js: 'connectors/blocsonic.js',
	id: 'blocsonic',
}, {
	label: 'Resonate',
	matches: [
		'*://stream.resonate.coop/*',
	],
	js: 'connectors/resonate.js',
	id: 'resonate',
}, {
	label: 'KEXP Radio',
	matches: [
		'*://*.kexp.org/*',
	],
	js: 'connectors/kexp.js',
	id: 'kexp',
}, {
	label: 'Hotmixradio.fr',
	matches: [
		'*://www.hotmixradio.fr/*',
	],
	js: 'connectors/hotmixradio.js',
	id: 'hotmixradio',
}, {
	label: 'Aphex Twin',
	matches: [
		'*://aphextwin.warp.net/*',
	],
	js: 'connectors/warp-aphextwin.js',
	id: 'warp-aphextwin',
}, {
	label: 'Resident Advisor',
	matches: [
		'*://www.residentadvisor.net/*',
	],
	js: 'connectors/residentadvisor.js',
	id: 'residentadvisor',
}, {
	label: 'Zachary Seguin Music',
	matches: [
		'*://music.zacharyseguin.ca/*',
	],
	js: 'connectors/musickit.js',
	id: 'zacharyseguin',
}, {
	label: 'Joox',
	matches: [
		'*://www.joox.com/*',
	],
	js: 'connectors/joox.js',
	id: 'joox',
}, {
	label: 'Musish',
	matches: [
		'*://musi.sh/*',
	],
	js: 'connectors/musickit.js',
	id: 'musish',
}, {
	label: '1001tracklists',
	matches: [
		'*://www.1001tracklists.com/tracklist/*',
	],
	js: 'connectors/1001tracklists.js',
	id: '1001tracklists',
}, {
	label: 'YouTube Music',
	matches: [
		'*://music.youtube.com/*',
	],
	js: 'connectors/youtube-music.js',
	id: 'youtube-music',
}, {
	label: 'Radiozenders.FM',
	matches: [
		'*://www.radiozenders.fm/*',
	],
	js: 'connectors/radiozenders.js',
	id: 'radiozenders',
}, {
	label: 'Invidious',
	matches: [
		'*://*.invidio.us/*',
	],
	js: 'connectors/invidious.js',
	id: 'invidious',
}, {
	label: 'Pretzel',
	matches: [
		'*://*.pretzel.rocks/*',
	],
	js: 'connectors/pretzel.js',
	id: 'pretzel',
}, {
	label: 'Radio Kyivstar',
	matches: [
		'*://radio.kyivstar.ua/*',
	],
	js: 'connectors/kyivstar.js',
	id: 'kyivstar',
}, {
	label: 'Funkwhale',
	js: 'connectors/funkwhale.js',
	id: 'funkwhale',
}, {
	label: '9128 live',
	matches: [
		'*://9128.live/*',
	],
	js: 'connectors/radioco.js',
	id: '9128.live',
	allFrames: true,
}, {
	label: 'Radio.co',
	matches: [
		'*://embed.radio.co/player/*',
	],
	js: 'connectors/radioco.js',
	id: 'radioco',
}, {
	label: 'R/a/dio',
	matches: [
		'*://r-a-d.io/*',
	],
	js: 'connectors/r-a-d.io.js',
	id: 'r-a-d.io',
}, {
	label: 'Apple Music',
	matches: [
		'*://*music.apple.com/*',
	],
	js: 'connectors/apple-music.js',
	id: 'apple-music',
}, {
	label: 'Primephonic',
	matches: [
		'*://play.primephonic.com/*',
	],
	js: 'connectors/primephonic.js',
	id: 'primephonic',
}, {
	label: 'Watch2Gether',
	matches: [
		'*://w2g.tv/*',
	],
	js: 'connectors/watch2gether.js',
	id: 'watch2gether',
}, {
	label: 'Poolsuite',
	matches: [
		'*://poolsuite.net/*',
	],
	js: 'connectors/poolsuite.js',
	id: 'poolsuite',
}, {
	label: 'GDS.FM',
	matches: [
		'*://www.gds.fm/*',
		'*://gds.fm/*',
	],
	js: 'connectors/gds.fm.js',
	id: 'gds',
}, {
	label: 'Wynk Music',
	matches: [
		'*://wynk.in/music*',
	],
	js: 'connectors/wynk.js',
	id: 'wynk',
}, {
	label: 'RadioJavan',
	matches: [
		'*://www.radiojavan.com/*',
	],
	js: 'connectors/radiojavan.js',
	id: 'radiojavan',
}, {
	label: 'Audiomack',
	matches: [
		'*://audiomack.com/*',
	],
	js: 'connectors/audiomack.js',
	id: 'audiomack',
}, {
	label: 'Global Player',
	matches: [
		'*://www.globalplayer.com/*',
	],
	js: 'connectors/globalplayer.js',
	id: 'globalplayer',
}, {
	label: 'The Current',
	matches: [
		'*://www.thecurrent.org/*',
	],
	js: 'connectors/thecurrent.js',
	id: 'thecurrent',
}, {
	label: 'pan y rosas discos',
	matches: [
		'*://www.panyrosasdiscos.net/*',
	],
	js: 'connectors/panyrosasdiscos.js',
	id: 'panyrosasdiscos',
}, {
	label: 'GRRIF',
	matches: [
		'*://*.grrif.ch/*',
	],
	js: 'connectors/grrif.js',
	id: 'grrif',
}, {
	label: 'newgrounds',
	matches: [
		'*://www.newgrounds.com/audio*',
	],
	js: 'connectors/newgrounds.js',
	id: 'newgrounds',
}, {
	label: 'Jango',
	matches: [
		'*://www.jango.com/*',
	],
	js: 'connectors/jango.js',
	id: 'jango',
}, {
	label: 'PlayIrish',
	matches: [
		'*://*.playirish.ie/*',
	],
	js: 'connectors/playirish.js',
	id: 'playirish',
}, {
	label: 'Radio Record',
	matches: [
		'*://www.radiorecord.ru/*',
	],
	js: 'connectors/radiorecord.js',
	id: 'radiorecord',
}, {
	label: 'Imago Radio',
	matches: [
		'*://*.imago.fm/*',
	],
	js: 'connectors/imago.js',
	id: 'imago',
}, {
	label: 'Provoda.ch',
	matches: [
		'*://*.provoda.ch/*',
	],
	js: 'connectors/provoda.ch.js',
	id: 'provoda.ch',
}, {
	label: 'Atomic Music Space',
	matches: [
		'*://stream.atomicmusic.space/*',
	],
	js: 'connectors/atomicmusic.space.js',
	id: 'atomicmusic.space',
}, {
	label: 'The-radio.ru',
	matches: [
		'*://the-radio.ru/*',
	],
	js: 'connectors/the-radio.ru.js',
	id: 'the-radio.ru',
}, {
	label: 'HQ Radio',
	matches: [
		'*://hqradio.ru/*',
	],
	js: 'connectors/hqradio.js',
	id: 'hqradio',
}, {
	label: 'Smooth FM',
	matches: [
		'*://smoothfm.iol.pt/*',
	],
	js: 'connectors/smoothfm.js',
	id: 'smoothfm',
}, {
	label: 'Vodafone.fm',
	matches: [
		'*://vodafone.fm/*',
	],
	js: 'connectors/vodafone.fm.js',
	id: 'vodafonefm',
}, {
	label: 'Relisten.net',
	matches: [
		'*://relisten.net/*',
	],
	js: 'connectors/relisten.js',
	id: 'relisten',
}, {
	label: 'UpBeatRadio',
	matches: [
		'*://upbeatradio.net/*',
	],
	js: 'connectors/upbeatradio.js',
	id: 'upbeatradio',
}, {
	label: 'Chillhop',
	matches: [
		'*://chillhop.com/*',
	],
	js: 'connectors/chillhop.js',
	id: 'chillhop',
}, {
	label: 'DatPiff',
	matches: [
		'*://www.datpiff.com/player/*',
	],
	js: 'connectors/datpiff.js',
	id: 'datpiff',
	allFrames: true,
}, {
	label: 'Shuffle',
	matches: [
		'*://shuffle.one/play*',
	],
	js: 'connectors/shuffleone.js',
	id: 'shuffleone',
}, {
	label: 'JB FM',
	matches: [
		'*://jb.fm/player/*',
	],
	js: 'connectors/jb.fm.js',
	id: 'jbfm',
}, {
	label: 'SECTOR Radio',
	matches: [
		'*://sectorradio.ru/*',
	],
	js: 'connectors/sectorradio.js',
	id: 'sectorradio',
}, {
	label: 'LiveOne',
	matches: [
		'*://*.liveone.com/*',
	],
	js: 'connectors/liveone.js',
	id: 'liveone',
}, {
	label: 'PocketCasts',
	matches: [
		'*://play.pocketcasts.com/*',
	],
	js: 'connectors/pocketcasts.js',
	id: 'pocketcasts',
}, {
	label: 'Clyp',
	matches: [
		'*://clyp.it/*',
	],
	js: 'connectors/clyp.js',
	id: 'clyp',
}, {
	label: 'RTBF Radio',
	matches: [
		'*://www.rtbf.be/radio/*',
	],
	js: 'connectors/rtbf.js',
	id: 'rtbf',
}, {
	label: 'TuneTrack',
	matches: [
		'*://tunetrack.net/*',
	],
	js: 'connectors/tunetrack.js',
	id: 'tunetrack',
}, {
	label: 'Musify',
	matches: [
		'*://*.musify.club/*',
	],
	js: 'connectors/musify.js',
	id: 'musify',
}, {
	label: 'Radio Rethink',
	matches: [
		'*://www.radiorethink.com/*',
	],
	js: 'connectors/radiorethink.js',
	id: 'radiorethink',
}, {
	label: 'SoundClick',
	matches: [
		'*://www.soundclick.com/*',
	],
	js: 'connectors/soundclick.js',
	id: 'soundclick',
}, {
	label: 'Napster',
	matches: [
		'*://app.napster.com/*',
	],
	js: 'connectors/napster.js',
	id: 'napster',
}, {
	label: 'abc.net.au',
	matches: [
		'*://www.abc.net.au/*/listen-live/*',
	],
	js: 'connectors/abc.net.au.js',
	id: 'abcnetau',
}, {
	label: 'JQBX',
	matches: [
		'*://app.jqbx.fm/*',
	],
	js: 'connectors/jqbx.js',
	id: 'jqbx',
}, {
	label: 'music.jsososo.com',
	matches: [
		'*://y.jsososo.com/*',
		'*://music.jsososo.com/*',
	],
	js: 'connectors/jsososo.js',
	id: 'jsososo',
}, {
	label: 'Supla',
	matches: [
		'*://*.supla.fi/*',
	],
	js: 'connectors/supla.js',
	id: 'supla',
}, {
	label: 'swr3',
	matches: [
		'*://www.swr3.de/*',
	],
	js: 'connectors/swr3.js',
	id: 'swr3',
}, {
	label: 'Epidemic Sound',
	matches: [
		'*://*.epidemicsound.com/*',
	],
	js: 'connectors/epidemicsound.js',
	id: 'epidemicsound',
}, {
	label: 'Rekt Network',
	matches: [
		'*://rekt.network/*',
	],
	js: 'connectors/rekt.network.js',
	id: 'rektnetwork',
}, {
	label: 'Nightride FM',
	matches: [
		'*://nightride.fm/*',
	],
	js: 'connectors/nightride.fm.js',
	id: 'nightridefm',
}, {
	label: 'Qobuz',
	matches: [
		'*://*.qobuz.com/*',
	],
	js: 'connectors/qobuz.js',
	id: 'qobuz',
}, {
	label: 'TruckersFM',
	matches: [
		'*://*.truckers.fm/*',
	],
	js: 'connectors/truckersfm.js',
	id: 'truckersfm',
}, {
	id: 'winampify',
	label: 'Winampify',
	js: 'connectors/winampify.js',
	matches: [
		'*://winampify.io/*',
	],
}, {
	label: 'detektor.fm',
	matches: [
		'*://detektor.fm/*',
	],
	js: 'connectors/detektorfm.js',
	id: 'detektorfm',
}, {
	label: 'iBroadcast',
	matches: [
		'*://media.ibroadcast.com/*',
	],
	js: 'connectors/ibroadcast.js',
	id: 'ibroadcast',
}, {
	label: 'Radio7',
	matches: [
		'*://radio7.lv/*',
	],
	js: 'connectors/radio7.js',
	id: 'radio7lv',
}, {
	label: 'TOWER RECORDS MUSIC',
	matches: [
		'*://music.tower.jp/*',
	],
	js: 'connectors/towerrecordsmusic.js',
	id: 'towerrecordsmusic',
}, {
	label: 'Eggs',
	matches: [
		'*://eggs.mu/*',
	],
	js: 'connectors/eggs.js',
	id: 'eggs',
}, {
	label: 'Jamstash',
	matches: [
		'*://jamstash.com/*',
	],
	js: 'connectors/jamstash.js',
	id: 'jamstash',
}, {
	label: 'SubFire',
	matches: [
		'*://p.subfireplayer.net/*',
	],
	js: 'connectors/subfire.js',
	id: 'subfire',
}, {
	label: 'Idagio',
	matches: [
		'*://app.idagio.com/*',
	],
	js: 'connectors/idagio.js',
	id: 'idagio',
}, {
	label: 'Relax FM',
	matches: ['*://relax-fm.ru/*'],
	js: 'connectors/relaxfm.js',
	id: 'relaxfm',
}, {
	label: 'Laut.fm',
	matches: ['*://laut.fm/*'],
	js: 'connectors/laut.fm.js',
	id: 'laut.fm',
}, {
	label: 'Magnatune',
	matches: ['*://magnatune.com/*'],
	js: 'connectors/magnatune.js',
	id: 'magnatune',
}, {
	label: 'Libre.fm',
	matches: ['*://libre.fm/*'],
	js: 'connectors/librefm.js',
	id: 'librefm',
}, {
	label: 'Brain.fm',
	matches: ['*://www.brain.fm/*'],
	js: 'connectors/brainfm.js',
	id: 'brainfm',
}, {
	label: 'bullofheaven.com',
	matches: ['*://bullofheaven.com/*'],
	js: 'connectors/bullofheaven.com.js',
	id: 'bullofheavencom',
}, {
	label: 'All Classical Portland',
	matches: ['*://player.allclassical.org/*'],
	js: 'connectors/allclassical.org.js',
	id: 'allclassicalportland',
}, {
	label: 'Migu Music',
	matches: ['*://music.migu.cn/*'],
	js: 'connectors/migu-music.js',
	id: 'migu-music',
}, {
	label: 'Weibo',
	matches: ['*://weibo.com/*', '*://*.weibo.com/*'],
	js: 'connectors/weibo.js',
	id: 'weibo',
}, {
	label: 'Street Voice',
	matches: ['*://streetvoice.cn/*', '*://streetvoice.com/*'],
	js: 'connectors/streetvoice.js',
	id: 'streetvoice',
}, {
	label: 'Red Bull',
	matches: ['*://www.redbull.com/*'],
	js: 'connectors/redbull.js',
	id: 'redbull',
}, {
	label: 'Synology',
	matches: [
		'*://*5000/*',
	],
	js: 'connectors/synology.js',
	id: 'synology',
}, {
	label: 'Ragya',
	matches: [
		'*://www.ragya.com/*',
	],
	js: 'connectors/ragya.js',
	id: 'ragya',
}, {

	label: 'CodeRadio',
	matches: [
		'https://coderadio.freecodecamp.org/*',
	],
	js: 'connectors/coderadio.js',
	id: 'coderadio',
}, {
	label: 'Dash Radio',
	matches: [
		'*://dashradio.com/*',
	],
	js: 'connectors/dashradio.js',
	id: 'dashradio',
}, {
	label: 'Niconico',
	matches: [
		'*://www.nicovideo.jp/*',
	],
	js: 'connectors/nicovideo.js',
	id: 'nicovideo',
}, {
	label: 'СберЗвук',
	matches: [
		'*://sber-zvuk.com/*',
	],
	js: 'connectors/sber-zvuk.js',
	id: 'sber-zvuk',
}, {
	label: 'Navidrome',
	js: 'connectors/navidrome.js',
	id: 'navidrome',
}, {
	label: 'turntable.fm',
	matches: [
		'*://turntable.fm/*',
	],
	js: 'connectors/turntable.fm.js',
	id: 'turntable.fm',
}, {
	label: 'Burntable',
	matches: [
		'*://*.burntable.com/*',
	],
	js: 'connectors/burntable.js',
	id: 'burntable',
}, {
	label: 'Stingray Music',
	matches: [
		'*://*.stingray.com/*',
	],
	js: 'connectors/stingray.js',
	id: 'stingray',
}, {
	label: 'CBC Music',
	matches: [
		'*://www.cbc.ca/listen/cbc-music-playlists*',
	],
	js: 'connectors/cbcmusic.js',
	id: 'cbcmusic',
}, {
	label: 'Indie88',
	matches: [
		'*://indie88.com/lean-stream-player/*',
		'*://cob.leanplayer.com/CINDFM*',
	],
	js: 'connectors/indie88.js',
	id: 'indie88',
}, {
	label: 'Playlist Randomizer',
	matches: [
		'*://www.playlist-randomizer.com/*',
	],
	js: 'connectors/playlist-randomizer.js',
	id: 'playlist-randomizer',
}, {
	label: 'QueUp',
	matches: [
		'*://www.queup.net/*',
	],
	js: 'connectors/queup.js',
	id: 'queup',
}, {
	label: 'Live 365',
	matches: [
		'*://*.live365.com/*',
	],
	js: 'connectors/live365.js',
	id: 'live365',
}, {
	label: 'Lounge.fm',
	matches: [
		'*://www.lounge.fm/*',
	],
	js: 'connectors/lounge.fm.js',
	id: 'lounge.fm',
}, {
	label: 'EulerBeats',
	matches: [
		'*://eulerbeats.com/*',
	],
	js: 'connectors/eulerbeats.js',
	id: 'eulerbeats',
}, {
	label: 'FilmMusic.io',
	matches: [
		'*://*.filmmusic.io/*',
	],
	js: 'connectors/filmmusic.io.js',
	id: 'filmmusic.io',
}, {
	label: 'X-Team Radio',
	matches: [
		'*://radio.x-team.com/*',
	],
	js: 'connectors/xteam-radio.js',
	id: 'xteam-radio',
}, {
	label: 'Calm',
	matches: [
		'*://*.calm.com/*',
	],
	js: 'connectors/calm.js',
	id: 'calm',
}, {
	label: 'Keakie',
	matches: [
		'*://*.keakie.com/*',
	],
	js: 'connectors/keakie.js',
	id: 'keakie',
}, {
	label: 'KKBOX',
	matches: [
		'*://*play.kkbox.com/*',
	],
	js: 'connectors/kkbox.js',
	id: 'kkbox',
}, {
	label: 'Thrill Jockey',
	matches: ['*://thrilljockey.com/products/*'],
	js: 'connectors/thrilljockey.js',
	id: 'thrilljockey',
}, {
	label: 'Radio Horizonte',
	matches: [
		'*://*horizonte.cl/*',
	],
	js: 'connectors/horizonte.cl.js',
	id: 'horizontecl',
}, {
	label: 'Rock&Pop Chile',
	matches: [
		'*://envivo.rockandpop.cl/*',
	],
	js: 'connectors/rockandpop.cl.js',
	id: 'rockandpopcl',
}, {
	label: 'WYEP',
	matches: [
		'*://wyep.org/*',
	],
	js: 'connectors/wyep.js',
	id: 'wyep',
}, {
	label: 'ZENO',
	matches: [
		'*://*zeno.fm/*',
	],
	js: 'connectors/zeno.js',
	id: 'zeno',
}, {
	label: 'Naxos Music Library',
	matches: [
		'*://*.naxosmusiclibrary.com/*',
	],
	js: 'connectors/naxosmusiclibrary.js',
	id: 'naxosmusiclibrary',
}, {
	label: 'Klassik Radio',
	matches: [
		'*://*klassikradio.de/*',
	],
	js: 'connectors/klassikradio.de.js',
	id: 'klassikradio',
}, {
	label: 'Beetle',
	js: 'connectors/beetle.js',
	id: 'beetle',
}, {
	label: 'RefNet',
	matches: ['*://listen.refnet.fm/*'],
	js: 'connectors/refnet.js',
	id: 'refnet',
}, {
	label: "La Radio du bord de l'eau",
	matches: [
		'*://*auborddeleau.radio/*',
	],
	js: 'connectors/auborddeleau.radio.js',
	id: 'auborddeleau.radio',
	allFrames: true,
}, {
	label: 'Radio Willy',
	matches: [
		'*://*willy.radio/player/willy/*',
	],
	js: 'connectors/willy.radio.js',
	id: 'willy.radio',
}, {
	label: 'NIGHT.FM',
	matches: [
		'*://*night.fm/*',
	],
	js: 'connectors/night.fm.js',
	id: 'night.fm',
}, {
	label: 'Radio Nowy Swiat',
	matches: [
		'*://nowyswiat.online/*',
	],
	js: 'connectors/nowyswiat.js',
	id: 'nowyswiat',
}, {
	label: 'Radiolla',
	matches: [
		'*://*radiolla.com/*',
	],
	js: 'connectors/radiolla.js',
	id: 'radiolla',
}, {
	label: 'Oxigenio.fm',
	matches: [
		'*://*oxigenio.fm/*',
	],
	js: 'connectors/oxigenio.fm.js',
	id: 'oxigenio.fm',
}, {
	label: 'Intergalactic FM',
	matches: ['*://*intergalactic.fm/*'],
	js: 'connectors/intergalacticfm.js',
	id: 'intergalactic.fm',
}, {
	label: 'Radio Cuca',
	matches: [
		'*://*radiocuca.es/*',
	],
	js: 'connectors/radiocuca.js',
	id: 'radiocuca',
}, {
	label: 'Irama Nusantara',
	matches: [
		'*://*.iramanusantara.org/*',
	],
	js: 'connectors/iramanusantara.js',
	id: 'iramanusantara',
}, {
	label: 'Yammat FM',
	matches: [
		'*://*yammat.fm/*',
	],
	js: 'connectors/yammat.fm.js',
	id: 'yammat.fm',
}, {
	label: 'Husk Recordings',
	matches: [
		'*://huskrecordings.com/music/*',
	],
	js: 'connectors/huskrecordings.js',
	id: 'huskrecordings',
}, {
	label: 'nugs.net',
	matches: [
		'*://play.nugs.net/*',
	],
	js: 'connectors/nugs.js',
	id: 'nugs',
}, {
	label: 'livephish.com',
	matches: [
		'*://plus.livephish.com/*',
	],
	js: 'connectors/livephish.js',
	id: 'livephish.com',
}, {
	label: 'Ishkur\'s Guide to Electronic Music',
	matches: [
		'*://music.ishkur.com/*',
	],
	js: 'connectors/ishkur.js',
	id: 'music.ishkur.com',
}, {
	label: 'Nonoki',
	matches: [
		'https://nonoki.com/music/*',
	],
	js: 'connectors/nonoki.js',
	id: 'nonoki',
}, {
	label: 'KCRW 89.9FM',
	matches: [
		'*://www.kcrw.com/*',
	],
	js: 'connectors/kcrw.js',
	id: 'kcrw',
}];

define(() => connectors);
