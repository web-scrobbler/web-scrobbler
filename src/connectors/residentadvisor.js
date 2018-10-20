'use strict';

const domain = 'https://www.residentadvisor.net';

Connector.playerSelector = '.content-list';

Connector.playButtonSelector = '.controls .play';

function getTrackContainer() {
  let track = $('.play.paused').parents().eq(2);
  if (track.is('article')) {
    return track; // recommended
  } else {
    return track.parent(); // archive track or single track
  }
}

function isTrackRecommended() {
  return getTrackContainer().is('article');
}

function isArchivedTrack() {
  return getTrackContainer().is('ul');
}

function isTrackSingle() {
  return getTrackContainer().is('div');
}

function isDjTrack() {
  return false;
}

function isChartTrack() {
  return false;
}

Connector.getTrackArt = () => {
  let artPath;
  if (isTrackRecommended()) {
    artPath = getTrackContainer().find('a img').attr('src'); // /images/cover/tr-929172.jpg
  } else if (isTrackSingle()) {
    artPath = getTrackContainer().find('.fl .pr16 img').attr('src');
  } else if (isDjTrack()) {

  } else if (isChartTrack()) {

  } else if (isArchivedTrack()) {
    artPath = getTrackContainer().find('li:first-child .pr8 a img').attr('src');
  }
  return domain + artPath;
}

Connector.getTrack = () => {
  if (isTrackRecommended()) {
    return Util.splitArtistTrack(getTrackContainer().find('div a').text()).track;
  } else if (isTrackSingle()) {
    return Util.splitArtistTrack($('#sectionHead h1').text()).track;
  } else if (isDjTrack()) {

  } else if (isChartTrack()) {

  } else if (isArchivedTrack()) {
    return getTrackContainer().find('li:last-child .pr8 a.f24').text();
  }
}

Connector.getArtist = () => {
  if (isTrackRecommended()) {
    return Util.splitArtistTrack(getTrackContainer().find('div a').text()).artist;
  } else if (isTrackSingle()) {
    return Util.splitArtistTrack($('#sectionHead h1').text()).artist;
  } else if (isDjTrack()) {

  } else if (isChartTrack()) {

  } else if (isArchivedTrack()) {
    return getTrackContainer().find('li:last-child .pr8 div.f24').first().text();
  }
}

Connector.getUniqueId = () => {
  if (isTrackRecommended()) {
    return getTrackContainer().find('.play.player').attr('data-trackid');
  } else if (isTrackSingle()) {
    return getTrackContainer().find('.play.player').attr('data-trackid');
  } else if (isDjTrack()) {

  } else if (isChartTrack()) {

  } else if (isArchivedTrack()) {

  }
}

Connector.isPlaying = () => $('.play.paused').length > 0;

Connector.isTrackArtDefault = (trackArtUrl) => {
  return trackArtUrl === domain + '/images/cover/blank.jpg'
}
