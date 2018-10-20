'use strict';

const domain = 'https://www.residentadvisor.net';

Connector.playerSelector = '.content-list';

Connector.playButtonSelector = '.controls .play';

function getTrackContainer() {
  let track = $('.play.paused').parents().eq(2);
  if (track.is('article') || track.parent().hasClass('chart')) {
    return track; // recommended or chart track
  } else if (track.is('li')) {
    return track.parents().eq(2); // DJ track
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
  return getTrackContainer().is('li') && !getTrackContainer().parent().hasClass('chart');
}

function isChartTrack() {
  return getTrackContainer().is('li') && getTrackContainer().parent().hasClass('chart');
}

Connector.getTrackArt = () => {
  let img;
  if (isTrackRecommended()) {
    img = getTrackContainer().find('a img');
  } else if (isTrackSingle()) {
    img = getTrackContainer().find('.fl .pr16 img');
  } else if (isDjTrack()) {
    img = getTrackContainer().find('.image a img');
  } else if (isChartTrack()) {
    img = getTrackContainer().find('.cover a img');
  } else if (isArchivedTrack()) {
    img = getTrackContainer().find('li:first-child .pr8 a img');
  }
  return domain + img.attr('src');
}

Connector.getTrack = () => {
  if (isTrackRecommended()) {
    return Util.splitArtistTrack(getTrackContainer().find('div a').text()).track;
  } else if (isTrackSingle()) {
    return Util.splitArtistTrack($('#sectionHead h1').text()).track;
  } else if (isDjTrack()) {
    return getTrackContainer().find('.title a').text();
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
    let title = getTrackContainer().find('.title').clone();
    title.find('a').remove();
    title = title.text().trim();
    return title.substr(3, title.length - 6);
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
