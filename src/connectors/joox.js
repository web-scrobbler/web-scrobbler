'use strict';

// minified zg2uni of Rabbit converter - https://github.com/Rabbit-Converter/Rabbit

let zg2uni = function(output) {
	let rule = [{ 'from': '([\u102D\u102E\u103D\u102F\u1037\u1095])\\1+', 'to': '$1' }, { 'from': '\u200B', 'to': '' }, { 'from': '\u103d\u103c', 'to': '\u108a' }, { 'from': '(\u103d|\u1087)', 'to': '\u103e' }, { 'from': '\u103c', 'to': '\u103d' }, { 'from': '(\u103b|\u107e|\u107f|\u1080|\u1081|\u1082|\u1083|\u1084)', 'to': '\u103c' }, { 'from': '(\u103a|\u107d)', 'to': '\u103b' }, { 'from': '\u1039', 'to': '\u103a' }, { 'from': '(\u1066|\u1067)', 'to': '\u1039\u1006' }, { 'from': '\u106a', 'to': '\u1009' }, { 'from': '\u106b', 'to': '\u100a' }, { 'from': '\u106c', 'to': '\u1039\u100b' }, { 'from': '\u106d', 'to': '\u1039\u100c' }, { 'from': '\u106e', 'to': '\u100d\u1039\u100d' }, { 'from': '\u106f', 'to': '\u100d\u1039\u100e' }, { 'from': '\u1070', 'to': '\u1039\u100f' }, { 'from': '(\u1071|\u1072)', 'to': '\u1039\u1010' }, { 'from': '\u1060', 'to': '\u1039\u1000' }, { 'from': '\u1061', 'to': '\u1039\u1001' }, { 'from': '\u1062', 'to': '\u1039\u1002' }, { 'from': '\u1063', 'to': '\u1039\u1003' }, { 'from': '\u1065', 'to': '\u1039\u1005' }, { 'from': '\u1068', 'to': '\u1039\u1007' }, { 'from': '\u1069', 'to': '\u1039\u1008' }, { 'from': '(\u1073|\u1074)', 'to': '\u1039\u1011' }, { 'from': '\u1075', 'to': '\u1039\u1012' }, { 'from': '\u1076', 'to': '\u1039\u1013' }, { 'from': '\u1077', 'to': '\u1039\u1014' }, { 'from': '\u1078', 'to': '\u1039\u1015' }, { 'from': '\u1079', 'to': '\u1039\u1016' }, { 'from': '\u107a', 'to': '\u1039\u1017' }, { 'from': '\u107c', 'to': '\u1039\u1019' }, { 'from': '\u1085', 'to': '\u1039\u101c' }, { 'from': '\u1033', 'to': '\u102f' }, { 'from': '\u1034', 'to': '\u1030' }, { 'from': '\u103f', 'to': '\u1030' }, { 'from': '\u1086', 'to': '\u103f' }, { 'from': '\u1036\u1088', 'to': '\u1088\u1036' }, { 'from': '\u1088', 'to': '\u103e\u102f' }, { 'from': '\u1089', 'to': '\u103e\u1030' }, { 'from': '\u108a', 'to': '\u103d\u103e' }, { 'from': '\u103B\u1064', 'to': '\u1064\u103B' }, { 'from': '(\u1031)?([\u1000-\u1021])\u1064', 'to': '\u1004\u103a\u1039$1$2' }, { 'from': '(\u1031)?([\u1000-\u1021])(\u103b)?\u108b', 'to': '\u1004\u103a\u1039$1$2$3\u102d' }, { 'from': '(\u1031)?([\u1000-\u1021])(\u103b)?\u108c', 'to': '\u1004\u103a\u1039$1$2$3\u102e' }, { 'from': '(\u1031)?([\u1000-\u1021])\u108d', 'to': '\u1004\u103a\u1039$1$2\u1036' }, { 'from': '\u108e', 'to': '\u102d\u1036' }, { 'from': '\u108f', 'to': '\u1014' }, { 'from': '\u1090', 'to': '\u101b' }, { 'from': '\u1091', 'to': '\u100f\u1039\u100d' }, { 'from': '\u1092', 'to': '\u100b\u1039\u100c' }, { 'from': '\u1019\u102c(\u107b|\u1093)', 'to': '\u1019\u1039\u1018\u102c' }, { 'from': '(\u107b|\u1093)', 'to': '\u1039\u1018' }, { 'from': '(\u1094|\u1095)', 'to': '\u1037' }, { 'from': '([\u1000-\u1021])\u1037\u1032', 'to': '$1\u1032\u1037' }, { 'from': '\u1096', 'to': '\u1039\u1010\u103d' }, { 'from': '\u1097', 'to': '\u100b\u1039\u100b' }, { 'from': '\u103c([\u1000-\u1021])([\u1000-\u1021])?', 'to': '$1\u103c$2' }, { 'from': '([\u1000-\u1021])\u103c\u103a', 'to': '\u103c$1\u103a' }, { 'from': '\u1047(?=[\u102c-\u1030\u1032\u1036-\u1038\u103d\u1038])', 'to': '\u101b' }, { 'from': '\u1031\u1047', 'to': '\u1031\u101b' }, { 'from': '\u1040(\u102e|\u102f|\u102d\u102f|\u1030|\u1036|\u103d|\u103e)', 'to': '\u101d$1' }, { 'from': '([^\u1040\u1041\u1042\u1043\u1044\u1045\u1046\u1047\u1048\u1049])\u1040\u102b', 'to': '$1\u101d\u102b' }, { 'from': '([\u1040\u1041\u1042\u1043\u1044\u1045\u1046\u1047\u1048\u1049])\u1040\u102b(?!\u1038)', 'to': '$1\u101d\u102b' }, { 'from': '^\u1040(?=\u102b)', 'to': '\u101d' }, { 'from': '\u1040\u102d(?!\u0020?/)', 'to': '\u101d\u102d' }, { 'from': '([^\u1040-\u1049])\u1040([^\u1040-\u1049\u0020]|[\u104a\u104b])', 'to': '$1\u101d$2' }, { 'from': '([^\u1040-\u1049])\u1040(?=[\\f\\n\\r])', 'to': '$1\u101d' }, { 'from': '([^\u1040-\u1049])\u1040$', 'to': '$1\u101d' }, { 'from': '\u1031([\u1000-\u1021\u103f])(\u103e)?(\u103b)?', 'to': '$1$2$3\u1031' }, { 'from': '([\u1000-\u1021])\u1031([\u103b\u103c\u103d\u103e]+)', 'to': '$1$2\u1031' }, { 'from': '\u1032\u103d', 'to': '\u103d\u1032' }, { 'from': '([\u102d\u102e])\u103b', 'to': '\u103b$1' }, { 'from': '\u103d\u103b', 'to': '\u103b\u103d' }, { 'from': '\u103a\u1037', 'to': '\u1037\u103a' }, { 'from': '\u102f(\u102d|\u102e|\u1036|\u1037)\u102f', 'to': '\u102f$1' }, { 'from': '(\u102f|\u1030)(\u102d|\u102e)', 'to': '$2$1' }, { 'from': '(\u103e)(\u103b|\u103c)', 'to': '$2$1' }, { 'from': '\u1025(?=[\u1037]?[\u103a\u102c])', 'to': '\u1009' }, { 'from': '\u1025\u102e', 'to': '\u1026' }, { 'from': '\u1005\u103b', 'to': '\u1008' }, { 'from': '\u1036(\u102f|\u1030)', 'to': '$1\u1036' }, { 'from': '\u1031\u1037\u103e', 'to': '\u103e\u1031\u1037' }, { 'from': '\u1031\u103e\u102c', 'to': '\u103e\u1031\u102c' }, { 'from': '\u105a', 'to': '\u102b\u103a' }, { 'from': '\u1031\u103b\u103e', 'to': '\u103b\u103e\u1031' }, { 'from': '(\u102d|\u102e)(\u103d|\u103e)', 'to': '$2$1' }, { 'from': '\u102c\u1039([\u1000-\u1021])', 'to': '\u1039$1\u102c' }, { 'from': '\u1039\u103c\u103a\u1039([\u1000-\u1021])', 'to': '\u103a\u1039$1\u103c' }, { 'from': '\u103c\u1039([\u1000-\u1021])', 'to': '\u1039$1\u103c' }, { 'from': '\u1036\u1039([\u1000-\u1021])', 'to': '\u1039$1\u1036' }, { 'from': '\u104e', 'to': '\u104e\u1004\u103a\u1038' }, { 'from': '\u1040(\u102b|\u102c|\u1036)', 'to': '\u101d$1' }, { 'from': '\u1025\u1039', 'to': '\u1009\u1039' }, { 'from': '([\u1000-\u1021])\u103c\u1031\u103d', 'to': '$1\u103c\u103d\u1031' }, { 'from': '([\u1000-\u1021])\u103b\u1031\u103d(\u103e)?', 'to': '$1\u103b\u103d$2\u1031' }, { 'from': '([\u1000-\u1021])\u103d\u1031\u103b', 'to': '$1\u103b\u103d\u1031' }, { 'from': '([\u1000-\u1021])\u1031(\u1039[\u1000-\u1021])', 'to': '$1$2\u1031' }, { 'from': '\u1038\u103a', 'to': '\u103a\u1038' }, { 'from': '\u102d\u103a|\u103a\u102d', 'to': '\u102d' }, { 'from': '\u102d\u102f\u103a', 'to': '\u102d\u102f' }, { 'from': '\u0020\u1037', 'to': '\u1037' }, { 'from': '\u1037\u1036', 'to': '\u1036\u1037' }, { 'from': ' \u1037', 'to': '\u1037' }, { 'from': '[\u102d]+', 'to': '\u102d' }, { 'from': '[\u103a]+', 'to': '\u103a' }, { 'from': '[\u103d]+', 'to': '\u103d' }, { 'from': '[\u1037]+', 'to': '\u1037' }, { 'from': '[\u102e]+', 'to': '\u102e' }, { 'from': '\u102d\u102e|\u102e\u102d', 'to': '\u102e' }, { 'from': '\u102f\u102d', 'to': '\u102d\u102f' }, { 'from': '\u1037\u1037', 'to': '\u1037' }, { 'from': '\u1032\u1032', 'to': '\u1032' }, { 'from': '\u1044\u1004\u103a\u1038', 'to': '\u104E\u1004\u103a\u1038' }, { 'from': '([\u102d\u102e])\u1039([\u1000-\u1021])', 'to': '\u1039$2$1' }, { 'from': '(\u103c\u1031)\u1039([\u1000-\u1021])', 'to': '\u1039$2$1' }, { 'from': '\u1036\u103d', 'to': '\u103d\u1036' }];return replaceWithRule(rule, output);
};

let replaceWithRule = function(rule, output) {
	let maxLoop = rule.length;for (let i = 0;i < maxLoop;i++) {
		let data = rule[i];let from = data.from;let to = data.to;let fromRegex = new RegExp(from, 'g');output = output.replace(fromRegex, to);
	}
	return output;
};

// zg2uni ends here

const defaultAlbumData = {
	path: undefined,
	loaded: false,
	name: undefined
};

const playerSelector = '#JooxPlayerWrapper';
const artistSelector = `${playerSelector} .Artist a`;
const trackSelector = '#songDetail .SongName';
const playBtnSelector = '#playBtn';

const getTrackPath = () => $(`${trackSelector} a`).attr('href');
const getTrackUrl = () => `https://www.joox.com${getTrackPath()}`;
const initiateAlbumDataCache = (trackPath) => {
	let data = Object.assign({}, defaultAlbumData);
	return Object.assign(data, { path: trackPath });
};
const isAlbumDataInCache = (albumData, trackPath) => albumData.path === trackPath;
const isAlbumDataLoaded = (albumData) => albumData.loaded;
const loadAlbumData = (onLoadComplete) => {
	$.get({
		url: getTrackUrl(),
		success: (data) => {
			let ldJSON = $.parseHTML(data)
				.filter((el) => el.tagName === 'SCRIPT')[0]
				.innerText;
			let songData = JSON.parse(ldJSON);
			onLoadComplete(songData);
		},
	});
	return true;
};
let _albumData = initiateAlbumDataCache(undefined);

const filter = new MetadataFilter({
	track: zg2uni,
	album: zg2uni
});


// Connector methods

Connector.playerSelector = playerSelector;
Connector.trackSelector = '#songDetail .SongName';
Connector.currentTimeSelector = `${playerSelector} .Status .start`;
Connector.durationSelector = `${playerSelector} .Status .end`;
Connector.trackArtSelector = `${playerSelector} .rezyImageFrame img`;
Connector.getUniqueID = getTrackUrl;

Connector.getArtist = () => {
	return $(artistSelector)
		.map((_, el) => $(el).text())
		.get()
		.join(', ');
};

Connector.isPlaying = () => $(playBtnSelector).find('i:first').hasClass('icon--pause');

Connector.getAlbum = () => {
	const trackPath = getTrackPath();

	if (!isAlbumDataInCache(_albumData, trackPath)) {
		_albumData = initiateAlbumDataCache(trackPath);
	}

	if (!isAlbumDataLoaded(_albumData)) {
		_albumData.loaded = loadAlbumData((songData) => _albumData.name = songData.inAlbum.name);
	}

	return _albumData.name;
};

Connector.applyFilter(filter);

