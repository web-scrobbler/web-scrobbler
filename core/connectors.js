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
define(function () {
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
		js: ['connectors/zen-audio-player.js'],
	},

	{
		label: 'Thesixtyone',
		matches: ['*://www.thesixtyone.com/*'],
		js: ['connectors/61.js'],
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
		js: ['connectors/jango.js'],
		allFrames: true,
	},

	{
		label: 'Pandora',
		matches: ['*://www.pandora.com/*'],
		js: ['connectors/pandora.js'],
	},

	{
		label: 'pakartot',
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
			'*://www.amazon.com/gp/dmusic/cloudplayer/*',
			'*://www.amazon.de/gp/dmusic/cloudplayer/*',
			'*://www.amazon.es/gp/dmusic/cloudplayer/*',
			'*://www.amazon.co.uk/gp/dmusic/cloudplayer/*',
			'*://www.amazon.co.jp/gp/dmusic/cloudplayer/*',
			'*://music.amazon.com/*',
			'*://music.amazon.de/*',
			'*://music.amazon.es/*',
			'*://music.amazon.co.uk/*',
			'*://music.amazon.co.jp/*'
		],
		js: ['connectors/amazon.js'],
	},

	{
		label: 'Amazon Echo',
		matches: ['*://alexa.amazon.*/spa/*'],
		js: ['connectors/alexa.js'],
	},

	{
		label: 'VK',
		matches: ['*://vk.com/*'],
		js: ['connectors/vk.js'],
	},

	{
		label: 'Zvooq',
		matches: ['*://zvooq.ru/*', '*://zvooq.com/*'],
		js: ['connectors/zvooq.js'],
	},

	{
		label: 'Megalyrics',
		matches: ['*://megalyrics.ru/*'],
		js: ['connectors/megalyrics.js'],
		allFrames: true,
	},

	{
		label: 'iHeartRadio',
		matches: ['*://*.iheart.com/*'],
		js: ['connectors/iheartradio.js'],
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
		matches: ['https://play.spotify.com/*'],
		js: ['connectors/spotify-play.js'],
	},

	{
		label: 'Spotify (Open)',
		matches: ['https://open.spotify.com/*'],
		js: ['connectors/spotify-open.js'],
	},

	{
		label: 'plug.dj',
		matches: ['*://plug.dj/*'],
		js: ['connectors/plugdj.js'],
	},

	{
		label: 'Slacker (main page)',
		matches: ['*://www.slacker.com/*'],
		js: ['connectors/slacker2.js'],
	},

	{
		label: 'Daytrotter',
		matches: ['*://www.daytrotter.com/*'],
		js: ['connectors/daytrotter.js'],
	},

	{
		label: 'AOL Radio',
		matches: ['*://aolradio.slacker.com/*'],
		js: ['connectors/slacker2.js'],
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
		js: ['connectors/mojepolskieradio.js'],
	},

	{
		label: 'Nova Planet',
		matches: ['*://www.novaplanet.com/radionova/player'],
		js: ['connectors/novaplanet.js'],
	},

	{
		label: 'Radio+ Belgium',
		matches: ['*://www.radioplus.be/*', '*://radioplus.be/*'],
		js: ['connectors/radioplusbe.js'],
	},

	{
		label: 'Douban FM',
		matches: ['*://douban.fm/*'],
		js: ['connectors/doubanfm.js'],
	},

	{
		label: 'Focus@Will',
		matches: ['*://www.focusatwill.com/*'],
		js: ['connectors/focusatwill.js'],
	},

	{
		label: 'Le Tourne Disque',
		matches: ['*://www.letournedisque.com/*'],
		js: ['connectors/letournedisque.js'],
	},

	{
		label: 'Reddit Playlister',
		matches: ['*://redditplayer.phoenixforgotten.com/*', '*://redditplaylister.phoenixforgotten.com/*'],
		js: ['connectors/redditplayer.js'],
	},

	{
		label: 'Subphonic (owncloud plugin)',
		matches: ['*://*/*/apps/subphonic/minisub/*'],
		js: ['connectors/subphonic.js'],
	},

	{
		label: 'Sullen-Ural',
		matches: ['*://sullen-ural.ru/*', '*://*.sullen-ural.ru/*'],
		js: ['connectors/sullen-ural.js'],
	},

	{
		label: 'Digitally Imported',
		matches: ['*://www.di.fm/*'],
		js: ['connectors/difm.js'],
	},

	{
		label: 'BBC RadioPlayer',
		matches: ['*://www.bbc.co.uk/radio/player/*'],
		js: ['connectors/bbcradioplayer.js'],
	},

	{
		label: 'Gaana.com',
		matches: ['*://gaana.com/*'],
		js: ['connectors/gaana.js'],
	},

	{
		label: 'Yandex.Music',
		matches: ['*://music.yandex.ru/*', '*://music.yandex.by/*', '*://music.yandex.kz/*', '*://music.yandex.ua/*'],
		js: ['connectors/yandex.js'],
	},

	{
		label: 'PLEX',
		matches: ['*://*32400/web/*', '*://plex.tv/web/*', '*://*.plex.tv/web/*'],
		js: ['connectors/plex.js'],
	},

	{
		label: 'Prostopleer',
		matches: ['*://pleer.net/*'],
		js: ['connectors/pleer.js'],
	},

	{
		label: 'TuneIn',
		matches: ['*://tunein.com/*'],
		js: ['connectors/tunein.js'],
	},

	{
		label: 'MixCloud (Timestamped mixes only)',
		matches: ['*://mixcloud.com/*', '*://*.mixcloud.com/*'],
		js: ['connectors/mixcloud.js'],
	},

	{
		label: 'ReverbNation',
		matches: ['*://www.reverbnation.com/*'],
		js: ['connectors/reverbnation.js'],
	},

	{
		label: 'Xiami.com',
		matches: ['http://www.xiami.com/play*'],
		js: ['connectors/xiami.js'],
	},

	{
		label: 'NRK Radio',
		matches: ['*://radio.nrk.no/*'],
		js: ['connectors/nrkradio.js'],
	},

	{
		label: 'Archive.org',
		matches: ['*://archive.org/details/*'],
		js: ['connectors/archive.js'],
	},

	{
		label: 'Odnoklassniki',
		matches: ['*://odnoklassniki.ru/*', '*://ok.ru/*'],
		js: ['connectors/odnoklassniki.js'],
		allFrames: true,
	},

	{
		label: '163 Music',
		matches: ['*://music.163.com/*'],
		js: ['connectors/163music.js'],
	},

	{
		label: 'luooMusic',
		matches: ['*://www.luoo.net/*'],
		js: ['connectors/luoo.js'],
	},

	{
		label: 'ambientsleepingpill',
		matches: ['*://ambientsleepingpill.com/'],
		js: ['connectors/ambientsleepingpill.js'],
	},

	{
		label: 'TIDAL',
		matches: ['*://listen.tidalhifi.com/*', '*://listen.tidal.com/*'],
		js: ['connectors/tidal.js'],
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
		label: 'Jazzandrain',
		matches: ['*://www.jazzandrain.com/*'],
		js: ['connectors/jazzandrain.js'],
	},

	{
		label: 'Relaxingbeats',
		matches: ['*://relaxingbeats.com/*'],
		js: ['connectors/jazzandrain.js'],
	},

	{
		label: 'Epicmusictime',
		matches: ['*://epicmusictime.com/*'],
		js: ['connectors/jazzandrain.js'],
	},

	{
		label: 'Holidaychristmasmusic',
		matches: ['*://www.holidaychristmasmusic.com/*', '*://holidaychristmasmusic.com/*'],
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
		label: 'GoEar.Com',
		matches: ['*://*.goear.com/*', '*://goear.com/*'],
		js: ['connectors/goear.com.js'],
	},

	{
		label: 'Wrzuta.pl',
		matches: ['*://*.wrzuta.pl/*', '*://wrzuta.pl/*'],
		js: ['connectors/wrzuta.pl.js'],
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
		label: 'ThisIsMyJam',
		matches: ['*://www.thisismyjam.com/*'],
		js: ['connectors/thisismyjam.js'],
	},

	{
		label: 'Wonder.fm',
		matches: ['*://wonder.fm/*', '*://white-label.fm/*', '*://primary.fm/*'],
		js: ['connectors/wonder.fm.js'],
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
		label: 'M2FR',
		matches: ['*://www.m2radio.fr/*'],
		js: ['connectors/m2fr.js'],
	},

	{
		label: 'GetWorkDoneMusic',
		matches: ['*://www.getworkdonemusic.com/*', '*://getworkdonemusic.com/*'],
		js: ['connectors/getworkdonemusic.js'],
	},

	{
		label: 'Москва ФМ / Питер ФМ',
		matches: ['*://moskva.fm/*', '*://piter.fm/*'],
		js: ['connectors/moskva-piter-fm.js'],
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
		label: 'Mymusiccloud',
		matches: ['*://www.mymusiccloud.com/*'],
		js: ['connectors/mymusiccloud.js'],
	},

	{
		label: 'Bandzone.cz',
		matches: ['*://bandzone.cz/*'],
		js: ['connectors/bandzone.cz.js'],
	},

	{
		label: 'Driveplayer.com',
		matches: ['*://www.driveplayer.com/*'],
		js: ['connectors/driveplayer.com.js'],
	},

	{
		label: 'Chorus',
		js: ['connectors/chorus.js'],
	},

	{
		label: 'Superplayer.fm',
		matches: ['*://www.superplayer.fm/*'],
		js: ['connectors/superplayer.fm.js'],
	},

	{
		label: 'RMFON',
		matches: ['*://www.rmfon.pl/*', '*://rmfon.pl/*'],
		js: ['connectors/rmfon.js'],
	},

	{
		label: 'Ampya',
		matches: ['*://ampya.com/*'],
		js: ['connectors/ampya.js'],
	},

	{
		label: 'Jolicloud',
		matches: ['*://drive.jolicloud.com/*'],
		js: ['connectors/jolicloud.js'],
	},

	{
		label: 'RADIO Обозреватель',
		matches: ['*://radio.obozrevatel.com/*'],
		js: ['connectors/obozrevatel.js'],
	},

	{
		label: 'SlashFavorites',
		matches: ['*://slashfavorites.com/*'],
		js: ['connectors/slashfavorites.js'],
	},

	{
		label: 'Solayo',
		matches: ['*://www.solayo.com/*', '*://solayo.com/*'],
		js: ['connectors/solayo.js'],
	},

	{
		label: 'Jazzradio',
		matches: ['*://www.jazzradio.com/*'],
		js: ['connectors/radiotunes.js'],
	},

	{
		label: 'FarFromMoscow',
		matches: ['*://www.farfrommoscow.com/*'],
		js: ['connectors/farfrommoscow.js'],
	},

	{
		label: 'Musicload',
		matches: ['*://www.musicload.de/*'],
		js: ['connectors/musicload.js'],
	},

	{
		label: 'Noon Pacific',
		matches: ['*://noonpacific.com/*', '*://collection.noonpacific.com/*'],
		js: ['connectors/noonpacific.js'],
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
		label: 'kollekt.fm',
		matches: ['*://kollekt.fm/*', '*://*.kollekt.fm/*'],
		js: ['connectors/kollekt.js'],
	},

	{
		label: 'novoeradio.by',
		matches: ['*://www.novoeradio.by/*'],
		js: ['connectors/novoeradio.js'],
	},

	{
		label: 'Tradiio',
		matches: ['*://tradiio.com/*', '*://*.tradiio.com/*'],
		js: ['connectors/tradiio.js'],
	},

	{
		label: 'Yandex radio',
		matches: ['https://radio.yandex.ru/*', 'https://radio.yandex.by/*', 'https://radio.yandex.kz/*', 'https://radio.yandex.ua/*'],
		js: ['connectors/yandexradio.js'],
	},

	{
		label: 'Dash Radio',
		matches: ['*://dashradio.com/*'],
		js: ['connectors/dashradio.js'],
	},

	{
		label: 'post-player',
		matches: ['*://post-player.org/*'],
		js: ['connectors/jplayer-postplayer.js'],
	},

	{
		label: 'Dream FM',
		matches: ['*://dreamfm.biz/*'],
		js: ['connectors/dreamfm.js'],
	},
	{
		label: 'Ego FM',
		matches: ['*://www.egofm.de/*', '*://player.addradio.de/player/2366*'],
		js: ['connectors/ego-fm.js'],
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
		label: 'themusicninja',
		matches: ['*://www.themusicninja.com/*'],
		js: ['connectors/themusicninja.js'],
	},

	{
		label: 'trntbl.me',
		matches: ['*://*.trntbl.me/*', '*://trntbl.me/*'],
		js: ['connectors/trntblme.js'],
	},

	{
		label: 'wavo.me',
		matches: ['https://wavo.me/*'],
		js: ['connectors/wavome.js'],
	},

	{
		label: 'dubtrack.fm',
		matches: ['https://www.dubtrack.fm/*'],
		js: ['connectors/dubtrack.js'],
	},

	{
		label: 'FluxFM Berlin',
		matches: ['*://www.fluxfm.de/stream/*'],
		js: ['connectors/flux-fm.js'],
	},

	{
		label: 'cubic.fm',
		matches: ['http://cubic.fm/*'],
		js: ['connectors/cubicfm.js'],
	},

	{
		label: 'Noise FM',
		matches: ['https://noisefm.ru/*'],
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
		js: ['connectors/evropa2cz.js'],
	},

	{
		label: 'Europa 2',
		matches: ['*://onair.europa2.sk*'],
		js: ['connectors/evropa2cz.js'],
	},

	{
		label: 'Frekvence 1',
		matches: ['*://vysilani.frekvence1.cz/*'],
		js: ['connectors/frekvence1cz.js'],
	},

	{
		label: 'Youradio',
		matches: ['*://*youradio.cz/*'],
		js: ['connectors/youradiocz.js'],
	},

	{
		label: 'Dance radio',
		matches: ['*://*danceradio.cz/*'],
		js: ['connectors/danceradiocz.js'],
	},

	{
		label: 'Rádio Bonton',
		matches: ['*://*radiobonton.cz/*'],
		js: ['connectors/danceradiocz.js'],
	},

	{
		label: 'GPMusic',
		matches: ['*://player.gpmusic.co/*'],
		js: ['connectors/gpmusic.js'],
	},

	{
		label: 'Youtube Jukebox',
		matches: ['http://youtube.nestharion.de/*'],
		js: ['connectors/yt-jukebox.js'],
	},

	{
		label: 'Nightwave Plaza',
		matches: ['https://plaza.one/*'],
		js: ['connectors/nightwaveplaza.js'],
	},

	{
		label: 'Retrowave',
		matches: ['http://retrowave.ru/*'],
		js: ['connectors/retrowave.js'],
	},

	{
		label: 'Youtubify',
		matches: ['*://youtubify.vebto.com/*'],
		js: ['connectors/bemusic.js'],
	},

	{
		label: 'Paste Radio',
		matches: ['*://www.pastemagazine.com/radio*'],
		js: ['connectors/pasteradio.js'],
	},

	{
		label: 'Genie',
		matches: ['http://www.genie.co.kr/player/fPlayer*'],
		js: ['connectors/genie.js'],
	},

	{
		label: 'Tidido',
		matches: ['*://tidido.com/*'],
		js: ['connectors/tidido.js'],
	},

	{
		label: 'Playmoss',
		matches: ['https://playmoss.com/*'],
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
		js: ['connectors/rbmaradio.js'],
	},

	{
		label: 'GrooveMP3',
		matches: ['*://groovemp3.com/*', '*://www.groovemp3.com/*'],
		js: ['connectors/bemusic.js'],
	},

	{
		label: 'London Burning',
		matches: ['*://londonbu.fastcast4u.com/'],
		js: ['connectors/londonburning.js'],
	},

	{
		label: 'Pinguin Radio',
		matches: [
			'*://pinguinradio.com/',
			'*://pinguinplayer.com/*',
			'*://www.pinguinplayer.com/*',
		],
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
		js: ['connectors/mailrumusic.js'],
	},

	{
		label: 'Emby',
		matches: ['*://*8096/web/*', '*://*8920/web/*', '*://app.emby.media/*'],
		js: ['connectors/emby.js'],
	},

	{
		label: 'Freegal',
		matches: ['*://*.freegalmusic.com/*'],
		js: ['connectors/freegal.js'],
	},

	{
		label: 'Joy.fm',
		matches: ['https://myradiomatic.com/player/joyfm/player.htm'],
		js: ['connectors/joy.js'],
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
		js: ['connectors/listen.js'],
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
	}];
});
