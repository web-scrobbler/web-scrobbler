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
			js: ['connectors/baidu.js']
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
			label: 'Fizy',
			matches: ['*://fizy.com/*', '*://fizy.org/*'],
			js: ['connectors/fizy.js']
		},

		{
			label: 'Virgin Radio Turkiye',
			matches: ['*://*.virginradioturkiye.com/*', '*://*.radioeksen.com/*'],
			js: ['connectors/virginradiotr.js']
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
				'*://music.amazon.com/*',
				'*://music.amazon.de/*',
				'*://music.amazon.es/*',
				'*://music.amazon.co.uk/*'],
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
			label: 'Weborama',
			matches: ['*://www.weborama.fm/*'],
			js: ['connectors/weborama.js'],
			allFrames: true
		},

		{
			label: '22 Tracks',
			matches: ['*://22tracks.com/*'],
			js: ['connectors/v2/22tracks.js'],
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
			js: ['connectors/daytrotter.js']
		},

		{
			label: 'AOL Radio',
			matches: ['*://aolradio.slacker.com/*'],
			js: ['connectors/v2/aolradio.js'],
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
			label: 'Douban Programme',
			matches: ['http://music.douban.com/programme/*'],
			js: ['connectors/douban-programme.js']
		},

		{
			label: 'Focus@Will',
			matches: ['*://www.focusatwill.com/*'],
			js: ['connectors/focusatwill.js']
		},

		{
			label: 'Le Tourne Disque',
			matches: ['*://www.letournedisque.com/*'],
			js: ['connectors/v2/letournedisque.js'],
			version: 2
		},

		{
			label: 'Reddit Playlister',
			matches: ['*://redditplayer.phoenixforgotten.com/*'],
			js: ['connectors/redditplayer.js']
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
			js: ['connectors/sullen-ural.js']
		},

		{
			label: 'Digitally Imported',
			matches: ['*://www.di.fm/*'],
			js: ['connectors/v2/difm.js'],
			version: 2
		},

		{
			label: 'RadioPlayer',
			matches: ['*://www.thisisstar.co.uk/*', '*://live.thebridgeradio.net/*', '*://www.chorley.fm/*', '*://www.sun-fm.com/*', '*://www.minsterfm.com/*', '*://www.uckfieldfm.co.uk/*', '*://radioplayer.bishopfm.com/*', '*://player.jackbristol.com/*', '*://player.106jack.com/*', '*://player.jackradio.com/*', '*://www.tcrfm.co.uk/*', '*://sparksunderland.com/*', '*://player.juicefm.com/*', '*://rp.xrad.io/*', '*://www.radiojackie.com/*', '*://people.bath.ac.uk/*', '*://www.2br.co.uk/*', '*://player.three.fm/*', '*://player.therevolution962.com/*', '*://player.thewave.co.uk/*', '*://www.kcclive.com/*', '*://player.absoluteradio.co.uk/*', '*://aliveradio.net/*', '*://allfm.org/*', '*://www.amazingradio.com/*', '*://www.ambersoundfm.com/*', '*://player.bailriggfm.co.uk/*', '*://player.thebay.co.uk/*', '*://www.bcbradio.co.uk/*', '*://www.thebeach.co.uk/*', '*://www.thebee.co.uk/*', '*://www.bfbs.com/*', '*://player.boltonfm.com/*', '*://andoverplayer.thebreeze.com/*', '*://basingstokeplayer.thebreeze.com/*', '*://bristolplayer.thebreeze.com/*', '*://cheltenhamplayer.thebreeze.com/*', '*://easthampshireplayer.thebreeze.com/*', '*://westwiltsplayer.thebreeze.com/*', '*://newburyplayer.thebreeze.com/*', '*://northdorsetplayer.thebreeze.com/*', '*://northsomersetplayer.thebreeze.com/*', '*://southplayer.thebreeze.com/*', '*://southamptonplayer.thebreeze.com/*', '*://winchesterplayer.thebreeze.com/*', '*://southsomersetplayer.thebreeze.com/*', '*://bridge.fm/*', '*://www.capitalfm.com/*', '*://www.capitalxtra.com/*', '*://www.thecatradio.co.uk/*', '*://ukradioplayer.cfmradio.com/*', '*://www.southendandchelmsfordradio.com/*', '*://www.silk1069.com/*', '*://www.dee1063.com/*', '*://app.musicradio.com/*', '*://ukradioplayer.citytalk.fm/*', '*://www.classicfm.com/*', '*://ukradioplayer.clyde1.com/*', '*://ukradioplayer.clyde2.com/*', '*://player.compassfm.co.uk/*', '*://northamptonshire.connectfm.com/*', '*://peterborough.connectfm.com/*', '*://ukradioplayer.coolfm.co.uk/*', '*://www.crossrhythms.co.uk/*', '*://crushradio.co.uk/*', '*://player.dearnefm.co.uk/*', '*://diversefm.com/*', '*://ukradioplayer.downtown.co.uk/*', '*://www.dream100.com/*', '*://www.drystoneradio.co.uk/*', '*://www.eagleextra.co.uk/*', '*://www.964eagle.co.uk/*', '*://www.eagle3.co.uk/*', '*://www.energyfm.net/*', '*://ondemand.georgeandfire.co.uk/*', '*://www.forestfm.co.uk/*', '*://ukradioplayer.forth2.com/*', '*://ukradioplayer.forthone.com/*', '*://www.frenchradiolondon.com/*', '*://www.funkidslive.com/*', '*://www.futureradio.co.uk/*', '*://www.gateway978.com/*', '*://nwplayer.gaydio.co.uk/*', '*://player.gaydio.co.uk/*', '*://ukradioplayer.hallamfm.co.uk/*', '*://ukrp.musicradio.com/*', '*://www.heart.co.uk/*', '*://ukradioplayer.heatradio.com/*', '*://ukradioplayer.thehitsradio.com/*', '*://player.hot1028.com/*', '*://www.hubradio.co.uk/*', '*://imaginefm.net/*', '*://www.indigofm.co.uk/*', '*://www.iwradio.co.uk/*', '*://player.jackfmswindon.com/*', '*://www.jazzfm.co/*', '*://player.juicebrighton.com/*', '*://kanefm.com/*', '*://player.kcfm.co.uk/*', '*://ukradioplayer.kerrangradio.co.uk/*', '*://ukradioplayer.key103.co.uk/*', '*://player.kingdomfm.co.uk/*', '*://kiss101.ukradioplayer.kissfmuk.com/*', '*://kiss105.ukradioplayer.kissfmuk.com/*', '*://kiss100.ukradioplayer.kissfmuk.com/*', '*://ukradioplayer.kissfresh.kissfmuk.com/*', '*://ukradioplayer.kisstory.kissfmuk.com/*', '*://www.klfm967.co.uk/*', '*://streaming.kentonline.co.uk/*', '*://player.lincsfm.co.uk/*', '*://ukradioplayer.magic.co.uk/*', '*://ukradioplayer.manchestersmagic.co.uk/*', '*://ukradioplayer.magic1152.co.uk/*', '*://ukradioplayer.magic1161.co.uk/*', '*://ukradioplayer.magic1170.co.uk/*', '*://ukradioplayer.magic1548.co.uk/*', '*://ukradioplayer.magic828.co.uk/*', '*://ukradioplayer.magic999.co.uk/*', '*://ukradioplayer.magicam.co.uk/*', '*://player.manxradio.com/*', '*://ukradioplayer.metroradio.co.uk/*', '*://ukradioplayerone.mfr.co.uk/*', '*://ukradioplayertwo.mfr.co.uk/*', '*://www.ministryofsound.com/*', '*://www.mix96.co.uk/*', '*://www.mkfm.com/*', '*://nationhits.com/*', '*://www.nationradio.com/*', '*://www.northnorfolkradio.com/*', '*://ukradioplayer.northsound1.com/*', '*://ukradioplayer.northsound2.com/*', '*://www.999radionorwich.com/*', '*://player.oakfm.co.uk/*', '*://www.originalfm.com/*', '*://palm105.co.uk/*', '*://player.peakfm.net/*', '*://www.piratefm.co.uk/*', '*://player.planetrock.com/*', '*://www.premierradio.org.uk/*', '*://player.pulse2.net/*', '*://player.pulse.co.uk/*', '*://ukradioplayer.radioaire.co.uk/*', '*://ukradioplayer.radioborders.com/*', '*://radiocarmarthenshire.com/*', '*://www.radiocaroline.co.uk/*', '*://radioceredigion.com/*', '*://ukradioplayer.radiocity.co.uk/*', '*://www.radioessex.com/*', '*://player.radioexe.co.uk/*', '*://radiolab.beds.ac.uk/*', '*://radiopembrokeshire.com/*', '*://radioplus.org.uk/*', '*://www.radiotyneside.co.uk/*', '*://www.radioverulam.com/*', '*://player.wave965.com/*', '*://radioreverb.com/*', '*://www.realradionortheast.co.uk/*', '*://www.realradionorthwest.co.uk/*', '*://www.realradio-scotland.co.uk/*', '*://www.realradiowales.co.uk/*', '*://www.realradioxs.co.uk/*', '*://www.realradioyorkshire.co.uk/*', '*://www.reprezent.org.uk/*', '*://radioplayer.resonancefm.com/*', '*://player.ridingsfm.co.uk/*', '*://rinse.fm/*', '*://listen.insightradio.co.uk/*', '*://ukradioplayer.rockfm.co.uk/*', '*://player.rotherfm.co.uk/*', '*://player.rutlandradio.co.uk/*', '*://scarletfm.com/*', '*://www.sfmradio.com/*', '*://www.toxicflames.co.uk/*', '*://player.signal1.co.uk/*', '*://player.signal107.co.uk/*', '*://player.signal2.co.uk/*', '*://smilesussex.com/*', '*://www.smoothradio.co.uk/*', '*://www.solarradio.com/*', '*://www.somervalleyfm.co.uk/*', '*://player.soundartradio.org.uk/*', '*://www.thesourcefm.co.uk/*', '*://www.spectrumradio.net/*', '*://www.spirefm.co.uk/*', '*://www.spiritfm.net/*', '*://www.star107.co.uk/*', '*://www.strayfm.com/*', '*://www.susyradio.com/*', '*://player.swanseasound.co.uk/*', '*://www.switchradio.co.uk/*', '*://talksport.com/*', '*://tonefm.co.uk/*', '*://ukradioplayer.tayam.co.uk/*', '*://ukradioplayer.tayfm.co.uk/*', '*://www.teamrockradio.com/*', '*://ukradioplayer.tfmradio.com/*', '*://player.towerfm.co.uk/*', '*://www.town102.com/*', '*://player.traxfm.co.uk/*', '*://player.2lr.co.uk/*', '*://www.u105.com/*', '*://www.ucb.co.uk/*', '*://ury.org.uk/*', '*://urn1350.net/*', '*://ukradioplayer.vikingfm.co.uk/*', '*://www.thevoicefm.co.uk/*', '*://ruvr.co.uk/*', '*://ukradioplayer.wave105.com/*', '*://www.wessexfm.com/*', '*://ukradioplayer.westfm.co.uk/*', '*://ukradioplayer.westsound.co.uk/*', '*://ukradioplayer.westsoundradio.com/*', '*://player.wirefm.com/*', '*://player.wishfm.net/*', '*://www.xfm.co.uk/*', '*://www.yorkshirecoastradio.com/*'],
			js: ['connectors/radioplayer.js']
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
			js: ['connectors/reverbnation.js']
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
			js: ['connectors/odnoklassniki.js'],
			allFrames: true
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
			js: ['connectors/luoo.js']
		},

		{
			label: 'ambientsleepingpill',
			matches: ['*://ambientsleepingpill.com/'],
			js: ['connectors/v2/ambientsleepingpill.js'],
			version: 2
		},

		{
			label: 'Blitzr',
			matches: ['*://*.blitzr.com/*', '*://blitzr.com/*'],
			js: ['connectors/blitzr.js']
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
			matches: ['*://*.ampya.com/*'],
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
			label: 'myradio.ua',
			matches: ['*://myradio.ua/*'],
			js: ['connectors/v2/myradio.ua.js'],
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
			js: ['connectors/v2/jazzradio.js'],
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
			matches: ['*://www.noonpacific.com/*', '*://noonpacific.com/*'],
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
			label: 'EDM.com',
			matches: ['*://edm.com/*'],
			js: ['connectors/v2/edm.js'],
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
			matches: ['*://www.egofm.de/*'],
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
			matches: ['https://cubic.fm/*'],
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
			js: ['connectors/v2/youtubify.js'],
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
		}
	];
});
