'use strict';

/**
 * All connectors are defined here, instead of manifest.
 *
 * Matching connector is injected to the page after document_end event.
 *
 * Supported fields:
 *   @param {String} label Label to be shown in options to enable/disable
 *   the connector. Be careful with renaming, as connector disable state
 *   depends on the label.
 *   @param {Array} matches Array of positive matches in format described in
 *   Chrome Ext. Dev. guide. Connectors are processed in order and the
 *   first match is used; you can use this behaviour to emulate exclude matches,
 *   @param {Array} js Array of paths of files to be executed. All executions
 *   happen on or after 'document_end'.
 *   @param {Boolean} allFrames Value representing InjectDetails.allFrames.
 *   False by default.
 */
define(function() {
	return [{
		label: 'Baidu Music',
		matches: ['*://play.baidu.com/*'],
		js: ['connectors/baidu.js'],
	},

	{
		label: 'YouTube',
		matches: ['*://www.youtube.com/*'],
		js: ['connectors/youtube.js'],
	},

	{
		label: 'Zen Audio Player',
		matches: ['*://zenplayer.audio/*'],
		js: ['connectors/zenplayer.js'],
	},

	{
		label: 'Google Play Music',
		matches: ['*://play.google.com/music/*'],
		js: ['connectors/googlemusic.js'],
	},

	{
		label: 'MySpace',
		matches: ['*://myspace.com/*'],
		js: ['connectors/myspace.js'],
	},

	{
		label: 'Pitchfork',
		matches: ['*://pitchfork.com/*', '*://www.pitchfork.com/*'],
		js: ['connectors/pitchfork.js'],
	},

	{
		label: 'Bandcamp',
		matches: ['*://*.bandcamp.com/*', '*://bandcamp.com/*'],
		js: ['connectors/bandcamp.js'],
	},

	{
		label: 'Jango',
		matches: ['*://www.jango.com/*'],
		js: ['connectors/jango.js']
	},

	{
		label: 'Pandora',
		matches: ['*://www.pandora.com/*'],
		js: ['connectors/pandora.js'],
	},

	{
		label: 'Pakartot',
		matches: ['*://www.pakartot.lt/*'],
		js: ['connectors/pakartot.js'],
	},

	{
		label: 'Deezer',
		matches: ['*://www.deezer.com/*'],
		js: ['connectors/deezer.js'],
	},

	{
		label: 'SoundCloud',
		matches: ['*://soundcloud.com/*'],
		js: ['connectors/soundcloud.js'],
	},

	{
		label: 'Amazon',
		matches: [
			'*://music.amazon.*/*',
			'*://www.amazon.*/gp/dmusic/cloudplayer/*',
		],
		js: ['connectors/amazon.js'],
	},

	{
		label: 'Amazon Echo',
		matches: ['*://alexa.amazon.*/spa/*'],
		js: ['connectors/amazon-alexa.js'],
	},

	{
		label: 'VK',
		matches: ['*://vk.com/*'],
		js: ['connectors/vk.js'],
	},

	{
		label: 'Zvooq',
		matches: ['*://zvooq.com/*'],
		js: ['connectors/zvooq.js'],
	},

	{
		label: 'Megalyrics',
		matches: ['*://megalyrics.ru/*'],
		js: ['connectors/megalyrics.js']
	},

	{
		label: 'iHeartRadio',
		matches: ['*://*.iheart.com/*'],
		js: ['connectors/iheart.js'],
	},

	{
		label: 'Indie Shuffle',
		matches: ['*://www.indieshuffle.com/*'],
		js: ['connectors/indieshuffle.js'],
	},

	{
		label: 'Tuba.FM',
		matches: ['*://fm.tuba.pl/*'],
		js: ['connectors/tubafm.js'],
	},

	{
		label: 'Spotify',
		matches: ['*://open.spotify.com/*'],
		js: ['connectors/spotify.js'],
	},

	{
		label: 'plug.dj',
		matches: ['*://plug.dj/*'],
		js: ['connectors/plug.dj.js'],
	},

	{
		label: 'Slacker',
		matches: ['*://www.slacker.com/*'],
		js: ['connectors/slacker.js'],
	},

	{
		label: 'Daytrotter',
		matches: ['*://www.daytrotter.com/*'],
		js: ['connectors/daytrotter.js'],
	},

	{
		label: 'AOL Radio',
		matches: ['*://aolradio.slacker.com/*'],
		js: ['connectors/slacker.js'],
	},

	{
		label: 'HillyDilly',
		matches: ['*://www.hillydilly.com/*'],
		js: ['connectors/hillydilly.js'],
	},

	{
		label: 'Groove Music',
		matches: ['*://music.microsoft.com/*'],
		js: ['connectors/groovemusic.js'],
	},

	{
		label: '8tracks',
		matches: ['*://8tracks.com/*'],
		js: ['connectors/8tracks.js'],
	},

	{
		label: 'Moje Polskie Radio',
		matches: ['*://moje.polskieradio.pl/station/*'],
		js: ['connectors/polskieradio.js'],
	},

	{
		label: 'Radio Nova',
		matches: ['*://www.nova.fr/*'],
		js: ['connectors/nova.js'],
	},

	{
		label: 'Radioplus',
		matches: ['*://www.radioplus.be/*', '*://radioplus.be/*'],
		js: ['connectors/radioplus.js'],
	},

	{
		label: 'Douban.FM',
		matches: ['*://douban.fm/*'],
		js: ['connectors/douban.fm.js'],
	},

	{
		label: 'Focus@Will',
		matches: ['*://www.focusatwill.com/*'],
		js: ['connectors/focusatwill.js'],
	},

	{
		label: 'Subphonic (owncloud plugin)',
		matches: ['*://*/*/apps/subphonic/minisub/*'],
		js: ['connectors/subphonic.js'],
	},

	{
		label: 'Sullen Ural',
		matches: ['*://sullen-ural.ru/*', '*://*.sullen-ural.ru/*'],
		js: ['connectors/sullen-ural.js'],
	},

	{
		label: 'Digitally Imported',
		matches: ['*://www.di.fm/*'],
		js: ['connectors/di.js'],
	},

	{
		label: 'BBC RadioPlayer',
		matches: ['*://www.bbc.co.uk/radio/player/*'],
		js: ['connectors/bbcradioplayer.js'],
	},

	{
		label: 'Gaana',
		matches: ['*://gaana.com/*'],
		js: ['connectors/gaana.js'],
	},

	{
		label: 'Яндекс.Музыка',
		matches: ['*://music.yandex.ru/*', '*://music.yandex.by/*', '*://music.yandex.kz/*', '*://music.yandex.ua/*'],
		js: ['connectors/yandex-music.js'],
	},

	{
		label: 'PLEX',
		matches: ['*://*32400/web/*', '*://plex.tv/web/*', '*://*.plex.tv/web/*', '*://*.plex.tv/desktop*'],
		js: ['connectors/plex.js'],
	},

	{
		label: 'Perisonic',
		matches: ['*://robinbakker.nl/perisonic/*'],
		js: ['connectors/perisonic.js'],
	},

	{
		label: 'TuneIn',
		matches: ['*://tunein.com/*'],
		js: ['connectors/tunein.js'],
	},

	{
		label: 'MixCloud',
		matches: ['*://mixcloud.com/*', '*://*.mixcloud.com/*'],
		js: ['connectors/mixcloud.js'],
	},

	{
		label: 'ReverbNation',
		matches: ['*://www.reverbnation.com/*'],
		js: ['connectors/reverbnation.js'],
	},

	{
		label: 'Xiami',
		matches: ['*://www.xiami.com/play*'],
		js: ['connectors/xiami.js'],
	},

	{
		label: 'NRK Radio',
		matches: ['*://radio.nrk.no/*'],
		js: ['connectors/nrk-radio.js'],
	},

	{
		label: 'Internet Archive',
		matches: ['*://archive.org/details/*'],
		js: ['connectors/archive.js'],
	},

	{
		label: 'Odnoklassniki',
		matches: ['*://odnoklassniki.ru/*', '*://ok.ru/*', '*://www.ok.ru/*'],
		js: ['connectors/odnoklassniki.js']
	},

	{
		label: '163 Music',
		matches: ['*://music.163.com/*'],
		js: ['connectors/163-music.js'],
	},

	{
		label: 'luooMusic',
		matches: ['*://www.luoo.net/*'],
		js: ['connectors/luoo.js'],
	},

	{
		label: 'Ambient Sleeping Pill',
		matches: ['*://ambientsleepingpill.com/'],
		js: ['connectors/ambientsleepingpill.js'],
	},

	{
		label: 'Tidal',
		matches: ['*://listen.tidalhifi.com/*', '*://listen.tidal.com/*'],
		js: ['connectors/tidal.js'],
	},

	{
		label: 'Hype Machine Premieres',
		matches: ['*://hypem.com/premiere/*'],
		js: ['connectors/hypem-premieres.js'],
	},

	{
		label: 'Hype Machine',
		matches: ['*://hypem.com/*'],
		js: ['connectors/hypem.js'],
	},

	{
		label: 'Radionomy',
		matches: ['*://www.radionomy.com/*'],
		js: ['connectors/radionomy.js'],
	},

	{
		label: 'JazzAndRain',
		matches: ['*://www.jazzandrain.com/*'],
		js: ['connectors/jazzandrain.js'],
	},

	{
		label: 'RelaxingBeats',
		matches: ['*://relaxingbeats.com/*'],
		js: ['connectors/jazzandrain.js'],
	},

	{
		label: 'EpicMusicTime',
		matches: ['*://epicmusictime.com/*'],
		js: ['connectors/jazzandrain.js'],
	},

	{
		label: 'AccuJazz',
		matches: ['*://www.accuradio.com/pop_player/accujazz/*'],
		js: ['connectors/accujazz.js'],
	},

	{
		label: 'AccuRadio',
		matches: ['*://www.accuradio.com/*'],
		js: ['connectors/accuradio.js'],
	},

	{
		label: 'RAW.FM',
		matches: ['*://www.rawfm.com.au/stream/player*/', '*://rawfm.com.au/stream/player*/'],
		js: ['connectors/rawfm.js'],
	},

	{
		label: 'Imusic.am',
		matches: ['*://imusic.am/*'],
		js: ['connectors/imusic.am.js'],
	},

	{
		label: 'Earbits',
		matches: ['*://www.earbits.com/*'],
		js: ['connectors/earbits.js'],
	},

	{
		label: 'Player.fm',
		matches: ['*://player.fm/*'],
		js: ['connectors/player.fm.js'],
	},

	{
		label: 'SNDTST',
		matches: ['*://www.sndtst.com/*', '*://sndtst.com/*'],
		js: ['connectors/sndtst.js'],
	},

	{
		label: 'RadioTunes',
		matches: ['*://www.radiotunes.com/*'],
		js: ['connectors/radiotunes.js'],
	},

	{
		label: 'RockRadio',
		matches: ['*://www.rockradio.com/*'],
		js: ['connectors/radiotunes.js'],
	},

	{
		label: 'ClassicalRadio',
		matches: ['*://www.classicalradio.com/*'],
		js: ['connectors/radiotunes.js'],
	},

	{
		label: 'Radio.com',
		matches: ['*://player.radio.com*'],
		js: ['connectors/radio.com.js'],
	},

	{
		label: 'M2 RADIO',
		matches: ['*://www.m2radio.fr/*'],
		js: ['connectors/m2radio.js'],
	},

	{
		label: 'GetWorkDoneMusic',
		matches: ['*://www.getworkdonemusic.com/*', '*://getworkdonemusic.com/*'],
		js: ['connectors/getworkdonemusic.js'],
	},

	{
		label: 'Москва ФМ',
		matches: ['*://moskva.fm/*'],
		js: ['connectors/moskva.fm.js'],
	},

	{
		label: 'Питер ФМ',
		matches: ['*://piter.fm/*'],
		js: ['connectors/moskva.fm.js'],
	},

	{
		label: 'Jamendo',
		matches: ['*://www.jamendo.com/*'],
		js: ['connectors/jamendo.js'],
	},

	{
		label: 'Whyd',
		matches: ['*://whyd.com/*'],
		js: ['connectors/whyd.js'],
	},

	{
		label: 'Bandzone.cz',
		matches: ['*://bandzone.cz/*'],
		js: ['connectors/bandzone.cz.js'],
	},

	{
		label: 'Music Player for Google Drive',
		matches: ['*://www.driveplayer.com/*'],
		js: ['connectors/driveplayer.js'],
	},

	{
		label: 'Kodi',
		js: ['connectors/kodi.js'],
	},

	{
		label: 'Superplayer',
		matches: ['*://www.superplayer.fm/*'],
		js: ['connectors/superplayer.js'],
	},

	{
		label: 'RMFON',
		matches: ['*://www.rmfon.pl/*', '*://rmfon.pl/*'],
		js: ['connectors/rmfon.js'],
	},

	{
		label: 'RADIO Обозреватель',
		matches: ['*://radio.obozrevatel.com/*'],
		js: ['connectors/obozrevatel.js'],
	},

	{
		label: 'Solayo',
		matches: ['*://www.solayo.com/*', '*://solayo.com/*'],
		js: ['connectors/solayo.js'],
	},

	{
		label: 'JazzRadio',
		matches: ['*://www.jazzradio.com/*'],
		js: ['connectors/radiotunes.js'],
	},

	{
		label: 'Far from Moscow',
		matches: ['*://www.farfrommoscow.com/*'],
		js: ['connectors/farfrommoscow.js'],
	},

	{
		label: 'Musicload',
		matches: ['*://www.musicload.de/*'],
		js: ['connectors/musicload.js'],
	},

	{
		label: 'SomaFM',
		matches: ['*://somafm.com/player/*'],
		js: ['connectors/somafm.js'],
	},

	{
		label: 'Noisetrade',
		matches: ['*://www.noisetrade.com/*', '*://noisetrade.com/*'],
		js: ['connectors/noisetrade.js'],
	},

	{
		label: 'Free Music Archive',
		matches: ['*://www.freemusicarchive.org/*', '*://freemusicarchive.org/*', '*://www.freemusicarchive.com/*', '*://freemusicarchive.com/*'],
		js: ['connectors/freemusicarchive.js'],
	},

	{
		label: 'musicase',
		matches: ['*://musicase.me/*'],
		js: ['connectors/musicase.js'],
	},

	{
		label: 'Reddit Music Player',
		matches: ['*://reddit.musicplayer.io/'],
		js: ['connectors/redditmusicplayer.js'],
	},

	{
		label: 'KOLLEKT.FM',
		matches: ['*://kollekt.fm/*', '*://*.kollekt.fm/*'],
		js: ['connectors/kollekt.fm.js'],
	},

	{
		label: 'Новое Радио',
		matches: ['*://www.novoeradio.by/*'],
		js: ['connectors/novoeradio.js'],
	},

	{
		label: 'Tradiio',
		matches: ['*://tradiio.com/*', '*://*.tradiio.com/*'],
		js: ['connectors/tradiio.js'],
	},

	{
		label: 'Яндекс.Радио',
		matches: [
			'*://radio.yandex.ru/*', '*://radio.yandex.by/*',
			'*://radio.yandex.kz/*', '*://radio.yandex.ua/*'
		],
		js: ['connectors/yandex-radio.js'],
	},

	{
		label: 'egoFM',
		matches: ['*://www.egofm.de/*', '*://player.addradio.de/player/2366*'],
		js: ['connectors/egofm.js'],
	},

	{
		label: 'Radio Paradise',
		matches: ['*://*.radioparadise.com/*'],
		js: ['connectors/radioparadise.js'],
		allFrames: true,
	},

	{
		label: 'Beatport',
		matches: ['*://www.beatport.com/*'],
		js: ['connectors/beatport.js'],
	},

	{
		label: 'The Music Ninja',
		matches: ['*://www.themusicninja.com/*'],
		js: ['connectors/themusicninja.js'],
	},

	{
		label: 'wavo',
		matches: ['*://wavo.me/*'],
		js: ['connectors/wavo.js'],
	},

	{
		label: 'Dubtrack.fm',
		matches: ['*://www.dubtrack.fm/*'],
		js: ['connectors/dubtrack.fm.js'],
	},

	{
		label: 'FluxFM Berlin',
		matches: ['*://www.fluxfm.de/stream/*'],
		js: ['connectors/fluxfm.js'],
	},

	{
		label: 'Noise FM',
		matches: ['*://noisefm.ru/*'],
		js: ['connectors/noisefm.js'],
		allFrames: true,
	},

	{
		label: 'WWOZ',
		matches: ['*://www.wwoz.org/listen/player/*'],
		js: ['connectors/wwoz.js'],
	},

	{
		label: 'Sonerezh',
		matches: ['*://sonerezh.*/*', '*://*/*sonerezh*'],
		js: ['connectors/sonerezh.js'],
	},

	{
		label: 'Evropa 2',
		matches: ['*://onair.evropa2.cz*'],
		js: ['connectors/evropa2.js'],
	},

	{
		label: 'Europa 2',
		matches: ['*://onair.europa2.sk*'],
		js: ['connectors/evropa2.js'],
	},

	{
		label: 'Frekvence 1',
		matches: ['*://vysilani.frekvence1.cz/*'],
		js: ['connectors/frekvence1.js'],
	},

	{
		label: 'Youradio',
		matches: ['*://*youradio.cz/*'],
		js: ['connectors/youradio.js'],
	},

	{
		label: 'Dance radio',
		matches: ['*://www.danceradio.cz/*'],
		js: ['connectors/danceradio.js'],
	},

	{
		label: 'Rádio Bonton',
		matches: ['*://www.radiobonton.cz/*'],
		js: ['connectors/radiobonton.js'],
	},

	{
		label: 'GPMusic',
		matches: ['*://player.gpmusic.co/*'],
		js: ['connectors/gpmusic.js'],
	},

	{
		label: 'Youtube Jukebox',
		matches: ['*://youtube.nestharion.de/*'],
		js: ['connectors/yt-jukebox.js'],
	},

	{
		label: 'Nightwave Plaza',
		matches: ['*://plaza.one/*'],
		js: ['connectors/plaza.js'],
	},

	{
		label: 'Retrowave',
		matches: ['*://retrowave.ru/*'],
		js: ['connectors/retrowave.js'],
	},

	{
		label: 'Paste Radio',
		matches: ['*://www.pastemagazine.com/radio*'],
		js: ['connectors/pasteradio.js'],
	},

	{
		label: 'Genie',
		matches: ['*://www.genie.co.kr/player/fPlayer*'],
		js: ['connectors/genie.js'],
	},

	{
		label: 'Playmoss',
		matches: ['*://playmoss.com/*'],
		js: ['connectors/playmoss.js'],
	},

	{
		label: 'Apidog',
		matches: ['*://apidog.ru/*'],
		js: ['connectors/apidog.js'],
	},
	{
		label: 'RBMA Radio',
		matches: ['*://www.redbullradio.com/*'],
		js: ['connectors/redbullradio.js'],
	},

	{
		label: 'Pinguin Radio',
		matches: ['*://pinguinradio.com/*'],
		js: ['connectors/pinguinradio.js'],
	},

	{
		label: 'TRT Türkü',
		matches: ['*://*trtturku.net/*'],
		js: ['connectors/trtturku.js'],
	},

	{
		label: 'Vevo',
		matches: ['*://www.vevo.com/*'],
		js: ['connectors/vevo.js'],
	},

	{
		label: 'Saavn',
		matches: ['*://www.saavn.com/*'],
		js: ['connectors/saavn.js'],
	},

	{
		label: 'Anghami',
		matches: ['*://www.anghami.com/*', '*://play.anghami.com/*'],
		js: ['connectors/anghami.js'],
	},

	{
		label: 'Dewtone',
		matches: ['*://dewtone.com/*'],
		js: ['connectors/dewtone.js'],
	},

	{
		label: 'Style Jukebox',
		matches: ['*://play.stylejukebox.com/*'],
		js: ['connectors/stylejukebox.js'],
	},

	{
		label: 'Mail.ru Music',
		matches: [
			'*://my.mail.ru/music',
			'*://my.mail.ru/music/*'
		],
		js: ['connectors/mail.ru.js'],
	},

	{
		label: 'Emby',
		matches: ['*://*8096/web/*', '*://*8920/web/*', '*://app.emby.media/*'],
		js: ['connectors/emby.js'],
	},

	{
		label: 'Freegal',
		matches: ['*://*.freegalmusic.com/*'],
		js: ['connectors/freegalmusic.js'],
	},

	{
		label: 'Monstercat',
		matches: ['*://www.monstercat.com/*'],
		js: ['connectors/monstercat.js'],
	},

	{
		label: 'Randomtube',
		matches: ['*://youtube-playlist-randomizer.valami.info/*'],
		js: ['connectors/randomtube.js'],
	},

	{
		label: 'Listen.moe',
		matches: ['*://listen.moe/*'],
		js: ['connectors/listen.moe.js'],
	},

	{
		label: 'Fair Price Music',
		matches: ['*://www.fairpricemusic.com/*'],
		js: ['connectors/fairpricemusic.js'],
	},

	{
		label: 'My Cloud Player',
		matches: ['*://mycloudplayers.com/*'],
		js: ['connectors/mycloudplayer.js'],
	},

	{
		label: 'Radio ULTRA',
		matches: ['*://player.radioultra.ru/*'],
		js: ['connectors/radioultra.js'],
	},

	{
		label: 'Наше Радио',
		matches: ['*://player.nashe.ru/*'],
		js: ['connectors/radioultra.js'],
	},

	{
		label: 'RockFM',
		matches: ['*://player.rockfm.ru/*'],
		js: ['connectors/radioultra.js'],
	},

	{
		label: 'Radio JAZZ',
		matches: ['*://player.radiojazzfm.ru/*'],
		js: ['connectors/radioultra.js'],
	},

	{
		label: 'Best FM',
		matches: ['*://player.bestfm.ru/*'],
		js: ['connectors/radioultra.js'],
	},

	{
		label: 'Jazz24',
		matches: [
			// Website
			'*://www.jazz24.org/',
			// Web player
			'*://v6.player.abacast.net/854'
		],
		js: ['connectors/jazz24.js'],
	},

	{
		label: 'Planet Radio',
		matches: ['*://planetradio.co.uk/*/player/*'],
		js: ['connectors/planetradio.js'],
	},

	{
		label: 'Roxx Radio',
		matches: ['*://roxx.gr/radio/*'],
		js: ['connectors/roxx.js'],
	},

	{
		label: 'ListenOnRepeat',
		matches: ['*://listenonrepeat.com/*'],
		js: ['connectors/listenonrepeat.js'],
	},

	{
		label: 'Duckburg Radio',
		matches: ['*://*.radio-mb.com/*'],
		js: ['connectors/radio-mb.js'],
	},

	{
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
		js: ['connectors/radioplayer.js'],
	},

	{
		label: 'Delta Radio UK',
		matches: ['*://deltaradiouk.co.uk/popout-player*'],
		js: ['connectors/deltaradiouk.js'],
	},

	{
		label: 'deltaradio',
		matches: ['*://www.deltaradio.de/*'],
		js: ['connectors/deltaradio.de.js'],
	},

	{
		label: 'ByteFM',
		matches: ['*://www.byte.fm/*'],
		js: ['connectors/byte.fm.js'],
	},

	{
		label: 'Deutschlandfunk Nova',
		matches: ['*://www.deutschlandfunknova.de/*'],
		js: ['connectors/deutschlandfunknova.js'],
	},

	{
		label: 'QQ Music',
		matches: ['*://y.qq.com/portal/*'],
		js: ['connectors/qq-music.js'],
	},
	{
		label: 'QQ Video',
		matches: ['*://v.qq.com/x/*'],
		js: ['connectors/qq-video.js']
	},

	{
		label: 'Youtubify',
		matches: ['*://youtubify.vebto.com/*', '*://bemusic.vebto.com/*'],
		js: ['connectors/bemusic.js'],
	},

	{
		label: 'Ma5onic Music Player',
		matches: [
			'*://ma5onic.com/PlayerApp/*',
			'*://player.ma5onic.com/*',
			'*://www.ma5onic.com/PlayerApp/*',
			'*://www.player.ma5onic.com/*'],
		js: ['connectors/bemusic.js'],
	}, {
		label: 'GrooveMP3',
		matches: ['*://groovemp3.com/*', '*://www.groovemp3.com/*'],
		js: ['connectors/bemusic.js'],
	}, {
		label: 'S2Music',
		matches: ['*://s2music.com/*', '*://www.s2music.com/*'],
		js: ['connectors/bemusic.js'],
	}, {
		label: 'Loud.zone',
		matches: ['*://loud.zone/*'],
		js: ['connectors/bemusic.js'],
	},

	{
		label: 'Mixblast',
		matches: ['*://mixbla.st/*'],
		js: ['connectors/mixbla.st.js'],
		allFrames: true
	}, {
		label: 'Discogs',
		matches: ['*://www.discogs.com/*'],
		js: ['connectors/youtube-embed.js'],
		allFrames: true
	}, {
		label: 'Kuwo Music',
		matches: [
			'*://kuwo.cn/*',
			'*://www.kuwo.cn/*',
			'*://m.kuwo.cn/*'
		],
		js: ['connectors/kuwo.js'],
	}, {
		label: 'NPR',
		matches: ['*://www.npr.org/*'],
		js: ['connectors/npr.js'],
	}, {
		label: 'Streamsquid',
		matches: ['*://streamsquid.com/*'],
		js: ['connectors/streamsquid.js'],
	}, {
		label: 'eMusic',
		matches: ['*://www.emusic.com/*'],
		js: ['connectors/emusic.js'],
	}, {
		label: 'Torch Music',
		matches: ['*://music.torchbrowser.com/*'],
		js: ['connectors/torchbrowser.js']
	}, {
		label: 'LyricsTraining',
		matches: ['*://lyricstraining.com/*'],
		js: ['connectors/lyricstraining.js'],
	}, {
		label: 'Music Walker',
		matches: ['*://arkanath.com/MusicWalker/*'],
		js: ['connectors/musicwalker.js'],
	}, {
		label: 'radioeins',
		matches: ['*://www.radioeins.de/livestream/*'],
		js: ['connectors/radioeins.js'],
	}, {
		label: 'Fritz',
		matches: ['*://www.fritz.de/livestream/*'],
		js: ['connectors/fritz.js'],
	}, {
		label: 'Musicoin',
		matches: ['*://musicoin.org/*'],
		js: ['connectors/musicoin.js']
	}, {
		label: '181.fm',
		matches: ['*://181fm.mystreamplayer.com/*'],
		js: ['connectors/181.fm.js']
	}, {
		label: 'Phish.in',
		matches: ['*://phish.in/*'],
		js: ['connectors/phish.in.js']
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
		js: ['connectors/rainwave.js']
	}, {
		label: 'Fanburst',
		matches: ['*://fanburst.com/*'],
		js: ['connectors/fanburst.js']
	}, {
		label: 'Retro Synthwave',
		matches: ['*://www.retro-synthwave.com/*'],
		js: ['connectors/retro-synthwave.js']
	}, {
		label: 'SESHstation',
		matches: ['*://radio.sesh.team/'],
		js: ['connectors/sesh.js']
	}, {
		label: 'Радиоволна.нет',
		matches: ['*://radiovolna.net/*'],
		js: ['connectors/radiovolna.js']
	}, {
		label: 'Feedbands',
		matches: ['*://feedbands.com/*'],
		js: ['connectors/feedbands.js']
	}, {
		label: 'Vimeo',
		matches: ['*://vimeo.com/*'],
		js: ['connectors/vimeo.js']
	}, {
		label: 'Taazi',
		matches: ['*://taazi.com/*'],
		js: ['connectors/taazi.js']
	}, {
		label: 'Patari',
		matches: ['*://patari.pk/*'],
		js: ['connectors/patari.js']
	}, {
		label: 'JetSetRadio Live',
		matches: ['*://jetsetradio.live/*', '*://jetsetradio.live'],
		js: ['connectors/jetsetradio.live.js']
	}, {
		label: 'FIP',
		matches: ['*://www.fipradio.fr/*'],
		js: ['connectors/fipradio.js']
	}, {
		label: 'RemixRotation',
		matches: ['*://remixrotation.com/*'],
		js: ['connectors/remixrotation.js']

	}, {
		label: 'WFMU',
		matches: ['*://wfmu.org/audioplayer/*', '*://wfmu.org/archiveplayer/*'],
		js: ['connectors/wfmu.js'],
	}, {
		label: 'SiriusXM',
		matches: ['*://player.siriusxm.com/*'],
		js: ['connectors/siriusxm-player.js']
	}, {
		label: '1ting',
		matches: [
			'*://www.1ting.com/player/*', '*://www.1ting.com/p_*',
			'*://www.1ting.com/album*', '*://www.1ting.com/rand.php*',
			'*://www.1ting.com/day/*',
			'*://h5.1ting.com/*'
		],
		js: ['connectors/1ting.js']
	}, {
		label: 'Douban Artists',
		matches: ['*://music.douban.com/artists/player/*'],
		js: ['connectors/douban-artists.js']
	}, {
		label: 'Kugou',
		matches: ['*://www.kugou.com/song/*'],
		js: ['connectors/kugou.js']
	}, {
		label: 'ccMixter',
		matches: ['*://ccmixter.org/*', '*://*.ccmixter.org/*', '*://tunetrack.net/*'],
		js: ['connectors/ccmixter.js']
	}, {
		label: 'Rinoceronte.fm',
		// TODO: Use mediastre.am connector instead
		matches: ['*://www.rinoceronte.fm/*', '*://nowplaying.mediastre.am/*'],
		js: ['connectors/rinoceronte.fm.js'],
		allFrames: true
	}, {
		label: 'Hitsradio',
		matches: ['*://hitsradio.com/*'],
		js: ['connectors/hitsradio.js']
	}, {
		label: 'Gimme Radio',
		matches: ['*://gimmeradio.com/*', '*://www.gimmeradio.com/*'],
		js: ['connectors/gimmeradio.js']
	}, {
		label: '9sky',
		matches: ['*://www.9sky.com/music*', '*://www.9sky.com/mv/detail*'],
		js: ['connectors/9sky.js']
	}, {
		label: 'Vagalume.FM',
		matches: ['*://vagalume.fm/*', '*://*.vagalume.com.br/*'],
		js: ['connectors/vagalume.js']
	}, {
		label: 'Radiooooo',
		matches: ['*://radiooooo.com/*', '*://mobile.radiooooo.com/*'],
		js: ['connectors/radiooooo.js']
	}, {
		label: 'LetsLoop',
		matches: ['*://letsloop.com/*'],
		js: ['connectors/letsloop.js']
	}, {
		label: 'Mideast Tunes',
		matches: ['*://mideastunes.com/*', '*://map.mideastunes.com/*'],
		js: ['connectors/mideastunes.js']
	}, {
		label: 'Český Rozhlas',
		matches: ['*://prehravac.rozhlas.cz/*'],
		js: ['connectors/rozhlas.js']
	}, {
		label: 'Sound Session',
		matches: ['*://*soundsession.com/', '*://soundsession.center/station/*'],
		js: ['connectors/soundsession.js']
	}, {
		label: 'blocSonic',
		matches: ['*://blocsonic.com/*'],
		js: ['connectors/blocsonic.js']
	}];
});
