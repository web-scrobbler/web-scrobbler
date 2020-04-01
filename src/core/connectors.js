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
	id: '1001tracklists',
	js: 'connectors/1001tracklists.js',
	label: '1001tracklists',
	matches: [
		'*://www.1001tracklists.com/tracklist/*',
	],
}, {
	id: '163-music',
	js: 'connectors/163-music.js',
	label: '163 Music',
	matches: [
		'*://music.163.com/*',
	],
}, {
	id: '181.fm',
	js: 'connectors/181.fm.js',
	label: '181.fm',
	matches: [
		'*://player.181fm.com/*',
	],
}, {
	id: '1ting',
	js: 'connectors/1ting.js',
	label: '1ting',
	matches: [
		'*://www.1ting.com/player/*',
		'*://www.1ting.com/p_*',
		'*://www.1ting.com/album*',
		'*://www.1ting.com/rand.php*',
		'*://www.1ting.com/day/*',
		'*://h5.1ting.com/*',
	],
}, {
	id: '8tracks',
	js: 'connectors/8tracks.js',
	label: '8tracks',
	matches: [
		'*://8tracks.com/*',
	],
}, {
	id: '9128.live',
	js: 'connectors/radioco.js',
	label: '9128 live',
	matches: [
		'*://9128.live/*',
	],
	allFrames: 'true',
}, {
	id: '9sky',
	js: 'connectors/9sky.js',
	label: '9sky',
	matches: [
		'*://www.9sky.com/music*',
		'*://www.9sky.com/mv/detail*',
	],
}, {
	id: 'accujazz',
	js: 'connectors/accujazz.js',
	label: 'AccuJazz',
	matches: [
		'*://www.accuradio.com/pop_player/accujazz/*',
	],
}, {
	id: 'accuradio',
	js: 'connectors/accuradio.js',
	label: 'AccuRadio',
	matches: [
		'*://www.accuradio.com/*',
	],
}, {
	id: 'amambient',
	js: 'connectors/ambientsleepingpill.js',
	label: 'a.m. ambient',
	matches: [
		'*://amambient.com/',
	],
}, {
	id: 'amazon',
	js: 'connectors/amazon.js',
	label: 'Amazon',
	matches: [
		'*://music.amazon.*/*',
		'*://www.amazon.*/gp/dmusic/cloudplayer/*',
	],
}, {
	id: 'amazon-alexa',
	js: 'connectors/amazon-alexa.js',
	label: 'Amazon Echo',
	matches: [
		'*://alexa.amazon.*/spa/*',
	],
}, {
	id: 'ambientsleepingpill',
	js: 'connectors/ambientsleepingpill.js',
	label: 'Ambient Sleeping Pill',
	matches: [
		'*://ambientsleepingpill.com/',
	],
}, {
	id: 'anghami',
	js: 'connectors/anghami.js',
	label: 'Anghami',
	matches: [
		'*://*.anghami.com/*',
	],
}, {
	id: 'apidog',
	js: 'connectors/apidog.js',
	label: 'Apidog',
	matches: [
		'*://apidog.ru/*',
	],
}, {
	id: 'apple-music',
	js: 'connectors/apple-music.js',
	label: 'Apple Music',
	matches: [
		'*://beta.music.apple.com/*',
	],
}, {
	id: 'archive',
	js: 'connectors/archive.js',
	label: 'Internet Archive',
	matches: [
		'*://archive.org/details/*',
	],
}, {
	id: 'atomicmusic.space',
	js: 'connectors/atomicmusic.space.js',
	label: 'Atomic Music Space',
	matches: [
		'*://stream.atomicmusic.space/*',
	],
}, {
	id: 'audiomack',
	js: 'connectors/audiomack.js',
	label: 'Audiomack',
	matches: [
		'*://audiomack.com/*',
	],
}, {
	id: 'bandcamp',
	js: 'connectors/bandcamp.js',
	label: 'Bandcamp',
	matches: [
		'*://*.bandcamp.com/*',
		'*://bandcamp.com/*',
	],
}, {
	id: 'bandcamp-embed',
	js: 'connectors/bandcamp-embed.js',
	label: 'Bandcamp Daily',
	matches: [
		'*://daily.bandcamp.com/*',
	],
	allFrames: 'true',
}, {
	id: 'bandzone.cz',
	js: 'connectors/bandzone.cz.js',
	label: 'Bandzone.cz',
	matches: [
		'*://bandzone.cz/*',
	],
}, {
	id: 'bbc-radio',
	js: 'connectors/bbc-radio.js',
	label: 'BBC RadioPlayer',
	matches: [
		'*://www.bbc.co.uk/radio/player/*',
	],
}, {
	id: 'bbc-sounds',
	js: 'connectors/bbc-sounds.js',
	label: 'BBC Sounds',
	matches: [
		'*://www.bbc.co.uk/sounds/play/*',
	],
}, {
	id: 'beatport',
	js: 'connectors/beatport.js',
	label: 'Beatport',
	matches: [
		'*://www.beatport.com/*',
	],
}, {
	id: 'blocsonic',
	js: 'connectors/blocsonic.js',
	label: 'blocSonic',
	matches: [
		'*://*.blocsonic.com/*',
	],
}, {
	id: 'bugs',
	js: 'connectors/bugs.js',
	label: 'Bugs',
	matches: [
		'*://music.bugs.co.kr/newPlayer*',
	],
}, {
	id: 'byte.fm',
	js: 'connectors/byte.fm.js',
	label: 'ByteFM',
	matches: [
		'*://www.byte.fm/*',
	],
}, {
	id: 'ccmixter',
	js: 'connectors/ccmixter.js',
	label: 'ccMixter',
	matches: [
		'*://ccmixter.org/*',
		'*://*.ccmixter.org/*',
		'*://tunetrack.net/*',
	],
}, {
	id: 'chillhop',
	js: 'connectors/chillhop.js',
	label: 'Chillhop',
	matches: [
		'*://chillhop.com/*',
	],
}, {
	id: 'classicalradio',
	js: 'connectors/radiotunes.js',
	label: 'ClassicalRadio',
	matches: [
		'*://www.classicalradio.com/*',
	],
}, {
	id: 'danceradio',
	js: 'connectors/danceradio.js',
	label: 'Dance radio',
	matches: [
		'*://www.danceradio.cz/*',
	],
}, {
	id: 'dandelionradio',
	js: 'connectors/dandelionradio.js',
	label: 'Dandelion Radio',
	matches: [
		'*://www.dandelionradio.com/player.htm',
	],
}, {
	id: 'datpiff',
	js: 'connectors/datpiff.js',
	label: 'DatPiff',
	matches: [
		'*://www.datpiff.com/player/*',
	],
	allFrames: 'true',
}, {
	id: 'deezer',
	js: 'connectors/deezer.js',
	label: 'Deezer',
	matches: [
		'*://www.deezer.com/*',
	],
}, {
	id: 'deltaradio.de',
	js: 'connectors/deltaradio.de.js',
	label: 'deltaradio',
	matches: [
		'*://www.deltaradio.de/*',
	],
}, {
	id: 'deutschlandfunknova',
	js: 'connectors/deutschlandfunknova.js',
	label: 'Deutschlandfunk Nova',
	matches: [
		'*://www.deutschlandfunknova.de/*',
	],
}, {
	id: 'di',
	js: 'connectors/di.js',
	label: 'Digitally Imported',
	matches: [
		'*://www.di.fm/*',
	],
}, {
	id: 'douban-artists',
	js: 'connectors/douban-artists.js',
	label: 'Douban Artists',
	matches: [
		'*://music.douban.com/artists/player/*',
	],
}, {
	id: 'douban.fm',
	js: 'connectors/douban.fm.js',
	label: 'Douban.FM',
	matches: [
		'*://douban.fm/*',
	],
}, {
	id: 'driveplayer',
	js: 'connectors/driveplayer.js',
	label: 'Music Player for Google Drive',
	matches: [
		'*://www.driveplayer.com/*',
	],
}, {
	id: 'dubtrack.fm',
	js: 'connectors/dubtrack.fm.js',
	label: 'Dubtrack.fm',
	matches: [
		'*://www.dubtrack.fm/*',
	],
}, {
	id: 'earbits',
	js: 'connectors/earbits.js',
	label: 'Earbits',
	matches: [
		'*://www.earbits.com/*',
	],
}, {
	id: 'egofm',
	js: 'connectors/egofm.js',
	label: 'egoFM',
	matches: [
		'*://www.egofm.de/*',
		'*://player.addradio.de/player/2366*',
	],
}, {
	id: 'emby',
	js: 'connectors/emby.js',
	label: 'Emby/Jellyfin',
	matches: [
		'*://*8096/web/*',
		'*://*8920/web/*',
		'*://app.emby.media/*',
	],
}, {
	id: 'emusic',
	js: 'connectors/emusic.js',
	label: 'eMusic',
	matches: [
		'*://www.emusic.com/*',
	],
}, {
	id: 'epicmusictime',
	js: 'connectors/jazzandrain.js',
	label: 'EpicMusicTime',
	matches: [
		'*://epicmusictime.com/*',
	],
}, {
	id: 'evropa2',
	js: 'connectors/evropa2.js',
	label: 'Evropa 2',
	matches: [
		'*://onair.evropa2.cz/*',
	],
}, {
	id: 'fairpricemusic',
	js: 'connectors/fairpricemusic.js',
	label: 'Fair Price Music',
	matches: [
		'*://www.fairpricemusic.com/*',
	],
}, {
	id: 'feedbands',
	js: 'connectors/feedbands.js',
	label: 'Feedbands',
	matches: [
		'*://feedbands.com/*',
	],
}, {
	id: 'fip',
	js: 'connectors/fip.js',
	label: 'FIP',
	matches: [
		'*://www.fip.fr/*',
	],
}, {
	id: 'fluxfm',
	js: 'connectors/fluxfm.js',
	label: 'FluxFM Berlin',
	matches: [
		'*://www.fluxfm.de/stream/*',
	],
}, {
	id: 'focusatwill',
	js: 'connectors/focusatwill.js',
	label: 'Focus@Will',
	matches: [
		'*://www.focusatwill.com/*',
	],
}, {
	id: 'freegalmusic',
	js: 'connectors/freegalmusic.js',
	label: 'Freegal',
	matches: [
		'*://*.freegalmusic.com/*',
	],
}, {
	id: 'freemusicarchive',
	js: 'connectors/freemusicarchive.js',
	label: 'Free Music Archive',
	matches: [
		'*://*.freemusicarchive.org/*',
	],
}, {
	id: 'frekvence1',
	js: 'connectors/frekvence1.js',
	label: 'Frekvence 1',
	matches: [
		'*://vysilani.frekvence1.cz/*',
	],
}, {
	id: 'fritz',
	js: 'connectors/fritz.js',
	label: 'Fritz',
	matches: [
		'*://www.fritz.de/livestream/*',
	],
}, {
	id: 'funkwhale',
	js: 'connectors/funkwhale.js',
	label: 'Funkwhale',
	matches: [
		'',
	],
}, {
	id: 'gaana',
	js: 'connectors/gaana.js',
	label: 'Gaana',
	matches: [
		'*://gaana.com/*',
	],
}, {
	id: 'gds-play',
	js: 'connectors/gds-play.fm.js',
	label: 'GDS.FM',
	matches: [
		'*://play.gds.fm/*',
	],
}, {
	id: 'genie',
	js: 'connectors/genie.js',
	label: 'Genie',
	matches: [
		'*://www.genie.co.kr/player/fPlayer*',
	],
}, {
	id: 'getworkdonemusic',
	js: 'connectors/getworkdonemusic.js',
	label: 'GetWorkDoneMusic',
	matches: [
		'*://*.getworkdonemusic.com/*',
	],
}, {
	id: 'gimmeradio',
	js: 'connectors/gimmeradio.js',
	label: 'Gimme Radio',
	matches: [
		'*://gimmeradio.com/*',
		'*://www.gimmeradio.com/*',
	],
}, {
	id: 'globalplayer',
	js: 'connectors/globalplayer.js',
	label: 'Global Player',
	matches: [
		'*://www.globalplayer.com/*',
	],
}, {
	id: 'google-play',
	js: 'connectors/google-play.js',
	label: 'Google Play Music',
	matches: [
		'*://play.google.com/music/*',
	],
}, {
	id: 'gpmusic',
	js: 'connectors/gpmusic.js',
	label: 'GPMusic',
	matches: [
		'*://player.gpmusic.co/*',
	],
}, {
	id: 'groovemp3',
	js: 'connectors/bemusic.js',
	label: 'GrooveMP3',
	matches: [
		'*://*.groovemp3.com/*',
	],
}, {
	id: 'groovemusic',
	js: 'connectors/groovemusic.js',
	label: 'Groove Music',
	matches: [
		'*://music.microsoft.com/*',
	],
}, {
	id: 'grrif',
	js: 'connectors/grrif.js',
	label: 'GRRIF',
	matches: [
		'*://*.grrif.ch/*',
	],
}, {
	id: 'hillydilly',
	js: 'connectors/hillydilly.js',
	label: 'HillyDilly',
	matches: [
		'*://www.hillydilly.com/*',
	],
}, {
	id: 'hotmixradio',
	js: 'connectors/hotmixradio.js',
	label: 'Hotmixradio.fr',
	matches: [
		'*://www.hotmixradio.fr/*',
	],
}, {
	id: 'hqradio',
	js: 'connectors/hqradio.js',
	label: 'HQ Radio',
	matches: [
		'*://hqradio.ru/*',
	],
}, {
	id: 'hypem',
	js: 'connectors/hypem.js',
	label: 'Hype Machine',
	matches: [
		'*://hypem.com/*',
	],
}, {
	id: 'hypem-premieres',
	js: 'connectors/hypem-premieres.js',
	label: 'Hype Machine Premieres',
	matches: [
		'*://hypem.com/premiere/*',
	],
}, {
	id: 'iheart',
	js: 'connectors/iheart.js',
	label: 'iHeartRadio',
	matches: [
		'*://*.iheart.com/*',
	],
}, {
	id: 'imago',
	js: 'connectors/imago.js',
	label: 'Imago Radio',
	matches: [
		'*://*.imago.fm/*',
	],
}, {
	id: 'imusic.am',
	js: 'connectors/imusic.am.js',
	label: 'Imusic.am',
	matches: [
		'*://imusic.am/*',
	],
}, {
	id: 'indieshuffle',
	js: 'connectors/indieshuffle.js',
	label: 'Indie Shuffle',
	matches: [
		'*://www.indieshuffle.com/*',
	],
}, {
	id: 'invidious',
	js: 'connectors/invidious.js',
	label: 'Invidious',
	matches: [
		'*://invidio.us/*',
	],
}, {
	id: 'jamendo',
	js: 'connectors/jamendo.js',
	label: 'Jamendo',
	matches: [
		'*://www.jamendo.com/*',
	],
}, {
	id: 'jango',
	js: 'connectors/jango.js',
	label: 'Jango',
	matches: [
		'*://www.jango.com/*',
	],
}, {
	id: 'jazz24',
	js: 'connectors/jazz24.js',
	label: 'Jazz24',
	matches: [
		'*://www.jazz24.org/',
		'*://v6.player.abacast.net/854',
	],
}, {
	id: 'jazzandrain',
	js: 'connectors/jazzandrain.js',
	label: 'JazzAndRain',
	matches: [
		'*://www.jazzandrain.com/*',
	],
}, {
	id: 'jazzradio',
	js: 'connectors/radiotunes.js',
	label: 'JazzRadio',
	matches: [
		'*://www.jazzradio.com/*',
	],
}, {
	id: 'jetsetradio.live',
	js: 'connectors/jetsetradio.live.js',
	label: 'JetSetRadio Live',
	matches: [
		'*://jetsetradio.live/*',
		'*://jetsetradio.live',
	],
}, {
	id: 'jiosaavn',
	js: 'connectors/jiosaavn.js',
	label: 'JioSaavn',
	matches: [
		'*://www.jiosaavn.com/*',
	],
}, {
	id: 'joox',
	js: 'connectors/joox.js',
	label: 'Joox',
	matches: [
		'*://www.joox.com/*',
	],
}, {
	id: 'kexp',
	js: 'connectors/kexp.js',
	label: 'KEXP Radio',
	matches: [
		'*://*.kexp.org/*',
	],
}, {
	id: 'kodi',
	js: 'connectors/kodi.js',
	label: 'Kodi',
}, {
	id: 'kollekt.fm',
	js: 'connectors/kollekt.fm.js',
	label: 'KOLLEKT.FM',
	matches: [
		'*://kollekt.fm/*',
		'*://*.kollekt.fm/*',
	],
}, {
	id: 'kugou',
	js: 'connectors/kugou.js',
	label: 'Kugou',
	matches: [
		'*://www.kugou.com/song/*',
	],
}, {
	id: 'kuwo',
	js: 'connectors/kuwo.js',
	label: 'Kuwo Music',
	matches: [
		'*://*.kuwo.cn/*',
	],
}, {
	id: 'kyivstar',
	js: 'connectors/kyivstar.js',
	label: 'Radio Kyivstar',
	matches: [
		'*://radio.kyivstar.ua/*',
	],
}, {
	id: 'letsloop',
	js: 'connectors/letsloop.js',
	label: 'LetsLoop',
	matches: [
		'*://letsloop.com/*',
	],
}, {
	id: 'listen.moe',
	js: 'connectors/listen.moe.js',
	label: 'Listen.moe',
	matches: [
		'*://listen.moe/*',
	],
}, {
	id: 'listenonrepeat',
	js: 'connectors/listenonrepeat.js',
	label: 'ListenOnRepeat',
	matches: [
		'*://listenonrepeat.com/*',
	],
}, {
	id: 'luoo',
	js: 'connectors/luoo.js',
	label: 'luooMusic',
	matches: [
		'*://www.luoo.net/*',
	],
}, {
	id: 'lyricstraining',
	js: 'connectors/lyricstraining.js',
	label: 'LyricsTraining',
	matches: [
		'*://lyricstraining.com/*',
	],
}, {
	id: 'mail.ru',
	js: 'connectors/mail.ru.js',
	label: 'Mail.ru Music',
	matches: [
		'*://my.mail.ru/music',
		'*://my.mail.ru/music/*',
	],
}, {
	id: 'megalyrics',
	js: 'connectors/megalyrics.js',
	label: 'Megalyrics',
	matches: [
		'*://megalyrics.ru/*',
	],
}, {
	id: 'mideastunes',
	js: 'connectors/mideastunes.js',
	label: 'Mideast Tunes',
	matches: [
		'*://mideastunes.com/*',
		'*://map.mideastunes.com/*',
	],
}, {
	id: 'mixcloud',
	js: 'connectors/mixcloud.js',
	label: 'MixCloud',
	matches: [
		'*://mixcloud.com/*',
		'*://*.mixcloud.com/*',
	],
}, {
	id: 'mnet',
	js: 'connectors/mnet.js',
	label: 'mnet',
	matches: [
		'*://www.mnet.com/*',
	],
}, {
	id: 'monkey3',
	js: 'connectors/monkey3.js',
	label: 'monkey3',
	matches: [
		'*://www.monkey3.co.kr/*',
	],
}, {
	id: 'monstercat',
	js: 'connectors/monstercat.js',
	label: 'Monstercat',
	matches: [
		'*://www.monstercat.com/*',
	],
}, {
	id: 'music-flo',
	js: 'connectors/music-flo.js',
	label: 'Flo',
	matches: [
		'*://www.music-flo.com/*',
	],
}, {
	id: 'musicoin',
	js: 'connectors/musicoin.js',
	label: 'Musicoin',
	matches: [
		'*://musicoin.org/*',
	],
}, {
	id: 'musicwalker',
	js: 'connectors/musicwalker.js',
	label: 'Music Walker',
	matches: [
		'*://arkanath.com/MusicWalker/*',
	],
}, {
	id: 'musish',
	js: 'connectors/musickit.js',
	label: 'Musish',
	matches: [
		'*://musi.sh/*',
	],
}, {
	id: 'mycloudplayer',
	js: 'connectors/mycloudplayer.js',
	label: 'My Cloud Player',
	matches: [
		'*://mycloudplayers.com/*',
	],
}, {
	id: 'myspace',
	js: 'connectors/myspace.js',
	label: 'MySpace',
	matches: [
		'*://myspace.com/*',
	],
}, {
	id: 'nashe',
	js: 'connectors/radioultra.js',
	label: 'Наше Радио',
	matches: [
		'*://player.nashe.ru/*',
	],
}, {
	id: 'naver',
	js: 'connectors/naver.js',
	label: 'Naver',
	matches: [
		'*://playerui.music.naver.com/*',
	],
}, {
	id: 'newgrounds',
	js: 'connectors/newgrounds.js',
	label: 'newgrounds',
	matches: [
		'*://www.newgrounds.com/audio*',
	],
}, {
	id: 'noisefm',
	js: 'connectors/noisefm.js',
	label: 'Noise FM',
	matches: [
		'*://noisefm.ru/*',
		'*://en.noisefm.ru/*',
	],
	allFrames: 'true',
}, {
	id: 'nova',
	js: 'connectors/nova.js',
	label: 'Radio Nova',
	matches: [
		'*://www.nova.fr/*',
	],
}, {
	id: 'novoeradio',
	js: 'connectors/novoeradio.js',
	label: 'Новое Радио',
	matches: [
		'*://www.novoeradio.by/*',
	],
}, {
	id: 'npr',
	js: 'connectors/npr.js',
	label: 'NPR',
	matches: [
		'*://www.npr.org/*',
	],
}, {
	id: 'nrk-radio',
	js: 'connectors/nrk-radio.js',
	label: 'NRK Radio',
	matches: [
		'*://radio.nrk.no/*',
	],
}, {
	id: 'obozrevatel',
	js: 'connectors/obozrevatel.js',
	label: 'RADIO Обозреватель',
	matches: [
		'*://radio.obozrevatel.com/*',
	],
}, {
	id: 'odnoklassniki',
	js: 'connectors/odnoklassniki.js',
	label: 'Odnoklassniki',
	matches: [
		'*://odnoklassniki.ru/*',
		'*://ok.ru/*',
	],
}, {
	id: 'olleh',
	js: 'connectors/olleh.js',
	label: 'olleh',
	matches: [
		'*://www.ollehmusic.com/*',
	],
}, {
	id: 'openfm',
	js: 'connectors/openfm.js',
	label: 'openfm',
	matches: [
		'*://open.fm/*',
	],
}, {
	id: 'pakartot',
	js: 'connectors/pakartot.js',
	label: 'Pakartot',
	matches: [
		'*://www.pakartot.lt/*',
	],
}, {
	id: 'pandora',
	js: 'connectors/pandora.js',
	label: 'Pandora',
	matches: [
		'*://www.pandora.com/*',
	],
}, {
	id: 'panyrosasdiscos',
	js: 'connectors/panyrosasdiscos.js',
	label: 'pan y rosas discos',
	matches: [
		'*://www.panyrosasdiscos.net/*',
	],
}, {
	id: 'patari',
	js: 'connectors/patari.js',
	label: 'Patari',
	matches: [
		'*://patari.pk/*',
	],
}, {
	id: 'pcloud',
	js: 'connectors/pcloud.js',
	label: 'pCloud',
	matches: [
		'*://my.pcloud.com/*',
	],
}, {
	id: 'perisonic',
	js: 'connectors/perisonic.js',
	label: 'Perisonic',
	matches: [
		'*://robinbakker.nl/perisonic/*',
	],
}, {
	id: 'phish.in',
	js: 'connectors/phish.in.js',
	label: 'Phish.in',
	matches: [
		'*://phish.in/*',
	],
}, {
	id: 'pinguinradio',
	js: 'connectors/pinguinradio.js',
	label: 'Pinguin Radio',
	matches: [
		'*://pinguinradio.com/*',
	],
}, {
	id: 'pitchfork',
	js: 'connectors/pitchfork.js',
	label: 'Pitchfork',
	matches: [
		'*://pitchfork.com/*',
	],
}, {
	id: 'planetradio',
	js: 'connectors/planetradio.js',
	label: 'Planet Radio',
	matches: [
		'*://planetradio.co.uk/*/player/*',
	],
}, {
	id: 'playapplemusic',
	js: 'connectors/musickit.js',
	label: 'PlayAppleMusic.com',
	matches: [
		'*://playapplemusic.com/*',
	],
}, {
	id: 'player.fm',
	js: 'connectors/player.fm.js',
	label: 'Player.fm',
	matches: [
		'*://player.fm/*',
	],
}, {
	id: 'playirish',
	js: 'connectors/playirish.js',
	label: 'PlayIrish',
	matches: [
		'*://*.playirish.ie/*',
	],
}, {
	id: 'playmoss',
	js: 'connectors/playmoss.js',
	label: 'Playmoss',
	matches: [
		'*://playmoss.com/*',
	],
}, {
	id: 'plaza',
	js: 'connectors/plaza.js',
	label: 'Nightwave Plaza',
	matches: [
		'*://plaza.one/*',
	],
}, {
	id: 'plex',
	js: 'connectors/plex.js',
	label: 'Plex',
	matches: [
		'*://*32400/web/*',
		'*://plex.tv/web/*',
		'*://*.plex.tv/web/*',
		'*://*.plex.tv/desktop*',
	],
}, {
	id: 'plug.dj',
	js: 'connectors/plug.dj.js',
	label: 'plug.dj',
	matches: [
		'*://plug.dj/*',
	],
}, {
	id: 'polskieradio',
	js: 'connectors/polskieradio.js',
	label: 'Moje Polskie Radio',
	matches: [
		'*://moje.polskieradio.pl/station/*',
	],
}, {
	id: 'poolside',
	js: 'connectors/poolside.js',
	label: 'Poolside FM',
	matches: [
		'*://poolside.fm/*',
	],
}, {
	id: 'pretzel',
	js: 'connectors/pretzel.js',
	label: 'Pretzel',
	matches: [
		'*://*.pretzel.rocks/*',
	],
}, {
	id: 'primephonic',
	js: 'connectors/primephonic.js',
	label: 'Primephonic',
	matches: [
		'*://play.primephonic.com/*',
	],
}, {
	id: 'provoda.ch',
	js: 'connectors/provoda.ch.js',
	label: 'Provoda.ch',
	matches: [
		'*://*.provoda.ch/*',
	],
}, {
	id: 'qq-music',
	js: 'connectors/qq-music.js',
	label: 'QQ Music',
	matches: [
		'*://y.qq.com/portal/*',
	],
}, {
	id: 'qq-video',
	js: 'connectors/qq-video.js',
	label: 'QQ Video',
	matches: [
		'*://v.qq.com/x/*',
	],
}, {
	id: 'r-a-d.io',
	js: 'connectors/r-a-d.io.js',
	label: 'R-a-dio',
	matches: [
		'*://r-a-d.io/*',
	],
}, {
	id: 'radio-mb',
	js: 'connectors/radio-mb.js',
	label: 'Duckburg Radio',
	matches: [
		'*://*.radio-mb.com/*',
	],
}, {
	id: 'radio.com',
	js: 'connectors/radio.com.js',
	label: 'Radio.com',
	matches: [
		'*://www.radio.com/*',
	],
}, {
	id: 'radiobonton',
	js: 'connectors/radiobonton.js',
	label: 'Rádio Bonton',
	matches: [
		'*://www.radiobonton.cz/*',
	],
}, {
	id: 'radioco',
	js: 'connectors/radioco.js',
	label: 'Radio.co',
	matches: [
		'*://embed.radio.co/player/*',
	],
}, {
	id: 'radioeins',
	js: 'connectors/radioeins.js',
	label: 'radioeins',
	matches: [
		'*://www.radioeins.de/livestream/*',
	],
}, {
	id: 'radiojavan',
	js: 'connectors/radiojavan.js',
	label: 'RadioJavan',
	matches: [
		'*://www.radiojavan.com/*',
	],
}, {
	id: 'radiojazzfm',
	js: 'connectors/radioultra.js',
	label: 'Radio JAZZ',
	matches: [
		'*://player.radiojazzfm.ru/*',
	],
}, {
	id: 'radionomy',
	js: 'connectors/radionomy.js',
	label: 'Radionomy',
	matches: [
		'*://www.radionomy.com/*',
	],
}, {
	id: 'radiooooo',
	js: 'connectors/radiooooo.js',
	label: 'Radiooooo',
	matches: [
		'*://radiooooo.com/*',
		'*://mobile.radiooooo.com/*',
	],
}, {
	id: 'radioparadise',
	js: 'connectors/radioparadise.js',
	label: 'Radio Paradise',
	matches: [
		'*://radioparadise.com/*',
	],
	allFrames: 'true',
}, {
	id: 'radioplayer',
	js: 'connectors/radioplayer.js',
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
}, {
	id: 'radioplus',
	js: 'connectors/radioplus.js',
	label: 'Radioplus',
	matches: [
		'*://www.radioplus.be/*',
		'*://radioplus.be/*',
	],
}, {
	id: 'radiorecord',
	js: 'connectors/radiorecord.js',
	label: 'Radio Record',
	matches: [
		'*://www.radiorecord.ru/*',
	],
}, {
	id: 'radiotunes',
	js: 'connectors/radiotunes.js',
	label: 'RadioTunes',
	matches: [
		'*://www.radiotunes.com/*',
	],
}, {
	id: 'radioultra',
	js: 'connectors/radioultra.js',
	label: 'Radio ULTRA',
	matches: [
		'*://player.radioultra.ru/*',
	],
}, {
	id: 'radiovolna',
	js: 'connectors/radiovolna.js',
	label: 'Радиоволна.нет',
	matches: [
		'*://radiovolna.net/*',
	],
}, {
	id: 'radiozenders',
	js: 'connectors/radiozenders.js',
	label: 'Radiozenders.FM',
	matches: [
		'*://www.radiozenders.fm/*',
	],
}, {
	id: 'rainwave',
	js: 'connectors/rainwave.js',
	label: 'Rainwave',
	matches: [
		'*://rainwave.cc/*',
		'*://all.rainwave.cc/*',
		'*://game.rainwave.cc/*',
		'*://chiptune.rainwave.cc/*',
		'*://ocr.rainwave.cc/*',
		'*://covers.rainwave.cc/*',
	],
}, {
	id: 'randomtube',
	js: 'connectors/randomtube.js',
	label: 'Randomtube',
	matches: [
		'*://youtube-playlist-randomizer.valami.info/*',
	],
}, {
	id: 'rawfm',
	js: 'connectors/rawfm.js',
	label: 'RAW.FM',
	matches: [
		'*://www.rawfm.com.au/stream/player*/',
		'*://rawfm.com.au/stream/player*/',
	],
}, {
	id: 'redbullradio',
	js: 'connectors/redbullradio.js',
	label: 'RBMA Radio',
	matches: [
		'*://www.redbullradio.com/*',
	],
}, {
	id: 'redditmusicplayer',
	js: 'connectors/redditmusicplayer.js',
	label: 'Reddit Music Player',
	matches: [
		'*://reddit.musicplayer.io/',
	],
}, {
	id: 'relaxingbeats',
	js: 'connectors/jazzandrain.js',
	label: 'RelaxingBeats',
	matches: [
		'*://relaxingbeats.com/*',
	],
}, {
	id: 'relisten',
	js: 'connectors/relisten.js',
	label: 'Relisten.net',
	matches: [
		'*://relisten.net/*',
	],
}, {
	id: 'remixrotation',
	js: 'connectors/remixrotation.js',
	label: 'RemixRotation',
	matches: [
		'*://remixrotation.com/*',
	],
}, {
	id: 'residentadvisor',
	js: 'connectors/residentadvisor.js',
	label: 'Resident Advisor',
	matches: [
		'*://www.residentadvisor.net/*',
	],
}, {
	id: 'resonate',
	js: 'connectors/resonate.js',
	label: 'Resonate.is',
	matches: [
		'*://resonate.is/*',
		'*://*.resonate.is/*',
	],
}, {
	id: 'retro-synthwave',
	js: 'connectors/retro-synthwave.js',
	label: 'Retro Synthwave',
	matches: [
		'*://www.retro-synthwave.com/*',
	],
}, {
	id: 'retrowave',
	js: 'connectors/retrowave.js',
	label: 'Retrowave',
	matches: [
		'*://retrowave.ru/*',
	],
}, {
	id: 'reverbnation',
	js: 'connectors/reverbnation.js',
	label: 'ReverbNation',
	matches: [
		'*://www.reverbnation.com/*',
	],
}, {
	id: 'rmfon',
	js: 'connectors/rmfon.js',
	label: 'RMFON',
	matches: [
		'*://www.rmfon.pl/*',
	],
}, {
	id: 'rockfm',
	js: 'connectors/radioultra.js',
	label: 'RockFM',
	matches: [
		'*://player.rockfm.ru/*',
	],
}, {
	id: 'rockradio',
	js: 'connectors/radiotunes.js',
	label: 'RockRadio',
	matches: [
		'*://www.rockradio.com/*',
	],
}, {
	id: 'roxx',
	js: 'connectors/roxx.js',
	label: 'Roxx Radio',
	matches: [
		'*://roxx.gr/radio/*',
	],
}, {
	id: 'rozhlas',
	js: 'connectors/rozhlas.js',
	label: 'Český Rozhlas',
	matches: [
		'*://prehravac.rozhlas.cz/*',
	],
}, {
	id: 'sectorradio',
	js: 'connectors/sectorradio.js',
	label: 'SECTOR Radio',
	matches: [
		'*://sectorradio.ru/*',
	],
}, {
	id: 'shuffleone',
	js: 'connectors/shuffleone.js',
	label: 'Shuffle',
	matches: [
		'*://shuffle.one/play*',
	],
}, {
	id: 'siriusxm-player',
	js: 'connectors/siriusxm-player.js',
	label: 'SiriusXM',
	matches: [
		'*://player.siriusxm.com/*',
		'*://player.siriusxm.ca/*',
	],
}, {
	id: 'slacker',
	js: 'connectors/slacker.js',
	label: 'Slacker',
	matches: [
		'*://www.slacker.com/*',
	],
}, {
	id: 'smoothfm',
	js: 'connectors/smoothfm.js',
	label: 'Smooth FM',
	matches: [
		'*://smoothfm.iol.pt/*',
	],
}, {
	id: 'sndtst',
	js: 'connectors/sndtst.js',
	label: 'SNDTST',
	matches: [
		'*:///sndtst.com/*',
	],
}, {
	id: 'somafm',
	js: 'connectors/somafm.js',
	label: 'SomaFM',
	matches: [
		'*://somafm.com/player/*',
	],
}, {
	id: 'sonerezh',
	js: 'connectors/sonerezh.js',
	label: 'Sonerezh',
	matches: [
		'*://sonerezh.*/*',
		'*://*/*sonerezh*',
	],
}, {
	id: 'soribada',
	js: 'connectors/soribada.js',
	label: 'Soribada',
	matches: [
		'*://www.soribada.com/*',
	],
}, {
	id: 'soundcloud',
	js: 'connectors/soundcloud.js',
	label: 'SoundCloud',
	matches: [
		'*://soundcloud.com/*',
	],
}, {
	id: 'soundsession',
	js: 'connectors/soundsession.js',
	label: 'Sound Session',
	matches: [
		'*://*soundsession.com/',
		'*://soundsession.center/station/*',
	],
}, {
	id: 'spotify',
	js: 'connectors/spotify.js',
	label: 'Spotify',
	matches: [
		'*://open.spotify.com/*',
	],
}, {
	id: 'streamsquid',
	js: 'connectors/streamsquid.js',
	label: 'Streamsquid',
	matches: [
		'*://streamsquid.com/*',
	],
}, {
	id: 'subphonic',
	js: 'connectors/subphonic.js',
	label: 'Subphonic (owncloud plugin)',
	matches: [
		'*://*/*/apps/subphonic/minisub/*',
	],
}, {
	id: 'superplayer',
	js: 'connectors/superplayer.js',
	label: 'Superplayer',
	matches: [
		'*://www.superplayer.fm/*',
	],
}, {
	id: 'taazi',
	js: 'connectors/taazi.js',
	label: 'Taazi',
	matches: [
		'*://taazi.com/*',
	],
}, {
	id: 'thatstation',
	js: 'connectors/thatstation.js',
	label: 'That Station',
	matches: [
		'*://www.thatstation.net/listen-live/',
	],
}, {
	id: 'the-radio.ru',
	js: 'connectors/the-radio.ru.js',
	label: 'The-radio.ru',
	matches: [
		'*://the-radio.ru/*',
	],
}, {
	id: 'thecurrent',
	js: 'connectors/thecurrent.js',
	label: 'The Current',
	matches: [
		'*://www.thecurrent.org/*',
	],
}, {
	id: 'themusicninja',
	js: 'connectors/themusicninja.js',
	label: 'The Music Ninja',
	matches: [
		'*://www.themusicninja.com/*',
	],
}, {
	id: 'tidal',
	js: 'connectors/tidal.js',
	label: 'Tidal',
	matches: [
		'*://listen.tidalhifi.com/*',
		'*://listen.tidal.com/*',
	],
}, {
	id: 'tubafm',
	js: 'connectors/tubafm.js',
	label: 'Tuba.FM',
	matches: [
		'*://fm.tuba.pl/*',
	],
}, {
	id: 'tunein',
	js: 'connectors/tunein.js',
	label: 'TuneIn',
	matches: [
		'*://tunein.com/*',
	],
}, {
	id: 'upbeatradio',
	js: 'connectors/upbeatradio.js',
	label: 'UpBeatRadio',
	matches: [
		'*://upbeatradio.net/*',
	],
}, {
	id: 'vagalume',
	js: 'connectors/vagalume.js',
	label: 'Vagalume.FM',
	matches: [
		'*://vagalume.fm/*',
		'*://*.vagalume.com.br/*',
	],
}, {
	id: 'vevo',
	js: 'connectors/vevo.js',
	label: 'Vevo',
	matches: [
		'*://www.vevo.com/*',
	],
}, {
	id: 'vimeo',
	js: 'connectors/vimeo.js',
	label: 'Vimeo',
	matches: [
		'*://vimeo.com/*',
	],
}, {
	id: 'vk',
	js: 'connectors/vk.js',
	label: 'VK',
	matches: [
		'*://vk.com/*',
	],
}, {
	id: 'warp-aphextwin',
	js: 'connectors/warp-aphextwin.js',
	label: 'Aphex Twin',
	matches: [
		'*://aphextwin.warp.net/*',
	],
}, {
	id: 'watch2gether',
	js: 'connectors/watch2gether.js',
	label: 'Watch2Gether',
	matches: [
		'*://www.watch2gether.com/*',
	],
}, {
	id: 'wavo',
	js: 'connectors/wavo.js',
	label: 'wavo',
	matches: [
		'*://wavo.me/*',
	],
}, {
	id: 'wfmu',
	js: 'connectors/wfmu.js',
	label: 'WFMU',
	matches: [
		'*://wfmu.org/audioplayer/*',
		'*://wfmu.org/archiveplayer/*',
	],
}, {
	id: 'whyd',
	js: 'connectors/whyd.js',
	label: 'Whyd',
	matches: [
		'*://whyd.com/*',
	],
}, {
	id: 'wwoz',
	js: 'connectors/wwoz.js',
	label: 'WWOZ',
	matches: [
		'*://www.wwoz.org/listen/player/*',
	],
}, {
	id: 'wynk',
	js: 'connectors/wynk.js',
	label: 'Wynk Music',
	matches: [
		'*://wynk.in/music*',
	],
}, {
	id: 'xiami',
	js: 'connectors/xiami.js',
	label: 'Xiami',
	matches: [
		'*://*.xiami.com/*',
	],
}, {
	id: 'yandex-music',
	js: 'connectors/yandex-music.js',
	label: 'Яндекс.Музыка',
	matches: [
		'*://music.yandex.ru/*',
		'*://music.yandex.by/*',
		'*://music.yandex.kz/*',
		'*://music.yandex.ua/*',
	],
}, {
	id: 'yandex-radio',
	js: 'connectors/yandex-music.js',
	label: 'Яндекс.Радио',
	matches: [
		'*://radio.yandex.ru/*',
		'*://radio.yandex.by/*',
		'*://radio.yandex.kz/*',
		'*://radio.yandex.ua/*',
	],
}, {
	id: 'youradio',
	js: 'connectors/youradio.js',
	label: 'Youradio',
	matches: [
		'*://*youradio.cz/*',
	],
}, {
	id: 'youtube',
	js: 'connectors/youtube.js',
	label: 'YouTube',
	matches: [
		'*://www.youtube.com/*',
	],
}, {
	id: 'youtube-embed',
	js: 'connectors/youtube-embed.js',
	label: 'Discogs',
	matches: [
		'*://www.discogs.com/*',
	],
	allFrames: 'true',
}, {
	id: 'youtube-music',
	js: 'connectors/youtube-music.js',
	label: 'YouTube Music',
	matches: [
		'*://music.youtube.com/*',
	],
}, {
	id: 'youtubify',
	js: 'connectors/bemusic.js',
	label: 'Youtubify',
	matches: [
		'*://youtubify.vebto.com/*',
		'*://bemusic.vebto.com/*',
	],
}, {
	id: 'yt-jukebox',
	js: 'connectors/yt-jukebox.js',
	label: 'Youtube Jukebox',
	matches: [
		'*://youtube.nestharion.de/*',
	],
}, {
	id: 'ytmp3',
	js: 'connectors/bemusic.js',
	label: 'ytmp3',
	matches: [
		'*://www.ytmp3.fun/*',
	],
}, {
	id: 'zacharyseguin',
	js: 'connectors/musickit.js',
	label: 'Zachary Seguin Music',
	matches: [
		'*://music.zacharyseguin.ca/*',
	],
}, {
	id: 'zenplayer',
	js: 'connectors/zenplayer.js',
	label: 'Zen Audio Player',
	matches: [
		'*://zenplayer.audio/*',
	],
}, {
	id: 'zenradio',
	js: 'connectors/radiotunes.js',
	label: 'Zen Radio',
	matches: [
		'*://www.zenradio.com/*',
	],
}
];

define(() => connectors);
