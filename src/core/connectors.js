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
	matches: ['*://www.youtube.com/*'],
	js: 'connectors/youtube.js',
	id: 'youtube',
}, {
	label: 'Zen Audio Player',
	matches: ['*://zenplayer.audio/*'],
	js: 'connectors/zenplayer.js',
	id: 'zenplayer',
}, {
	label: 'Google Play Music',
	matches: ['*://play.google.com/music/*'],
	js: 'connectors/google-play.js',
	id: 'google-play',
}, {
	label: 'MySpace',
	matches: ['*://myspace.com/*'],
	js: 'connectors/myspace.js',
	id: 'myspace',
}, {
	label: 'Pitchfork',
	matches: [
		'*://pitchfork.com/*',
		'*://www.pitchfork.com/*'
	],
	js: 'connectors/pitchfork.js',
	id: 'pitchfork',
}, {
	label: 'Bandcamp Daily',
	matches: ['*://daily.bandcamp.com/*'],
	js: 'connectors/bandcamp-embed.js',
	id: 'bandcamp-embed',
	allFrames: true,
}, {
	label: 'Bandcamp',
	matches: [
		'*://*.bandcamp.com/*',
		'*://bandcamp.com/*'
	],
	js: 'connectors/bandcamp.js',
	id: 'bandcamp',
}, {
	label: 'Pandora',
	matches: ['*://www.pandora.com/*'],
	js: 'connectors/pandora.js',
	id: 'pandora',
}, {
	label: 'Pakartot',
	matches: ['*://www.pakartot.lt/*'],
	js: 'connectors/pakartot.js',
	id: 'pakartot',
}, {
	label: 'Deezer',
	matches: ['*://www.deezer.com/*'],
	js: 'connectors/deezer.js',
	id: 'deezer',
}, {
	label: 'SoundCloud',
	matches: ['*://soundcloud.com/*'],
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
	matches: ['*://alexa.amazon.*/spa/*'],
	js: 'connectors/amazon-alexa.js',
	id: 'amazon-alexa',
}, {
	label: 'VK',
	matches: ['*://vk.com/*'],
	js: 'connectors/vk.js',
	id: 'vk',
}, {
	label: 'Megalyrics',
	matches: ['*://megalyrics.ru/*'],
	js: 'connectors/megalyrics.js',
	id: 'megalyrics',
}, {
	label: 'Indie Shuffle',
	matches: ['*://www.indieshuffle.com/*'],
	js: 'connectors/indieshuffle.js',
	id: 'indieshuffle',
}, {
	label: 'Tuba.FM',
	matches: ['*://fm.tuba.pl/*'],
	js: 'connectors/tubafm.js',
	id: 'tubafm',
}, {
	label: 'Spotify',
	matches: ['*://open.spotify.com/*'],
	js: 'connectors/spotify.js',
	id: 'spotify',
}, {
	label: 'plug.dj',
	matches: ['*://plug.dj/*'],
	js: 'connectors/plug.dj.js',
	id: 'plug.dj',
}, {
	label: 'Slacker',
	matches: ['*://www.slacker.com/*'],
	js: 'connectors/slacker.js',
	id: 'slacker',
}, {
	label: 'Dandelion Radio',
	matches: ['*://www.dandelionradio.com/player.htm'],
	js: 'connectors/dandelionradio.js',
	id: 'dandelionradio',
}, {
	label: 'HillyDilly',
	matches: ['*://www.hillydilly.com/*'],
	js: 'connectors/hillydilly.js',
	id: 'hillydilly',
}, {
	label: 'Groove Music',
	matches: ['*://music.microsoft.com/*'],
	js: 'connectors/groovemusic.js',
	id: 'groovemusic',
}, {
	label: '8tracks',
	matches: ['*://8tracks.com/*'],
	js: 'connectors/8tracks.js',
	id: '8tracks',
}, {
	label: 'Moje Polskie Radio',
	matches: ['*://moje.polskieradio.pl/station/*'],
	js: 'connectors/polskieradio.js',
	id: 'polskieradio',
}, {
	label: 'Radio Nova',
	matches: ['*://www.nova.fr/*'],
	js: 'connectors/nova.js',
	id: 'nova',
}, {
	label: 'Radioplus',
	matches: [
		'*://www.radioplus.be/*',
		'*://radioplus.be/*'
	],
	js: 'connectors/radioplus.js',
	id: 'radioplus',
}, {
	label: 'Douban.FM',
	matches: ['*://douban.fm/*'],
	js: 'connectors/douban.fm.js',
	id: 'douban.fm',
}, {
	label: 'Focus@Will',
	matches: ['*://www.focusatwill.com/*'],
	js: 'connectors/focusatwill.js',
	id: 'focusatwill',
}, {
	label: 'Subphonic (owncloud plugin)',
	matches: ['*://*/*/apps/subphonic/minisub/*'],
	js: 'connectors/subphonic.js',
	id: 'subphonic',
}, {
	label: 'Digitally Imported',
	matches: ['*://www.di.fm/*'],
	js: 'connectors/di.js',
	id: 'di',
}, {
	label: 'BBC RadioPlayer',
	matches: ['*://www.bbc.co.uk/radio/player/*'],
	js: 'connectors/bbc-radio.js',
	id: 'bbc-radio',
}, {
	label: 'BBC Sounds',
	matches: ['*://www.bbc.co.uk/sounds/play/*'],
	js: 'connectors/bbc-sounds.js',
	id: 'bbc-sounds',
}, {
	label: 'Gaana',
	matches: ['*://gaana.com/*'],
	js: 'connectors/gaana.js',
	id: 'gaana',
}, {
	label: 'Яндекс.Музыка',
	matches: [
		'*://music.yandex.ru/*',
		'*://music.yandex.by/*',
		'*://music.yandex.kz/*',
		'*://music.yandex.ua/*'
	],
	js: 'connectors/yandex-music.js',
	id: 'yandex-music',
}, {
	label: 'Plex',
	matches: [
		'*://*32400/web/*',
		'*://plex.tv/web/*',
		'*://*.plex.tv/web/*',
		'*://*.plex.tv/desktop*'
	],
	js: 'connectors/plex.js',
	id: 'plex',
}, {
	label: 'Perisonic',
	matches: ['*://robinbakker.nl/perisonic/*'],
	js: 'connectors/perisonic.js',
	id: 'perisonic',
}, {
	label: 'TuneIn',
	matches: ['*://tunein.com/*'],
	js: 'connectors/tunein.js',
	id: 'tunein',
}, {
	label: 'MixCloud',
	matches: [
		'*://mixcloud.com/*',
		'*://*.mixcloud.com/*'
	],
	js: 'connectors/mixcloud.js',
	id: 'mixcloud',
}, {
	label: 'ReverbNation',
	matches: ['*://www.reverbnation.com/*'],
	js: 'connectors/reverbnation.js',
	id: 'reverbnation',
}, {
	label: 'Xiami',
	matches: ['*://*.xiami.com/*'],
	js: 'connectors/xiami.js',
	id: 'xiami',
}, {
	label: 'NRK Radio',
	matches: ['*://radio.nrk.no/*'],
	js: 'connectors/nrk-radio.js',
	id: 'nrk-radio',
}, {
	label: 'Internet Archive',
	matches: ['*://archive.org/details/*'],
	js: 'connectors/archive.js',
	id: 'archive',
}, {
	label: 'Odnoklassniki',
	matches: [
		'*://odnoklassniki.ru/*',
		'*://ok.ru/*',
		'*://www.ok.ru/*'
	],
	js: 'connectors/odnoklassniki.js',
	id: 'odnoklassniki',
}, {
	label: '163 Music',
	matches: ['*://music.163.com/*'],
	js: 'connectors/163-music.js',
	id: '163-music',
}, {
	label: 'luooMusic',
	matches: ['*://www.luoo.net/*'],
	js: 'connectors/luoo.js',
	id: 'luoo',
}, {
	label: 'Ambient Sleeping Pill',
	matches: ['*://ambientsleepingpill.com/'],
	js: 'connectors/ambientsleepingpill.js',
	id: 'ambientsleepingpill',
}, {
	label: 'a.m. ambient',
	matches: ['*://amambient.com/'],
	js: 'connectors/ambientsleepingpill.js',
	id: 'amambient',
}, {
	label: 'Tidal',
	matches: [
		'*://listen.tidalhifi.com/*',
		'*://listen.tidal.com/*'
	],
	js: 'connectors/tidal.js',
	id: 'tidal',
}, {
	label: 'Hype Machine Premieres',
	matches: ['*://hypem.com/premiere/*'],
	js: 'connectors/hypem-premieres.js',
	id: 'hypem-premieres',
}, {
	label: 'Hype Machine',
	matches: ['*://hypem.com/*'],
	js: 'connectors/hypem.js',
	id: 'hypem',
}, {
	label: 'Radionomy',
	matches: ['*://www.radionomy.com/*'],
	js: 'connectors/radionomy.js',
	id: 'radionomy',
}, {
	label: 'JazzAndRain',
	matches: ['*://www.jazzandrain.com/*'],
	js: 'connectors/jazzandrain.js',
	id: 'jazzandrain',
}, {
	label: 'RelaxingBeats',
	matches: ['*://relaxingbeats.com/*'],
	js: 'connectors/jazzandrain.js',
	id: 'relaxingbeats',
}, {
	label: 'EpicMusicTime',
	matches: ['*://epicmusictime.com/*'],
	js: 'connectors/jazzandrain.js',
	id: 'epicmusictime',
}, {
	label: 'AccuJazz',
	matches: ['*://www.accuradio.com/pop_player/accujazz/*'],
	js: 'connectors/accujazz.js',
	id: 'accujazz',
}, {
	label: 'AccuRadio',
	matches: ['*://www.accuradio.com/*'],
	js: 'connectors/accuradio.js',
	id: 'accuradio',
}, {
	label: 'RAW.FM',
	matches: [
		'*://www.rawfm.com.au/stream/player*/',
		'*://rawfm.com.au/stream/player*/'
	],
	js: 'connectors/rawfm.js',
	id: 'rawfm',
}, {
	label: 'Imusic.am',
	matches: ['*://imusic.am/*'],
	js: 'connectors/imusic.am.js',
	id: 'imusic.am',
}, {
	label: 'Earbits',
	matches: ['*://www.earbits.com/*'],
	js: 'connectors/earbits.js',
	id: 'earbits',
}, {
	label: 'Player.fm',
	matches: ['*://player.fm/*'],
	js: 'connectors/player.fm.js',
	id: 'player.fm',
}, {
	label: 'SNDTST',
	matches: [
		'*://www.sndtst.com/*',
		'*://sndtst.com/*'
	],
	js: 'connectors/sndtst.js',
	id: 'sndtst',
}, {
	label: 'RadioTunes',
	matches: ['*://www.radiotunes.com/*'],
	js: 'connectors/radiotunes.js',
	id: 'radiotunes',
}, {
	label: 'RockRadio',
	matches: ['*://www.rockradio.com/*'],
	js: 'connectors/radiotunes.js',
	id: 'rockradio',
}, {
	label: 'ClassicalRadio',
	matches: ['*://www.classicalradio.com/*'],
	js: 'connectors/radiotunes.js',
	id: 'classicalradio',
}, {
	label: 'Radio.com',
	matches: ['*://www.radio.com/*'],
	js: 'connectors/radio.com.js',
	id: 'radio.com',
}, {
	label: 'GetWorkDoneMusic',
	matches: [
		'*://www.getworkdonemusic.com/*',
		'*://getworkdonemusic.com/*'
	],
	js: 'connectors/getworkdonemusic.js',
	id: 'getworkdonemusic',
}, {
	label: 'Jamendo',
	matches: ['*://www.jamendo.com/*'],
	js: 'connectors/jamendo.js',
	id: 'jamendo',
}, {
	label: 'Whyd',
	matches: ['*://whyd.com/*'],
	js: 'connectors/whyd.js',
	id: 'whyd',
}, {
	label: 'Bandzone.cz',
	matches: ['*://bandzone.cz/*'],
	js: 'connectors/bandzone.cz.js',
	id: 'bandzone.cz',
}, {
	label: 'Music Player for Google Drive',
	matches: ['*://www.driveplayer.com/*'],
	js: 'connectors/driveplayer.js',
	id: 'driveplayer',
}, {
	label: 'Kodi',
	js: 'connectors/kodi.js',
	id: 'kodi',
}, {
	label: 'Superplayer',
	matches: ['*://www.superplayer.fm/*'],
	js: 'connectors/superplayer.js',
	id: 'superplayer',
}, {
	label: 'RMFON',
	matches: [
		'*://www.rmfon.pl/*',
		'*://rmfon.pl/*'
	],
	js: 'connectors/rmfon.js',
	id: 'rmfon',
}, {
	label: 'RADIO Обозреватель',
	matches: ['*://radio.obozrevatel.com/*'],
	js: 'connectors/obozrevatel.js',
	id: 'obozrevatel',
}, {
	label: 'JazzRadio',
	matches: ['*://www.jazzradio.com/*'],
	js: 'connectors/radiotunes.js',
	id: 'jazzradio',
}, {
	label: 'SomaFM',
	matches: ['*://somafm.com/player/*'],
	js: 'connectors/somafm.js',
	id: 'somafm',
}, {
	label: 'Noisetrade',
	matches: [
		'*://www.noisetrade.com/*',
		'*://noisetrade.com/*'
	],
	js: 'connectors/noisetrade.js',
	id: 'noisetrade',
}, {
	label: 'Free Music Archive',
	matches: [
		'*://www.freemusicarchive.org/*',
		'*://freemusicarchive.org/*',
		'*://www.freemusicarchive.com/*',
		'*://freemusicarchive.com/*'
	],
	js: 'connectors/freemusicarchive.js',
	id: 'freemusicarchive',
}, {
	label: 'Reddit Music Player',
	matches: ['*://reddit.musicplayer.io/'],
	js: 'connectors/redditmusicplayer.js',
	id: 'redditmusicplayer',
}, {
	label: 'KOLLEKT.FM',
	matches: [
		'*://kollekt.fm/*',
		'*://*.kollekt.fm/*'
	],
	js: 'connectors/kollekt.fm.js',
	id: 'kollekt.fm',
}, {
	label: 'Новое Радио',
	matches: ['*://www.novoeradio.by/*'],
	js: 'connectors/novoeradio.js',
	id: 'novoeradio',
}, {
	label: 'Яндекс.Радио',
	matches: [
		'*://radio.yandex.ru/*',
		'*://radio.yandex.by/*',
		'*://radio.yandex.kz/*',
		'*://radio.yandex.ua/*'
	],
	js: 'connectors/yandex-music.js',
	id: 'yandex-radio',
}, {
	label: 'egoFM',
	matches: [
		'*://www.egofm.de/*',
		'*://player.addradio.de/player/2366*'
	],
	js: 'connectors/egofm.js',
	id: 'egofm',
}, {
	label: 'Radio Paradise',
	matches: ['*://radioparadise.com/*'],
	js: 'connectors/radioparadise.js',
	id: 'radioparadise',
	allFrames: true,
}, {
	label: 'Beatport',
	matches: ['*://www.beatport.com/*'],
	js: 'connectors/beatport.js',
	id: 'beatport',
}, {
	label: 'The Music Ninja',
	matches: ['*://www.themusicninja.com/*'],
	js: 'connectors/themusicninja.js',
	id: 'themusicninja',
}, {
	label: 'wavo',
	matches: ['*://wavo.me/*'],
	js: 'connectors/wavo.js',
	id: 'wavo',
}, {
	label: 'Dubtrack.fm',
	matches: ['*://www.dubtrack.fm/*'],
	js: 'connectors/dubtrack.fm.js',
	id: 'dubtrack.fm',
}, {
	label: 'FluxFM Berlin',
	matches: ['*://www.fluxfm.de/stream/*'],
	js: 'connectors/fluxfm.js',
	id: 'fluxfm',
}, {
	label: 'Noise FM',
	matches: [
		'*://noisefm.ru/*',
		'*://en.noisefm.ru/*'
	],
	js: 'connectors/noisefm.js',
	id: 'noisefm',
	allFrames: true,
}, {
	label: 'WWOZ',
	matches: ['*://www.wwoz.org/listen/player/*'],
	js: 'connectors/wwoz.js',
	id: 'wwoz',
}, {
	label: 'Sonerezh',
	matches: [
		'*://sonerezh.*/*',
		'*://*/*sonerezh*'
	],
	js: 'connectors/sonerezh.js',
	id: 'sonerezh',
}, {
	label: 'Evropa 2',
	matches: ['*://onair.evropa2.cz/*'],
	js: 'connectors/evropa2.js',
	id: 'evropa2',
}, {
	label: 'Frekvence 1',
	matches: ['*://vysilani.frekvence1.cz/*'],
	js: 'connectors/frekvence1.js',
	id: 'frekvence1',
}, {
	label: 'Youradio',
	matches: ['*://*youradio.cz/*'],
	js: 'connectors/youradio.js',
	id: 'youradio',
}, {
	label: 'Dance radio',
	matches: ['*://www.danceradio.cz/*'],
	js: 'connectors/danceradio.js',
	id: 'danceradio',
}, {
	label: 'Rádio Bonton',
	matches: ['*://www.radiobonton.cz/*'],
	js: 'connectors/radiobonton.js',
	id: 'radiobonton',
}, {
	label: 'GPMusic',
	matches: ['*://player.gpmusic.co/*'],
	js: 'connectors/gpmusic.js',
	id: 'gpmusic',
}, {
	label: 'Youtube Jukebox',
	matches: ['*://youtube.nestharion.de/*'],
	js: 'connectors/yt-jukebox.js',
	id: 'yt-jukebox',
}, {
	label: 'Nightwave Plaza',
	matches: ['*://plaza.one/*'],
	js: 'connectors/plaza.js',
	id: 'plaza',
}, {
	label: 'Retrowave',
	matches: ['*://retrowave.ru/*'],
	js: 'connectors/retrowave.js',
	id: 'retrowave',
}, {
	label: 'Genie',
	matches: ['*://www.genie.co.kr/player/fPlayer*'],
	js: 'connectors/genie.js',
	id: 'genie',
}, {
	label: 'Bugs',
	matches: ['*://music.bugs.co.kr/newPlayer*'],
	js: 'connectors/bugs.js',
	id: 'bugs',
}, {
	label: 'openfm',
	matches: ['*://open.fm/*'],
	js: 'connectors/openfm.js',
	id: 'openfm',
}, {
	label: 'monkey3',
	matches: ['*://www.monkey3.co.kr/*'],
	js: 'connectors/monkey3.js',
	id: 'monkey3',
}, {
	label: 'Playmoss',
	matches: ['*://playmoss.com/*'],
	js: 'connectors/playmoss.js',
	id: 'playmoss',
}, {
	label: 'Apidog',
	matches: ['*://apidog.ru/*'],
	js: 'connectors/apidog.js',
	id: 'apidog',
}, {
	label: 'RBMA Radio',
	matches: ['*://www.redbullradio.com/*'],
	js: 'connectors/redbullradio.js',
	id: 'redbullradio',
}, {
	label: 'Pinguin Radio',
	matches: ['*://pinguinradio.com/*'],
	js: 'connectors/pinguinradio.js',
	id: 'pinguinradio',
}, {
	label: 'Vevo',
	matches: ['*://www.vevo.com/*'],
	js: 'connectors/vevo.js',
	id: 'vevo',
}, {
	label: 'JioSaavn',
	matches: ['*://www.jiosaavn.com/*'],
	js: 'connectors/jiosaavn.js',
	id: 'jiosaavn',
}, {
	label: 'Anghami',
	matches: [
		'*://www.anghami.com/*',
		'*://play.anghami.com/*'
	],
	js: 'connectors/anghami.js',
	id: 'anghami',
}, {
	label: 'Mail.ru Music',
	matches: [
		'*://my.mail.ru/music',
		'*://my.mail.ru/music/*'
	],
	js: 'connectors/mail.ru.js',
	id: 'mail.ru',
}, {
	label: 'Emby',
	matches: [
		'*://*8096/web/*',
		'*://*8920/web/*',
		'*://app.emby.media/*'
	],
	js: 'connectors/emby.js',
	id: 'emby',
}, {
	label: 'Freegal',
	matches: ['*://*.freegalmusic.com/*'],
	js: 'connectors/freegalmusic.js',
	id: 'freegalmusic',
}, {
	label: 'Monstercat',
	matches: ['*://www.monstercat.com/*'],
	js: 'connectors/monstercat.js',
	id: 'monstercat',
}, {
	label: 'Randomtube',
	matches: ['*://youtube-playlist-randomizer.valami.info/*'],
	js: 'connectors/randomtube.js',
	id: 'randomtube',
}, {
	label: 'Listen.moe',
	matches: ['*://listen.moe/*'],
	js: 'connectors/listen.moe.js',
	id: 'listen.moe',
}, {
	label: 'Fair Price Music',
	matches: ['*://www.fairpricemusic.com/*'],
	js: 'connectors/fairpricemusic.js',
	id: 'fairpricemusic',
}, {
	label: 'My Cloud Player',
	matches: ['*://mycloudplayers.com/*'],
	js: 'connectors/mycloudplayer.js',
	id: 'mycloudplayer',
}, {
	label: 'Radio ULTRA',
	matches: ['*://player.radioultra.ru/*'],
	js: 'connectors/radioultra.js',
	id: 'radioultra',
}, {
	label: 'Наше Радио',
	matches: ['*://player.nashe.ru/*'],
	js: 'connectors/radioultra.js',
	id: 'nashe',
}, {
	label: 'RockFM',
	matches: ['*://player.rockfm.ru/*'],
	js: 'connectors/radioultra.js',
	id: 'rockfm',
}, {
	label: 'Radio JAZZ',
	matches: ['*://player.radiojazzfm.ru/*'],
	js: 'connectors/radioultra.js',
	id: 'radiojazzfm',
}, {
	label: 'Jazz24',
	matches: [
		'*://www.jazz24.org/',
		'*://v6.player.abacast.net/854'
	],
	js: 'connectors/jazz24.js',
	id: 'jazz24',
}, {
	label: 'Planet Radio',
	matches: ['*://planetradio.co.uk/*/player/*'],
	js: 'connectors/planetradio.js',
	id: 'planetradio',
}, {
	label: 'Roxx Radio',
	matches: ['*://roxx.gr/radio/*'],
	js: 'connectors/roxx.js',
	id: 'roxx',
}, {
	label: 'ListenOnRepeat',
	matches: ['*://listenonrepeat.com/*'],
	js: 'connectors/listenonrepeat.js',
	id: 'listenonrepeat',
}, {
	label: 'Duckburg Radio',
	matches: ['*://*.radio-mb.com/*'],
	js: 'connectors/radio-mb.js',
	id: 'radio-mb',
}, {
	label: 'RadioPlayer',
	matches: [
		'*://www.heart.co.uk/*',
		'*://player.absoluteradio.co.uk/*',
		'*://www.thebreeze.com/*radioplayer/*',
		'*://ukradioplayer.*',
		'*://radioplayer.*',
		'*://www.2br.co.uk/*',
		'*://*/radioplayer/*',
		'*://*/radioplayer/',
		'*://*/radio/player/',
		'*://*/*/radio/player/',
	],
	js: 'connectors/radioplayer.js',
	id: 'radioplayer',
}, {
	label: 'deltaradio',
	matches: ['*://www.deltaradio.de/*'],
	js: 'connectors/deltaradio.de.js',
	id: 'deltaradio.de',
}, {
	label: 'ByteFM',
	matches: ['*://www.byte.fm/*'],
	js: 'connectors/byte.fm.js',
	id: 'byte.fm',
}, {
	label: 'Deutschlandfunk Nova',
	matches: ['*://www.deutschlandfunknova.de/*'],
	js: 'connectors/deutschlandfunknova.js',
	id: 'deutschlandfunknova',
}, {
	label: 'QQ Music',
	matches: ['*://y.qq.com/portal/*'],
	js: 'connectors/qq-music.js',
	id: 'qq-music',
}, {
	label: 'QQ Video',
	matches: ['*://v.qq.com/x/*'],
	js: 'connectors/qq-video.js',
	id: 'qq-video',
}, {
	label: 'Youtubify',
	matches: [
		'*://youtubify.vebto.com/*',
		'*://bemusic.vebto.com/*'
	],
	js: 'connectors/bemusic.js',
	id: 'youtubify',
}, {
	label: 'Naver',
	matches: ['*://playerui.music.naver.com/*'],
	js: 'connectors/naver.js',
	id: 'naver',
}, {
	label: 'olleh',
	matches: ['*://www.ollehmusic.com/*'],
	js: 'connectors/olleh.js',
	id: 'olleh',
}, {
	label: 'mnet',
	matches: ['*://www.mnet.com/*'],
	js: 'connectors/mnet.js',
	id: 'mnet',
}, {
	label: 'Soribada',
	matches: ['*://www.soribada.com/*'],
	js: 'connectors/soribada.js',
	id: 'soribada',
}, {
	label: 'GrooveMP3',
	matches: [
		'*://groovemp3.com/*',
		'*://www.groovemp3.com/*'
	],
	js: 'connectors/bemusic.js',
	id: 'groovemp3',
}, {
	label: 'ytmp3',
	matches: [
		'*://ytmp3.fun/*',
		'*://www.ytmp3.fun/*'
	],
	js: 'connectors/bemusic.js',
	id: 'ytmp3',
}, {
	label: 'Discogs',
	matches: ['*://www.discogs.com/*'],
	js: 'connectors/youtube-embed.js',
	id: 'youtube-embed',
	allFrames: true,
}, {
	label: 'Kuwo Music',
	matches: [
		'*://kuwo.cn/*',
		'*://www.kuwo.cn/*',
		'*://m.kuwo.cn/*'
	],
	js: 'connectors/kuwo.js',
	id: 'kuwo',
}, {
	label: 'NPR',
	matches: ['*://www.npr.org/*'],
	js: 'connectors/npr.js',
	id: 'npr',
}, {
	label: 'Streamsquid',
	matches: ['*://streamsquid.com/*'],
	js: 'connectors/streamsquid.js',
	id: 'streamsquid',
}, {
	label: 'eMusic',
	matches: ['*://www.emusic.com/*'],
	js: 'connectors/emusic.js',
	id: 'emusic',
}, {
	label: 'LyricsTraining',
	matches: ['*://lyricstraining.com/*'],
	js: 'connectors/lyricstraining.js',
	id: 'lyricstraining',
}, {
	label: 'Music Walker',
	matches: ['*://arkanath.com/MusicWalker/*'],
	js: 'connectors/musicwalker.js',
	id: 'musicwalker',
}, {
	label: 'radioeins',
	matches: ['*://www.radioeins.de/livestream/*'],
	js: 'connectors/radioeins.js',
	id: 'radioeins',
}, {
	label: 'Fritz',
	matches: ['*://www.fritz.de/livestream/*'],
	js: 'connectors/fritz.js',
	id: 'fritz',
}, {
	label: 'Musicoin',
	matches: ['*://musicoin.org/*'],
	js: 'connectors/musicoin.js',
	id: 'musicoin',
}, {
	label: '181.fm',
	matches: ['*://player.181fm.com/*'],
	js: 'connectors/181.fm.js',
	id: '181.fm',
}, {
	label: 'Phish.in',
	matches: ['*://phish.in/*'],
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
	matches: ['*://www.retro-synthwave.com/*'],
	js: 'connectors/retro-synthwave.js',
	id: 'retro-synthwave',
}, {
	label: 'Радиоволна.нет',
	matches: ['*://radiovolna.net/*'],
	js: 'connectors/radiovolna.js',
	id: 'radiovolna',
}, {
	label: 'Feedbands',
	matches: ['*://feedbands.com/*'],
	js: 'connectors/feedbands.js',
	id: 'feedbands',
}, {
	label: 'Vimeo',
	matches: ['*://vimeo.com/*'],
	js: 'connectors/vimeo.js',
	id: 'vimeo',
}, {
	label: 'Taazi',
	matches: ['*://taazi.com/*'],
	js: 'connectors/taazi.js',
	id: 'taazi',
}, {
	label: 'Patari',
	matches: ['*://patari.pk/*'],
	js: 'connectors/patari.js',
	id: 'patari',
}, {
	label: 'pCloud',
	matches: ['*://my.pcloud.com/*'],
	js: 'connectors/pcloud.js',
	id: 'pcloud',
}, {
	label: 'JetSetRadio Live',
	matches: [
		'*://jetsetradio.live/*',
		'*://jetsetradio.live'
	],
	js: 'connectors/jetsetradio.live.js',
	id: 'jetsetradio.live',
}, {
	label: 'FIP',
	matches: ['*://www.fip.fr/*'],
	js: 'connectors/fip.js',
	id: 'fip',
}, {
	label: 'RemixRotation',
	matches: ['*://remixrotation.com/*'],
	js: 'connectors/remixrotation.js',
	id: 'remixrotation',
}, {
	label: 'WFMU',
	matches: [
		'*://wfmu.org/audioplayer/*',
		'*://wfmu.org/archiveplayer/*'
	],
	js: 'connectors/wfmu.js',
	id: 'wfmu',
}, {
	label: 'SiriusXM',
	matches: ['*://player.siriusxm.com/*'],
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
		'*://h5.1ting.com/*'
	],
	js: 'connectors/1ting.js',
	id: '1ting',
}, {
	label: 'Douban Artists',
	matches: ['*://music.douban.com/artists/player/*'],
	js: 'connectors/douban-artists.js',
	id: 'douban-artists',
}, {
	label: 'Kugou',
	matches: ['*://www.kugou.com/song/*'],
	js: 'connectors/kugou.js',
	id: 'kugou',
}, {
	label: 'ccMixter',
	matches: [
		'*://ccmixter.org/*',
		'*://*.ccmixter.org/*',
		'*://tunetrack.net/*'
	],
	js: 'connectors/ccmixter.js',
	id: 'ccmixter',
}, {
	label: 'Gimme Radio',
	matches: [
		'*://gimmeradio.com/*',
		'*://www.gimmeradio.com/*'
	],
	js: 'connectors/gimmeradio.js',
	id: 'gimmeradio',
}, {
	label: '9sky',
	matches: [
		'*://www.9sky.com/music*',
		'*://www.9sky.com/mv/detail*'
	],
	js: 'connectors/9sky.js',
	id: '9sky',
}, {
	label: 'Vagalume.FM',
	matches: [
		'*://vagalume.fm/*',
		'*://*.vagalume.com.br/*'
	],
	js: 'connectors/vagalume.js',
	id: 'vagalume',
}, {
	label: 'Radiooooo',
	matches: [
		'*://radiooooo.com/*',
		'*://mobile.radiooooo.com/*'
	],
	js: 'connectors/radiooooo.js',
	id: 'radiooooo',
}, {
	label: 'LetsLoop',
	matches: ['*://letsloop.com/*'],
	js: 'connectors/letsloop.js',
	id: 'letsloop',
}, {
	label: 'Mideast Tunes',
	matches: [
		'*://mideastunes.com/*',
		'*://map.mideastunes.com/*'
	],
	js: 'connectors/mideastunes.js',
	id: 'mideastunes',
}, {
	label: 'Český Rozhlas',
	matches: ['*://prehravac.rozhlas.cz/*'],
	js: 'connectors/rozhlas.js',
	id: 'rozhlas',
}, {
	label: 'Sound Session',
	matches: [
		'*://*soundsession.com/',
		'*://soundsession.center/station/*'
	],
	js: 'connectors/soundsession.js',
	id: 'soundsession',
}, {
	label: 'blocSonic',
	matches: [
		'*://blocsonic.com/*',
		'*://www.blocsonic.com/*'
	],
	js: 'connectors/blocsonic.js',
	id: 'blocsonic',
}, {
	label: 'Resonate.is',
	matches: [
		'*://resonate.is/*',
		'*://*.resonate.is/*'
	],
	js: 'connectors/resonate.js',
	id: 'resonate',
}, {
	label: 'KEXP Radio',
	matches: [
		'*://kexp.org/*',
		'*://www.kexp.org/*'
	],
	js: 'connectors/kexp.js',
	id: 'kexp',
}, {
	label: 'Hotmixradio.fr',
	matches: [
		'*://hotmixradio.fr/*',
		'*://www.hotmixradio.fr/*'
	],
	js: 'connectors/hotmixradio.js',
	id: 'hotmixradio',
}, {
	label: 'Aphex Twin',
	matches: ['*://aphextwin.warp.net/*'],
	js: 'connectors/warp-aphextwin.js',
	id: 'warp-aphextwin',
}, {
	label: 'Resident Advisor',
	matches: ['*://www.residentadvisor.net/*'],
	js: 'connectors/residentadvisor.js',
	id: 'residentadvisor',
}, {
	label: 'Zachary Seguin Music',
	matches: ['*://music.zacharyseguin.ca/*'],
	js: 'connectors/musickit.js',
	id: 'zacharyseguin',
}, {
	label: 'Joox',
	matches: ['*://www.joox.com/*'],
	js: 'connectors/joox.js',
	id: 'joox',
}, {
	label: 'PlayAppleMusic.com',
	matches: ['*://playapplemusic.com/*'],
	js: 'connectors/musickit.js',
	id: 'playapplemusic',
}, {
	label: 'Musish',
	matches: ['*://musi.sh/*'],
	js: 'connectors/musickit.js',
	id: 'musish',
}, {
	label: '1001tracklists',
	matches: ['*://www.1001tracklists.com/tracklist/*'],
	js: 'connectors/1001tracklists.js',
	id: '1001tracklists',
}, {
	label: 'YouTube Music',
	matches: ['*://music.youtube.com/*'],
	js: 'connectors/youtube-music.js',
	id: 'youtube-music',
}, {
	label: 'Radiozenders.FM',
	matches: [
		'*://radiozenders.fm/*',
		'*://www.radiozenders.fm/*'
	],
	js: 'connectors/radiozenders.js',
	id: 'radiozenders',
}, {
	label: 'Invidious',
	matches: ['*://invidio.us/*'],
	js: 'connectors/invidious.js',
	id: 'invidious',
}, {
	label: 'That Station',
	matches: ['*://www.thatstation.net/listen-live/'],
	js: 'connectors/thatstation.js',
	id: 'thatstation',
}, {
	label: 'Pretzel',
	matches: ['*://*.pretzel.rocks/*'],
	js: 'connectors/pretzel.js',
	id: 'pretzel',
}, {
	label: 'Radio Kyivstar',
	matches: ['*://radio.kyivstar.ua/*'],
	js: 'connectors/kyivstar.js',
	id: 'kyivstar',
}, {
	label: 'Funkwhale',
	matches: [''],
	js: 'connectors/funkwhale.js',
	id: 'funkwhale',
}, {
	label: '9128 live',
	matches: ['*://9128.live/*'],
	js: 'connectors/radioco.js',
	id: '9128.live',
	allFrames: true,
}, {
	label: 'Radio.co',
	matches: ['*://embed.radio.co/player/*'],
	js: 'connectors/radioco.js',
	id: 'radioco',
}, {
	label: 'R-a-dio',
	matches: ['*://r-a-d.io/*'],
	js: 'connectors/r-a-d.io.js',
	id: 'r-a-d.io',
}, {
	label: 'Apple Music',
	matches: ['*://beta.music.apple.com/*'],
	js: 'connectors/apple-music.js',
	id: 'apple-music',
}, {
	label: 'Primephonic',
	matches: ['*://play.primephonic.com/*'],
	js: 'connectors/primephonic.js',
	id: 'primephonic',
}, {
	label: 'Watch2Gether',
	matches: ['*://www.watch2gether.com/*'],
	js: 'connectors/watch2gether.js',
	id: 'watch2gether',
}, {
	label: 'Poolside FM',
	matches: ['*://poolside.fm/*'],
	js: 'connectors/poolside.js',
	id: 'poolside',
}, {
	label: 'GDS.FM',
	matches: ['*://play.gds.fm/*'],
	js: 'connectors/gds-play.fm.js',
	id: 'gds-play',
}, {
	label: 'Wynk Music',
	matches: ['*://wynk.in/music*'],
	js: 'connectors/wynk.js',
	id: 'wynk',
}, {
	label: 'RadioJavan',
	matches: ['*://www.radiojavan.com/*'],
	js: 'connectors/radiojavan.js',
	id: 'radiojavan',
}, {
	label: 'Audiomack',
	matches: ['*://audiomack.com/*'],
	js: 'connectors/audiomack.js',
	id: 'audiomack',
}, {
	label: 'Global Player',
	matches: ['*://www.globalplayer.com/*'],
	js: 'connectors/globalplayer.js',
	id: 'globalplayer',
}, {
	label: 'The Current',
	matches: ['*://www.thecurrent.org/*'],
	js: 'connectors/thecurrent.js',
	id: 'thecurrent',
}, {
	label: 'pan y rosas discos',
	matches: ['*://www.panyrosasdiscos.net/*'],
	js: 'connectors/panyrosasdiscos.js',
	id: 'panyrosasdiscos',
}, {
	label: 'GRRIF',
	matches: [
		'*://grrif.ch/*',
		'*://www.grrif.ch/*'
	],
	js: 'connectors/grrif.js',
	id: 'grrif',
}, {
	label: 'newgrounds',
	matches: ['*://www.newgrounds.com/audio*'],
	js: 'connectors/newgrounds.js',
	id: 'newgrounds',
}];

define(() => connectors);
