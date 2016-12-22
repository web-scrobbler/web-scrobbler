'use strict';
/**
 * All connectors are defined here, instead of manifest.
 *
 * Matching connector is injected to the page after document_end event.
 *
 * Do not include jQuery - it is included by default.
 *
 *
 * Supported fields:
 *
 *    label
 *          - label to be shown in options to enable/disable the connector
 *          - be careful with renaming, as connector disable state depends on the label
 *
 *    matches
 *          - array of positive matches in format described in Chrome Ext. Dev. guide
 *          - connectors are processed in order and the first match is used; you can use
 *            this behaviour to emulate exclude matches
 *
 *    js
 *          - array of paths of files to be executed
 *          - all executions happen on or after 'document_end'
 *
 *    allFrames (optional)
 *          - boolean value representing InjectDetails.allFrames
 *          - FALSE by default
 *
 */
define(function() {
	return [
		{
			label: 'Baidu Music',
			matches: ['*://play.baidu.com/*'],
			js: ['connectors/v2/baidu.js'],
			version: 2
		},

		{
			label: 'YouTube',
			matches: ['*://www.youtube.com/*'],
			js: ['connectors/v2/youtube.js'],
			version: 2
		},

		{
			label: 'Zen Audio Player',
			matches: ['*://zenplayer.audio/*'],
			js: ['connectors/v2/zen-audio-player.js'],
			version: 2
		},

		{
			label: 'Thesixtyone',
			matches: ['*://www.thesixtyone.com/*'],
			js: ['connectors/v2/61.js'],
			version: 2
		},

		{
			label: 'Google Play Music',
			matches: ['*://play.google.com/music/*'],
			js: ['connectors/v2/googlemusic.js'],
			version: 2
		},

		{
			label: 'MySpace',
			matches: ['*://myspace.com/*'],
			js: ['connectors/v2/myspace.js'],
			version: 2
		},

		{
			label: 'Pitchfork',
			matches: ['*://pitchfork.com/*', '*://www.pitchfork.com/*'],
			js: ['connectors/v2/pitchfork.js'],
			version: 2
		},

		{
			label: 'Ghostly Discovery',
			matches: ['http://ghostly.com/discovery/play', 'http://www.ghostly.com/discovery/play'],
			js: ['connectors/v2/ghostly.js'],
			version: 2
		},

		{
			label: 'Bandcamp',
			matches: ['*://*.bandcamp.com/*', '*://bandcamp.com/*'],
			js: ['connectors/v2/bandcamp.js'],
			version: 2
		},

		{
			label: 'Jango',
			matches: ['*://www.jango.com/*'],
			js: ['connectors/v2/jango.js'],
			allFrames: true,
			version: 2
		},

		{
			label: 'Pandora',
			matches: ['*://www.pandora.com/*'],
			js: ['connectors/v2/pandora.js'],
			version: 2
		},

		{
			label: 'pakartot',
			matches: ['*://www.pakartot.lt/*'],
			js: ['connectors/v2/pakartot.js'],
			version: 2
		},

		{
			label: 'Deezer',
			matches: ['*://www.deezer.com/*'],
			js: ['connectors/v2/deezer.js'],
			version: 2
		},

		{
			label: 'SoundCloud',
			matches: ['*://soundcloud.com/*'],
			js: ['connectors/v2/soundcloud.js'],
			version: 2
		},

		{
			label: 'Amazon',
			matches: [
				'*://www.amazon.com/gp/dmusic/cloudplayer/*',
				'*://www.amazon.de/gp/dmusic/cloudplayer/*',
				'*://www.amazon.es/gp/dmusic/cloudplayer/*',
				'*://www.amazon.co.uk/gp/dmusic/cloudplayer/*',
				'*://www.amazon.co.jp/gp/dmusic/cloudplayer/*',
				'*://music.amazon.com/*',
				'*://music.amazon.de/*',
				'*://music.amazon.es/*',
				'*://music.amazon.co.uk/*',
				'*://music.amazon.co.jp/*'],
			js: ['connectors/v2/amazon.js'],
			version: 2
		},

		{
			label: 'Amazon Echo',
			matches: ['*://alexa.amazon.com/spa/index.html#player'],
			js: ['connectors/v2/alexa.js'],
			version: 2
		},

		{
			label: 'VK',
			matches: ['*://vk.com/*'],
			js: ['connectors/v2/vk.js'],
			version: 2
		},

		{
			label: 'Zvooq',
			matches: ['*://zvooq.ru/*', '*://zvooq.com/*'],
			js: ['connectors/v2/zvooq.js'],
			version: 2
		},

		{
			label: 'Megalyrics',
			matches: ['*://megalyrics.ru/*'],
			js: ['connectors/v2/megalyrics.js'],
			allFrames: true,
			version: 2
		},

		{
			label: 'iHeartRadio',
			matches: ['*://*.iheart.com/*'],
			js: ['connectors/v2/iheartradio.js'],
			version: 2
		},

		{
			label: 'Indie Shuffle',
			matches: ['*://www.indieshuffle.com/*'],
			js: ['connectors/v2/indieshuffle.js'],
			version: 2
		},

		{
			label: 'Tuba.FM',
			matches: ['*://fm.tuba.pl/*'],
			js: ['connectors/v2/tubafm.js'],
			version: 2
		},

		{
			label: 'Spotify',
			matches: ['https://play.spotify.com/*'],
			js: ['connectors/v2/spotify-play.js'],
			version: 2
		},

		{
			label: 'plug.dj',
			matches: ['*://plug.dj/*'],
			js: ['connectors/v2/plugdj.js'],
			version: 2
		},

		{
			label: 'Slacker (main page)',
			matches: ['*://www.slacker.com/*'],
			js: ['connectors/v2/slacker2.js'],
			version: 2
		},

		{
			label: 'Daytrotter',
			matches: ['*://www.daytrotter.com/*'],
			js: ['connectors/v2/daytrotter.js'],
			version: 2
		},

		{
			label: 'AOL Radio',
			matches: ['*://aolradio.slacker.com/*'],
			js: ['connectors/v2/slacker2.js'],
			version: 2
		},

		{
			label: 'HillyDilly',
			matches: ['*://www.hillydilly.com/*'],
			js: ['connectors/v2/hillydilly.js'],
			version: 2
		},

		{
			label: 'Groove Music',
			matches: ['*://music.microsoft.com/*'],
			js: ['connectors/v2/groovemusic.js'],
			version: 2
		},

		{
			label: '8tracks',
			matches: ['*://8tracks.com/*'],
			js: ['connectors/v2/8tracks.js'],
			version: 2
		},

		{
			label: 'Moje Polskie Radio',
			matches: ['*://moje.polskieradio.pl/station/*'],
			js: ['connectors/v2/mojepolskieradio.js'],
			version: 2
		},

		{
			label: 'Nova Planet',
			matches: ['*://www.novaplanet.com/radionova/player'],
			js: ['connectors/v2/novaplanet.js'],
			version: 2
		},

		{
			label: 'Radio+ Belgium',
			matches: ['*://www.radioplus.be/*', '*://radioplus.be/*'],
			js: ['connectors/v2/radioplusbe.js'],
			version: 2
		},

		{
			label: 'Douban FM',
			matches: ['*://douban.fm/*'],
			js: ['connectors/v2/doubanfm.js'],
			version: 2
		},

		{
			label: 'Focus@Will',
			matches: ['*://www.focusatwill.com/*'],
			js: ['connectors/v2/focusatwill.js'],
			version: 2
		},

		{
			label: 'Le Tourne Disque',
			matches: ['*://www.letournedisque.com/*'],
			js: ['connectors/v2/letournedisque.js'],
			version: 2
		},

		{
			label: 'Reddit Playlister',
			matches: ['*://redditplayer.phoenixforgotten.com/*', '*://redditplaylister.phoenixforgotten.com/*'],
			js: ['connectors/v2/redditplayer.js'],
			version: 2
		},

		{
			label: 'Subphonic (owncloud plugin)',
			matches: ['*://*/*/apps/subphonic/minisub/*'],
			js: ['connectors/v2/subphonic.js'],
			version: 2
		},

		{
			label: 'Sullen-Ural',
			matches: ['*://sullen-ural.ru/*', '*://*.sullen-ural.ru/*'],
			js: ['connectors/v2/sullen-ural.js'],
			version: 2
		},

		{
			label: 'Digitally Imported',
			matches: ['*://www.di.fm/*'],
			js: ['connectors/v2/difm.js'],
			version: 2
		},

		{
			label: 'BBC RadioPlayer',
			matches: ['*://www.bbc.co.uk/radio/player/*'],
			js: ['connectors/v2/bbcradioplayer.js'],
			version: 2
		},

		{
			label: 'Gaana.com',
			matches: ['*://gaana.com/*'],
			js: ['connectors/v2/gaana.js'],
			version: 2
		},

		{
			label: 'Yandex.Music',
			matches: ['*://music.yandex.ru/*', '*://music.yandex.by/*', '*://music.yandex.kz/*', '*://music.yandex.ua/*'],
			js: ['connectors/v2/yandex.js'],
			version: 2
		},

		{
			label: 'PLEX',
			matches: ['*://*32400/web/*', '*://plex.tv/web/*', '*://*.plex.tv/web/*'],
			js: ['connectors/v2/plex.js'],
			version: 2
		},

		{
			label: 'Prostopleer',
			matches: ['*://pleer.net/*'],
			js: ['connectors/v2/pleer.js'],
			version: 2
		},

		{
			label: 'TuneIn',
			matches: ['*://tunein.com/*'],
			js: ['connectors/v2/tunein.js'],
			version: 2
		},

		{
			label: 'MixCloud (Timestamped mixes only)',
			matches: ['*://mixcloud.com/*', '*://*.mixcloud.com/*'],
			js: ['connectors/v2/mixcloud.js'],
			version: 2
		},

		{
			label: 'ReverbNation',
			matches: ['*://www.reverbnation.com/*'],
			js: ['connectors/v2/reverbnation.js'],
			version: 2
		},

		{
			label: 'Xiami.com',
			matches: ['http://www.xiami.com/play*'],
			js: ['connectors/v2/xiami.js'],
			version: 2
		},

		{
			label: 'NRK Radio',
			matches: ['*://radio.nrk.no/*'],
			js: ['connectors/v2/nrkradio.js'],
			version: 2
		},

		{
			label: 'Archive.org',
			matches: ['*://archive.org/details/*'],
			js: ['connectors/v2/archive.js'],
			version: 2
		},

		{
			label: 'Odnoklassniki',
			matches: ['*://odnoklassniki.ru/*', '*://ok.ru/*'],
			js: ['connectors/v2/odnoklassniki.js'],
			allFrames: true,
			version: 2
		},

		{
			label: 'Soundozer',
			matches: ['*://soundozer.com/*'],
			js: ['connectors/v2/soundozer.js'],
			version: 2
		},

		{
			label: '163 Music',
			matches: ['*://music.163.com/*'],
			js: ['connectors/v2/163music.js'],
			version: 2
		},

		{
			label: 'luooMusic',
			matches: ['*://www.luoo.net/*'],
			js: ['connectors/v2/luoo.js'],
			version: 2
		},

		{
			label: 'ambientsleepingpill',
			matches: ['*://ambientsleepingpill.com/'],
			js: ['connectors/v2/ambientsleepingpill.js'],
			version: 2
		},

		{
			label: 'TIDAL',
			matches: ['*://listen.tidalhifi.com/*', '*://listen.tidal.com/*'],
			js: ['connectors/v2/tidal.js'],
			version: 2
		},

		{
			label: 'Hype Machine',
			matches: ['*://hypem.com/*'],
			js: ['connectors/v2/hypem.js'],
			version: 2
		},

		{
			label: 'Radionomy',
			matches: ['*://www.radionomy.com/*'],
			js: ['connectors/v2/radionomy.js'],
			version: 2
		},

		{
			label: 'Jazzandrain / Relaxingbeats / Epicmusictime / Holidaychristmasmusic',
			matches: ['*://www.jazzandrain.com/*', '*://relaxingbeats.com/*', '*://epicmusictime.com/*', '*://www.holidaychristmasmusic.com/*', '*://holidaychristmasmusic.com/*'],
			js: ['connectors/v2/jazzandrain.js'],
			version: 2
		},

		{
			label: 'AccuJazz',
			matches: ['*://www.accuradio.com/pop_player/accujazz/*'],
			js: ['connectors/v2/accujazz.js'],
			version: 2
		},

		{
			label: 'AccuRadio',
			matches: ['*://www.accuradio.com/*'],
			js: ['connectors/v2/accuradio.js'],
			version: 2
		},

		{
			label: 'RAW.FM',
			matches: ['*://www.rawfm.com.au/stream/player*/', '*://rawfm.com.au/stream/player*/'],
			js: ['connectors/v2/rawfm.js'],
			version: 2
		},

		{
			label: 'Imusic.am',
			matches: ['*://imusic.am/*'],
			js: ['connectors/v2/imusic.am.js'],
			version: 2
		},

		{
			label: 'GoEar.Com',
			matches: ['*://*.goear.com/*', '*://goear.com/*'],
			js: ['connectors/v2/goear.com.js'],
			version: 2
		},

		{
			label: 'Wrzuta.pl',
			matches: ['*://*.wrzuta.pl/*', '*://wrzuta.pl/*'],
			js: ['connectors/v2/wrzuta.pl.js'],
			version: 2
		},

		{
			label: 'Earbits',
			matches: ['*://www.earbits.com/*'],
			js: ['connectors/v2/earbits.js'],
			version: 2
		},

		{
			label: 'Player.fm',
			matches: ['*://player.fm/*'],
			js: ['connectors/v2/player.fm.js'],
			version: 2
		},

		{
			label: 'SNDTST',
			matches: ['*://www.sndtst.com/*', '*://sndtst.com/*'],
			js: ['connectors/v2/sndtst.js'],
			version: 2
		},

		{
			label: 'ThisIsMyJam',
			matches: ['*://www.thisismyjam.com/*'],
			js: ['connectors/v2/thisismyjam.js'],
			version: 2
		},

		{
			label: 'Wonder.fm',
			matches: ['*://wonder.fm/*', '*://white-label.fm/*', '*://primary.fm/*'],
			js: ['connectors/v2/wonder.fm.js'],
			version: 2
		},

		{
			label: 'RadioTunes',
			matches: ['*://www.radiotunes.com/*'],
			js: ['connectors/v2/radiotunes.js'],
			version: 2
		},

		{
			label: 'RockRadio',
			matches: ['*://www.rockradio.com/*'],
			js: ['connectors/v2/radiotunes.js'],
			version: 2
		},

		{
			label: 'ClassicalRadio',
			matches: ['*://www.classicalradio.com/*'],
			js: ['connectors/v2/radiotunes.js'],
			version: 2
		},

		{
			label: 'Radio.com',
			matches: ['*://player.radio.com*'],
			js: ['connectors/v2/radio.com.js'],
			version: 2
		},

		{
			label: 'M2FR',
			matches: ['*://www.m2radio.fr/*'],
			js: ['connectors/v2/m2fr.js'],
			version: 2
		},

		{
			label: 'GetWorkDoneMusic',
			matches: ['*://www.getworkdonemusic.com/*', '*://getworkdonemusic.com/*'],
			js: ['connectors/v2/getworkdonemusic.js'],
			version: 2
		},

		{
			label: 'Stereodose',
			matches: ['*://www.stereodose.com/*'],
			js: ['connectors/v2/stereodose.js'],
			version: 2
		},

		{
			label: 'Москва ФМ / Питер ФМ',
			matches: ['*://moskva.fm/*', '*://piter.fm/*'],
			js: ['connectors/v2/moskva-piter-fm.js'],
			version: 2
		},

		{
			label: 'Jamendo',
			matches: ['*://www.jamendo.com/*'],
			js: ['connectors/v2/jamendo.js'],
			version: 2
		},

		{
			label: 'Whyd',
			matches: ['*://whyd.com/*'],
			js: ['connectors/v2/whyd.js'],
			version: 2
		},

		{
			label: 'Mymusiccloud',
			matches: ['*://www.mymusiccloud.com/*'],
			js: ['connectors/v2/mymusiccloud.js'],
			version: 2
		},

		{
			label: 'Bandzone.cz',
			matches: ['*://bandzone.cz/*'],
			js: ['connectors/v2/bandzone.cz.js'],
			version: 2
		},

		{
			label: 'Driveplayer.com',
			matches: ['*://www.driveplayer.com/*'],
			js: ['connectors/v2/driveplayer.com.js'],
			version: 2
		},

		{
			label: 'Chorus',
			js: ['connectors/v2/chorus.js'],
			version: 2
		},

		{
			label: 'Superplayer.fm',
			matches: ['*://www.superplayer.fm/*'],
			js: ['connectors/v2/superplayer.fm.js'],
			version: 2
		},

		{
			label: 'RMFON',
			matches: ['*://www.rmfon.pl/*', '*://rmfon.pl/*'],
			js: ['connectors/v2/rmfon.js'],
			version: 2
		},

		{
			label: 'Ampya',
			matches: ['*://ampya.com/*'],
			js: ['connectors/v2/ampya.js'],
			version: 2
		},

		{
			label: 'Jolicloud',
			matches: ['*://drive.jolicloud.com/*'],
			js: ['connectors/v2/jolicloud.js'],
			version: 2
		},

		{
			label: 'RADIO Обозреватель',
			matches: ['*://radio.obozrevatel.com/*'],
			js: ['connectors/v2/obozrevatel.js'],
			version: 2
		},

		{
			label: 'SlashFavorites',
			matches: ['*://slashfavorites.com/*'],
			js: ['connectors/v2/slashfavorites.js'],
			version: 2
		},

		{
			label: 'Solayo',
			matches: ['*://www.solayo.com/*', '*://solayo.com/*'],
			js: ['connectors/v2/solayo.js'],
			version: 2
		},

		{
			label: 'Jazzradio',
			matches: ['*://www.jazzradio.com/*'],
			js: ['connectors/v2/radiotunes.js'],
			version: 2
		},

		{
			label: 'FarFromMoscow',
			matches: ['*://www.farfrommoscow.com/*'],
			js: ['connectors/v2/farfrommoscow.js'],
			version: 2
		},

		{
			label: 'Musicload',
			matches: ['*://www.musicload.de/*'],
			js: ['connectors/v2/musicload.js'],
			version: 2
		},

		{
			label: 'Noon Pacific',
			matches: ['*://noonpacific.com/*', '*://collection.noonpacific.com/*'],
			js: ['connectors/v2/noonpacific.js'],
			version: 2
		},

		{
			label: 'SomaFM',
			matches: ['*://somafm.com/player/*'],
			js: ['connectors/v2/somafm.js'],
			version: 2
		},

		{
			label: 'Noisetrade',
			matches: ['*://www.noisetrade.com/*', '*://noisetrade.com/*'],
			js: ['connectors/v2/noisetrade.js'],
			version: 2
		},

		{
			label: 'Free Music Archive',
			matches: ['*://www.freemusicarchive.org/*', '*://freemusicarchive.org/*', '*://www.freemusicarchive.com/*', '*://freemusicarchive.com/*'],
			js: ['connectors/v2/freemusicarchive.js'],
			version: 2
		},

		{
			label: 'musicase',
			matches: ['*://musicase.me/*'],
			js: ['connectors/v2/musicase.js'],
			version: 2
		},

		{
			label: 'Reddit Music Player',
			matches: ['*://reddit.musicplayer.io/'],
			js: ['connectors/v2/redditmusicplayer.js'],
			version: 2
		},

		{
			label: 'kollekt.fm',
			matches: ['*://kollekt.fm/*'],
			js: ['connectors/v2/kollekt.js'],
			version: 2
		},

		{
			label: 'audiosplitter.fm',
			matches: ['*://audiosplitter.fm/*'],
			js: ['connectors/v2/audiosplitter.js'],
			version: 2
		},

		{
			label: 'novoeradio.by',
			matches: ['*://www.novoeradio.by/*'],
			js: ['connectors/v2/novoeradio.js'],
			version: 2
		},

		{
			label: 'Tradiio',
			matches: ['*://tradiio.com/*', '*://*.tradiio.com/*'],
			js: ['connectors/v2/tradiio.js'],
			version: 2
		},

		{
			label: 'Yandex radio',
			matches: ['https://radio.yandex.ru/*', 'https://radio.yandex.by/*', 'https://radio.yandex.kz/*', 'https://radio.yandex.ua/*'],
			js: ['connectors/v2/yandexradio.js'],
			version: 2
		},

		{
			label: 'Dash Radio',
			matches: ['*://dashradio.com/*'],
			js: ['connectors/v2/dashradio.js'],
			version: 2
		},

		{
			label: 'oplayer',
			matches: ['*://oplayer.org/*'],
			js: ['connectors/v2/jplayer-oplayer.js'],
			version: 2
		},

		{
			label: 'post-player',
			matches: ['*://post-player.org/*'],
			js: ['connectors/v2/jplayer-postplayer.js'],
			version: 2
		},

		{
			label: 'Dream FM',
			matches: ['*://dreamfm.biz/*'],
			js: ['connectors/v2/dreamfm.js'],
			version: 2
		},
		{
			label: 'Ego FM',
			matches: ['*://www.egofm.de/*', '*://player.addradio.de/player/2366*'],
			js: ['connectors/v2/ego-fm.js'],
			version: 2
		},

		{
			label: 'Radio Paradise',
			matches: ['*://*.radioparadise.com/*'],
			js: ['connectors/v2/radioparadise.js'],
			allFrames: true,
			version: 2
		},

		{
			label: 'Beatport',
			matches: ['*://www.beatport.com/*'],
			js: ['connectors/v2/beatport-www.js'],
			version: 2
		},

		{
			label: 'themusicninja',
			matches: ['*://www.themusicninja.com/*'],
			js: ['connectors/v2/themusicninja.js'],
			version: 2
		},

		{
			label: 'trntbl.me',
			matches: ['*://*.trntbl.me/*', '*://trntbl.me/*'],
			js: ['connectors/v2/trntblme.js'],
			version: 2
		},

		{
			label: 'wavo.me',
			matches: ['https://wavo.me/*'],
			js: ['connectors/v2/wavome.js'],
			version: 2
		},

		{
			label: 'WDVX',
			matches: ['http://wdvx.com/listen-live/'],
			js: ['connectors/v2/wdvx.js'],
			version: 2
		},

		{
			label: 'dubtrack.fm',
			matches: ['https://www.dubtrack.fm/*'],
			js: ['connectors/v2/dubtrack.js'],
			version: 2
		},

		{
			label: 'FluxFM Berlin',
			matches: ['*://www.fluxfm.de/stream/*'],
			js: ['connectors/v2/flux-fm.js'],
			version: 2
		},

		{
			label: 'cubic.fm',
			matches: ['http://cubic.fm/*'],
			js: ['connectors/v2/cubicfm.js'],
			version: 2
		},

		{
			label: 'Noise FM',
			matches: ['https://noisefm.ru/*'],
			js: ['connectors/v2/noisefm.js'],
			allFrames: true,
			version: 2
		},

		{
			label: 'WWOZ',
			matches: ['*://www.wwoz.org/listen/player/*'],
			js: ['connectors/v2/wwoz.js'],
			version: 2
		},

		{
			label: 'Sonerezh',
			matches: ['*://sonerezh.*/*', '*://*/*sonerezh*'],
			js: ['connectors/v2/sonerezh.js'],
			version: 2
		},

		{
			label: 'Evropa 2',
			matches: ['*://onair.evropa2.cz*'],
			js: ['connectors/v2/evropa2cz.js'],
			version: 2
		},

		{
			label: 'Europa 2',
			matches: ['*://onair.europa2.sk*'],
			js: ['connectors/v2/evropa2cz.js'],
			version: 2
		},

		{
			label: 'Frekvence 1',
			matches: ['*://vysilani.frekvence1.cz/*'],
			js: ['connectors/v2/frekvence1cz.js'],
			version: 2
		},

		{
			label: 'Youradio',
			matches: ['*://*youradio.cz/*'],
			js: ['connectors/v2/youradiocz.js'],
			version: 2
		},

		{
			label: 'Dance radio',
			matches: ['*://*danceradio.cz/*'],
			js: ['connectors/v2/danceradiocz.js'],
			version: 2
		},

		{
			label: 'Rádio Bonton',
			matches: ['*://*radiobonton.cz/*'],
			js: ['connectors/v2/danceradiocz.js'],
			version: 2
		},

		{
			label: 'GPMusic',
			matches: ['*://player.gpmusic.co/*'],
			js: ['connectors/v2/gpmusic.js'],
			version: 2
		},

		{
			label: 'Youtube Jukebox',
			matches: ['http://youtube.nestharion.de/*'],
			js: ['connectors/v2/yt-jukebox.js'],
			version: 2
		},

		{
			label: 'Nightwave Plaza',
			matches: ['https://plaza.one/*'],
			js: ['connectors/v2/nightwaveplaza.js'],
			version: 2
		},

		{
			label: 'Youtubify',
			matches: ['*://youtubify.vebto.com/*'],
			js: ['connectors/v2/bemusic.js'],
			version: 2
		},

		{
			label: 'Paste Radio',
			matches: ['*://www.pastemagazine.com/radio*'],
			js: ['connectors/v2/pasteradio.js'],
			version: 2
		},

		{
			label: 'Genie',
			matches: ['http://www.genie.co.kr/player/fPlayer'],
			js: ['connectors/v2/genie.js'],
			version: 2
		},

		{
			label: 'Tidido',
			matches: ['*://tidido.com/*'],
			js: ['connectors/v2/tidido.js'],
			version: 2
		},

		{
			label: 'Playmoss',
			matches: ['https://playmoss.com/*'],
			js: ['connectors/v2/playmoss.js'],
			version: 2
		},

		{
			label: 'Apidog',
			matches: ['*://apidog.ru/*'],
			js: ['connectors/v2/apidog.js'],
			version: 2
		},
		{
			label: 'RBMA Radio',
			matches: ['https://www.rbmaradio.com/*'],
			js: ['connectors/v2/rbmaradio.js'],
			version: 2
		},

		{
			label: 'GrooveMP3',
			matches: ['*://groovemp3.com/*', '*://www.groovemp3.com/*'],
			js: ['connectors/v2/bemusic.js'],
			version: 2
		},

		{
			label: 'Pinguin Radio',
			matches: [
				'*://pinguinradio.com/',
				'*://pinguinplayer.com/*',
				'*://www.pinguinplayer.com/*',
			],
			js: ['connectors/v2/pinguinradio.js'],
			version: 2
		},

		{
			label: 'TRT Türkü',
			matches: ['*://*trtturku.net/*'],
			js: ['connectors/v2/trtturku.js'],
			version: 2
		}
	];
});
