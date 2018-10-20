'use strict';

const domain = 'https://www.residentadvisor.net';

Connector.playerSelector = '.content-list';

Connector.playButtonSelector = '.controls .play';

function getTrackContainer() {
  let track = $('.play.paused').parents().eq(2);
  if (track.is('article') || track.parent().hasClass('chart')) {
    return track; // recommended or chart track
  } else if (track.is('li') && track.parent().is('ul') || track.parent().hasClass('plus8')) {
    return track.parent(); // archive track or single track
  } else {
    return track.parents().eq(1); // DJ track
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
  return getTrackContainer().is('li') && getTrackContainer().parent().hasClass('tracks');
}

function isChartTrack() {
  return getTrackContainer().is('li') && getTrackContainer().parent().hasClass('chart');
}

Connector.getTrackArt = () => {
  let artSelector;
  if (isTrackRecommended()) {
    artSelector = 'a img';
  } else if (isTrackSingle()) {
    artSelector = '.fl .pr16 img';
  } else if (isDjTrack()) {
    artSelector = '.image a img';
  } else if (isChartTrack()) {
    artSelector = '.cover a img';
  } else if (isArchivedTrack()) {
    artSelector = 'li:first-child .pr8 a img';
  }
  return domain + getTrackContainer().find(artSelector).attr('src');
}

function parseTitle(title) {
  // we can receive either of:
  //  - TRACK by ARTIST on LABEL
  //  - TRACK by ARTIST
  // TRACK and ARTIST are not always links, so we parse the string
  return {
    artist: 'tofix',
    track: 'tofix'
  }
}
Connector.getTrack = () => {
  if (isTrackRecommended()) {
    return Util.splitArtistTrack(getTrackContainer().find('div a').text()).track;
  } else if (isTrackSingle()) {
    return Util.splitArtistTrack($('#sectionHead h1').text()).track;
  } else if (isDjTrack()) {
    let title = getTrackContainer().find('.title').text())
    return parseTitle(title).track;
  } else if (isChartTrack()) {
    return getTrackContainer().find('.track a').text();
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
    let title = getTrackContainer().find('.title').text())
    return parseTitle(title).artist;
  } else if (isChartTrack()) {
    return getTrackContainer().find('.artist a').text();
  } else if (isArchivedTrack()) {
    return getTrackContainer().find('li:last-child .pr8 div.f24').first().text();
  }
}

Connector.getUniqueId = () => {
  return getTrackContainer().find('.play.player').attr('data-trackid');
}

Connector.isPlaying = () => $('.play.paused').length > 0;

Connector.isTrackArtDefault = (trackArtUrl) => {
  return trackArtUrl === domain + '/images/cover/blank.jpg'
}
