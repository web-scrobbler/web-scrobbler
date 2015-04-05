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
			matches: ['*://www.youtube.com/watch*', '*://www.youtube.com/user/*'],
			js: ['connectors/youtube.js']
		},

		{
			label: 'TTNET Müzik',
			matches: ['*://www.ttnetmuzik.com.tr/*'],
			js: ['connectors/ttnet.js']
		},

		{
			label: 'Thesixtyone',
			matches: ['*://www.thesixtyone.com/*'],
			js: ['connectors/61.js']
		},

		//{
		//	label: 'Google Play Music',
		//	matches: ['*://play.google.com/music/*', '*://play-music.sandbox.google.com/music/*'],
		//	js: ['connectors/googlemusic.js']
		//},

		{
			label: 'Google Play Music',
			matches: ['*://play.google.com/music/*'],
			js: ['connectors/v2/googlemusic.js'],
			version: 2
		},

		{
			label: 'MySpace',
			matches: ['*://myspace.com/*'],
			js: ['connectors/myspace.js']
		},

		{
			label: 'Pitchfork Advance',
			matches: ['*://pitchfork.com/advance/*', '*://www.pitchfork.com/advance/*'],
			js: ['connectors/pitchfork-advance.js']
		},

		{
			label: 'Pitchfork',
			matches: ['*://pitchfork.com/*', '*://www.pitchfork.com/*'],
			js: ['connectors/pitchfork.js']
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
			matches: ['*://*.bandcamp.com/*', '*://bandcamp.com/discover'],
			js: ['connectors/bandcamp.js']
		},

		{
			label: 'Jango',
			matches: ['*://www.jango.com/*'],
			js: ['connectors/jango.js', 'connectors/jango-dom-inject.js']
		},

		{
			label: 'Pandora',
			matches: ['*://www.pandora.com/*'],
			js: ['connectors/pandora.js']
		},

		{
			label: 'pakartot',
			matches: ['*://www.pakartot.lt/*'],
			js: ['connectors/pakartot.js']
		},

		{
			label: 'Deezer',
			matches: ['*://www.deezer.com/*'],
			js: ['connectors/deezer.js']
		},

		{
			label: 'SoundCloud',
			matches: ['*://soundcloud.com/*'],
			js: ['connectors/soundcloud.js']
		},

		{
			label: 'Amazon',
			matches: ['*://www.amazon.com/gp/dmusic/cloudplayer/*', '*://www.amazon.de/gp/dmusic/cloudplayer/*', '*://www.amazon.es/gp/dmusic/cloudplayer/*', '*://www.amazon.co.uk/gp/dmusic/cloudplayer/*'],
			js: ['connectors/amazon.js']
		},

		{ // DEAD?
			label: 'Z-Music',
			matches: ['*://z-music.org/*'],
			js: ['connectors/zmusic.js']
		},

		{
			label: 'VK',
			matches: ['*://vk.com/*'],
			js: ['connectors/vk.js']
		},

		{
			label: 'Zvooq',
			matches: ['*://zvooq.ru/*'],
			js: ['connectors/zvooq.js']
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
			js: ['connectors/22tracks.js']
		},

		{
			label: 'Megalyrics',
			matches: ['*://megalyrics.ru/*'],
			js: ['connectors/megalyrics.js'],
			allFrames: true
		},

		{
			label: 'iHeart',
			matches: ['*://*.iheart.com/*'],
			js: ['connectors/iheart.js']
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
			js: ['connectors/tubafm.js']
		},

		{
			label: 'Spotify',
			matches: ['https://play.spotify.com/*'],
			js: ['connectors/v2/spotify.js'],
			version: 2
		},

		{
			label: 'Grooveshark',
			matches: ['*://grooveshark.com/*'],
			js: ['connectors/grooveshark.js']
		},

		{
			label: 'Plug.dj',
			matches: ['*://plug.dj/*'],
			js: ['connectors/plugdj.js']
		},

		{
			label: 'Turntable',
			matches: ['*://turntable.fm/*'],
			js: ['connectors/turntable.js']
		},

		{
			label: 'Slacker (iframe)',
			matches: ['*://www.slacker.com/webplayer/index_embed.vm'],
			js: ['connectors/slacker.js']
		},

		{
			label: 'Slacker (main page)',
			matches: ['*://www.slacker.com/*'],
			js: ['connectors/slacker2.js']
		},

		{
			label: 'Daytrotter',
			matches: ['*://www.daytrotter.com/*'],
			js: ['connectors/daytrotter.js']
		},

		{
			label: 'AOL Radio',
			matches: ['*://aolradio.slacker.com/*'],
			js: ['connectors/aolradio.js']
		},

		{
			label: 'HillyDilly',
			matches: ['*://www.hillydilly.com/*'],
			js: ['connectors/hillydilly.js']
		},

		{
			label: 'Xbox Music',
			matches: ['*://music.xbox.com/*'],
			js: ['connectors/xboxmusic.js']
		},

		{
			label: '8tracks',
			matches: ['*://8tracks.com/*'],
			js: ['connectors/8tracks.js']
		},

		{
			label: 'Moje Polskie Radio',
			matches: ['*://moje.polskieradio.pl/station/*'],
			js: ['connectors/mojepolskieradio.js']
		},

		{
			label: 'Nova Planet',
			matches: ['*://www.novaplanet.com/radionova/player'],
			js: ['connectors/novaplanet.js']
		},

		{
			label: 'Radio+ Belgium',
			matches: ['*://www.radioplus.be/*'],
			js: ['connectors/radioplusbe.js']
		},

		{
			label: 'Songza',
			matches: ['*://songza.com/*'],
			js: ['connectors/songza.js']
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
			js: ['connectors/letournedisque.js']
		},

		{
			label: 'Rdio',
			matches: ['*://www.rdio.com/*'],
			js: ['connectors/rdio.js']
		},

		{
			label: 'Reddit Playlister',
			matches: ['*://redditplayer.phoenixforgotten.com/*'],
			js: ['connectors/redditplayer.js']
		},

		{
			label: 'Sullen-Ural',
			matches: ['*://sullen-ural.ru/*', '*://*.sullen-ural.ru/*'],
			js: ['connectors/sullen-ural.js']
		},

		{
			label: 'Digitally Imported',
			matches: ['*://www.di.fm/*'],
			js: ['connectors/difm.js']
		},

		{
			label: 'Beats Music',
			matches: ['*://*.beatsmusic.com/*'],
			js: ['vendor/jquery.cookie.js', 'connectors/beats.js']
		},

		{
			label: 'RadioPlayer',
			matches: ['*://www.thisisstar.co.uk/*', '*://live.thebridgeradio.net/*', '*://www.chorley.fm/*', '*://www.sun-fm.com/*', '*://www.minsterfm.com/*', '*://www.uckfieldfm.co.uk/*', '*://radioplayer.bishopfm.com/*', '*://player.jackbristol.com/*', '*://player.106jack.com/*', '*://player.jackradio.com/*', '*://www.tcrfm.co.uk/*', '*://sparksunderland.com/*', '*://player.juicefm.com/*', '*://rp.xrad.io/*', '*://www.radiojackie.com/*', '*://people.bath.ac.uk/*', '*://www.2br.co.uk/*', '*://player.three.fm/*', '*://player.therevolution962.com/*', '*://player.thewave.co.uk/*', '*://www.kcclive.com/*', '*://player.absoluteradio.co.uk/*', '*://aliveradio.net/*', '*://allfm.org/*', '*://www.amazingradio.com/*', '*://www.ambersoundfm.com/*', '*://player.bailriggfm.co.uk/*', '*://player.thebay.co.uk/*', '*://www.bcbradio.co.uk/*', '*://www.thebeach.co.uk/*', '*://www.thebee.co.uk/*', '*://www.bfbs.com/*', '*://player.boltonfm.com/*', '*://andoverplayer.thebreeze.com/*', '*://basingstokeplayer.thebreeze.com/*', '*://bristolplayer.thebreeze.com/*', '*://cheltenhamplayer.thebreeze.com/*', '*://easthampshireplayer.thebreeze.com/*', '*://westwiltsplayer.thebreeze.com/*', '*://newburyplayer.thebreeze.com/*', '*://northdorsetplayer.thebreeze.com/*', '*://northsomersetplayer.thebreeze.com/*', '*://southplayer.thebreeze.com/*', '*://southamptonplayer.thebreeze.com/*', '*://winchesterplayer.thebreeze.com/*', '*://southsomersetplayer.thebreeze.com/*', '*://bridge.fm/*', '*://www.capitalfm.com/*', '*://www.capitalxtra.com/*', '*://www.thecatradio.co.uk/*', '*://ukradioplayer.cfmradio.com/*', '*://www.southendandchelmsfordradio.com/*', '*://www.silk1069.com/*', '*://www.dee1063.com/*', '*://app.musicradio.com/*', '*://ukradioplayer.citytalk.fm/*', '*://www.classicfm.com/*', '*://ukradioplayer.clyde1.com/*', '*://ukradioplayer.clyde2.com/*', '*://player.compassfm.co.uk/*', '*://northamptonshire.connectfm.com/*', '*://peterborough.connectfm.com/*', '*://ukradioplayer.coolfm.co.uk/*', '*://www.crossrhythms.co.uk/*', '*://crushradio.co.uk/*', '*://player.dearnefm.co.uk/*', '*://diversefm.com/*', '*://ukradioplayer.downtown.co.uk/*', '*://www.dream100.com/*', '*://www.drystoneradio.co.uk/*', '*://www.eagleextra.co.uk/*', '*://www.964eagle.co.uk/*', '*://www.eagle3.co.uk/*', '*://www.energyfm.net/*', '*://ondemand.georgeandfire.co.uk/*', '*://www.forestfm.co.uk/*', '*://ukradioplayer.forth2.com/*', '*://ukradioplayer.forthone.com/*', '*://www.frenchradiolondon.com/*', '*://www.funkidslive.com/*', '*://www.futureradio.co.uk/*', '*://www.gateway978.com/*', '*://nwplayer.gaydio.co.uk/*', '*://player.gaydio.co.uk/*', '*://ukradioplayer.hallamfm.co.uk/*', '*://ukrp.musicradio.com/*', '*://www.heart.co.uk/*', '*://ukradioplayer.heatradio.com/*', '*://ukradioplayer.thehitsradio.com/*', '*://player.hot1028.com/*', '*://www.hubradio.co.uk/*', '*://imaginefm.net/*', '*://www.indigofm.co.uk/*', '*://www.iwradio.co.uk/*', '*://player.jackfmswindon.com/*', '*://www.jazzfm.co/*', '*://player.juicebrighton.com/*', '*://kanefm.com/*', '*://player.kcfm.co.uk/*', '*://ukradioplayer.kerrangradio.co.uk/*', '*://ukradioplayer.key103.co.uk/*', '*://player.kingdomfm.co.uk/*', '*://kiss101.ukradioplayer.kissfmuk.com/*', '*://kiss105.ukradioplayer.kissfmuk.com/*', '*://kiss100.ukradioplayer.kissfmuk.com/*', '*://ukradioplayer.kissfresh.kissfmuk.com/*', '*://ukradioplayer.kisstory.kissfmuk.com/*', '*://www.klfm967.co.uk/*', '*://streaming.kentonline.co.uk/*', '*://player.lincsfm.co.uk/*', '*://ukradioplayer.magic.co.uk/*', '*://ukradioplayer.manchestersmagic.co.uk/*', '*://ukradioplayer.magic1152.co.uk/*', '*://ukradioplayer.magic1161.co.uk/*', '*://ukradioplayer.magic1170.co.uk/*', '*://ukradioplayer.magic1548.co.uk/*', '*://ukradioplayer.magic828.co.uk/*', '*://ukradioplayer.magic999.co.uk/*', '*://ukradioplayer.magicam.co.uk/*', '*://player.manxradio.com/*', '*://ukradioplayer.metroradio.co.uk/*', '*://ukradioplayerone.mfr.co.uk/*', '*://ukradioplayertwo.mfr.co.uk/*', '*://www.ministryofsound.com/*', '*://www.mix96.co.uk/*', '*://www.mkfm.com/*', '*://nationhits.com/*', '*://www.nationradio.com/*', '*://www.northnorfolkradio.com/*', '*://ukradioplayer.northsound1.com/*', '*://ukradioplayer.northsound2.com/*', '*://www.999radionorwich.com/*', '*://player.oakfm.co.uk/*', '*://www.originalfm.com/*', '*://palm105.co.uk/*', '*://player.peakfm.net/*', '*://www.piratefm.co.uk/*', '*://player.planetrock.com/*', '*://www.premierradio.org.uk/*', '*://player.pulse2.net/*', '*://player.pulse.co.uk/*', '*://ukradioplayer.radioaire.co.uk/*', '*://ukradioplayer.radioborders.com/*', '*://radiocarmarthenshire.com/*', '*://www.radiocaroline.co.uk/*', '*://radioceredigion.com/*', '*://ukradioplayer.radiocity.co.uk/*', '*://www.radioessex.com/*', '*://player.radioexe.co.uk/*', '*://radiolab.beds.ac.uk/*', '*://radiopembrokeshire.com/*', '*://radioplus.org.uk/*', '*://www.radiotyneside.co.uk/*', '*://www.radioverulam.com/*', '*://player.wave965.com/*', '*://radioreverb.com/*', '*://www.realradionortheast.co.uk/*', '*://www.realradionorthwest.co.uk/*', '*://www.realradio-scotland.co.uk/*', '*://www.realradiowales.co.uk/*', '*://www.realradioxs.co.uk/*', '*://www.realradioyorkshire.co.uk/*', '*://www.reprezent.org.uk/*', '*://radioplayer.resonancefm.com/*', '*://player.ridingsfm.co.uk/*', '*://rinse.fm/*', '*://listen.insightradio.co.uk/*', '*://ukradioplayer.rockfm.co.uk/*', '*://player.rotherfm.co.uk/*', '*://player.rutlandradio.co.uk/*', '*://scarletfm.com/*', '*://www.sfmradio.com/*', '*://www.toxicflames.co.uk/*', '*://player.signal1.co.uk/*', '*://player.signal107.co.uk/*', '*://player.signal2.co.uk/*', '*://smilesussex.com/*', '*://www.smoothradio.co.uk/*', '*://www.solarradio.com/*', '*://www.somervalleyfm.co.uk/*', '*://player.soundartradio.org.uk/*', '*://www.thesourcefm.co.uk/*', '*://www.spectrumradio.net/*', '*://www.spirefm.co.uk/*', '*://www.spiritfm.net/*', '*://www.star107.co.uk/*', '*://www.strayfm.com/*', '*://www.susyradio.com/*', '*://player.swanseasound.co.uk/*', '*://www.switchradio.co.uk/*', '*://talksport.com/*', '*://tonefm.co.uk/*', '*://ukradioplayer.tayam.co.uk/*', '*://ukradioplayer.tayfm.co.uk/*', '*://www.teamrockradio.com/*', '*://ukradioplayer.tfmradio.com/*', '*://player.towerfm.co.uk/*', '*://www.town102.com/*', '*://player.traxfm.co.uk/*', '*://player.2lr.co.uk/*', '*://www.u105.com/*', '*://www.ucb.co.uk/*', '*://ury.org.uk/*', '*://urn1350.net/*', '*://ukradioplayer.vikingfm.co.uk/*', '*://www.thevoicefm.co.uk/*', '*://ruvr.co.uk/*', '*://ukradioplayer.wave105.com/*', '*://www.wessexfm.com/*', '*://ukradioplayer.westfm.co.uk/*', '*://ukradioplayer.westsound.co.uk/*', '*://ukradioplayer.westsoundradio.com/*', '*://player.wirefm.com/*', '*://player.wishfm.net/*', '*://www.xfm.co.uk/*', '*://www.yorkshirecoastradio.com/*'],
			js: ['connectors/radioplayer.js']
		},

		{
			label: 'BBC RadioPlayer',
			matches: ['*://www.bbc.co.uk/radio/player/*'],
			js: ['connectors/bbcradioplayer.js']
		},

		{
			label: 'Gaana.com',
			matches: ['*://gaana.com/*'],
			js: ['connectors/gaana.js']
		},

		{
			label: 'Music Unlimited',
			matches: ['*://music.sonyentertainmentnetwork.com/*'],
			js: ['connectors/musicunlimited.js']
		},

		{
			label: 'Yandex.Music',
			matches: ['*://music.yandex.ru/*'],
			js: ['connectors/yandex.js']
		},

		{
			label: 'PLEX',
			matches: ['*://*32400/web/*', '*://plex.tv/web/*'],
			js: ['connectors/plex.js']
		},

		{
			label: 'Pleer.Com (Prostopleer)',
			matches: ['*://pleer.com/*', '*://prostopleer.com/*'],
			js: ['connectors/pleer.js']
		},

		{
			label: 'TuneIn',
			matches: ['*://tunein.com/*'],
			js: ['connectors/tunein.js']
		},

		{
			label: 'MixCloud (Timestamped mixes only)',
			matches: ['*://mixcloud.com/*', '*://*.mixcloud.com/*'],
			js: ['connectors/mixcloud.js']
		},

		{
			label: 'ReverbNation',
			matches: ['*://www.reverbnation.com/*'],
			js: ['connectors/reverbnation.js']
		},

		{
			label: 'Xiami.com',
			matches: ['http://www.xiami.com/play*'],
			js: ['connectors/xiami.js']
		},

		{
			label: 'NRK Radio',
			matches: ['*://radio.nrk.no/*'],
			js: ['connectors/nrkradio.js']
		},

		{
			label: 'Archive.org',
			matches: ['*://archive.org/details/*'],
			js: ['connectors/archive.js']
		},

		{
			label: 'Odnoklassniki',
			matches: ['*://odnoklassniki.ru/*'],
			js: ['connectors/odnoklassniki.js'],
			allFrames: true
		},

		{
			label: 'Soundozer',
			matches: ['*://soundozer.com/*'],
			js: ['connectors/soundozer.js']
		},

		{
			label: '163 Music',
			matches: ['*://music.163.com/*'],
			js: ['connectors/163music.js']
		},

		{
			label: 'blinkboxMusic',
			matches: ['*://www.blinkboxmusic.com/*'],
			js: ['connectors/blinkboxmusic.js']
		},

		{
			label: 'luooMusic',
			matches: ['*://www.luoo.net/*'],
			js: ['connectors/luoo.js']
		},

		{
			label: 'ambientsleepingpill',
			matches: ['*://*.ambientsleepingpill.com/'],
			js: ['connectors/ambientsleepingpill.js']
		},

		{
			label: 'Blitzr',
			matches: ['*://*.blitzr.com/*', '*://blitzr.com/*'],
			js: ['connectors/blitzr.js']
		},

		{
			label: 'TIDAL',
			matches: ['*://listen.tidalhifi.com/*'],
			js: ['connectors/v2/tidal.js'],
			version: 2
		},

		{
			label: 'Bop.fm',
			matches: ['*://bop.fm/*'],
			js: ['connectors/v2/bopfm.js'],
			version: 2
		},

		{
			label: 'Radionomy',
			matches: ['*://www.radionomy.com/*'],
			js: ['connectors/v2/radionomy.js'],
			version: 2
		},

		{
			label: 'Jazzradio',
			matches: ['*://www.jazzradio.com/*'],
			js: ['connectors/v2/jazzradio.js'],
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
		}
	];
});
