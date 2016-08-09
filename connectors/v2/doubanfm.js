'use strict';

/* global Connector */

Connector.playerSelector = '.fullplayer';

Connector.trackArtImageSelector = '.playing-cover img';

Connector.trackSelector =	'.fullplayer .titles .title a';

Connector.artistSelector = '.fullplayer .link.artist-name';

Connector.playButtonSelector = '.fr .icon-pause';

Connector.getDuration = function () {
  var text = $('.fr .time').text();
  return Connector.stringToSeconds(text.substring(1)) || null;
};

Connector.isPlaying = function () {
  var classString = $('.fr').children('svg').attr('class');
  return /(^|\s)icon-pause(\s|$)/.test(classString);
};
