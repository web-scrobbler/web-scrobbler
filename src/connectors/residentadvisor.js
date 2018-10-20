'use strict';

Connector.playerSelector = '.content-list';

Connector.playButtonSelector = '.controls .play';

function getTrackContainer() {
  let track = $('.play.paused').parent().parent().parent();
  if (track.is('article')) {
    return track; // recommended track
  } else {
    return track.parent(); // archive track
  }
}

function isTrackInRecommended() {
  return getTrackContainer().is('article');
}

Connector.getTrackArt = () => {
  let artPath;
  if (isTrackInRecommended()) {
    artPath = getTrackContainer().find('a img').attr('src'); // /images/cover/tr-929172.jpg
  } else {
    artPath = getTrackContainer().find('li:first-child .pr8 a img').attr('src');
  }
  return 'https://www.residentadvisor.net' + artPath;
}

Connector.getTrack = () => {
  if (isTrackInRecommended()) {
    return Util.splitArtistTrack(getTrackContainer().find('div a').text()).track;
  } else {
    return getTrackContainer().find('li:last-child .pr8 a.f24').text();
  }
}

Connector.getArtist = () => {
  if (isTrackInRecommended()) {
    return Util.splitArtistTrack(getTrackContainer().find('div a').text()).artist;
  } else {
    return getTrackContainer().find('li:last-child .pr8 div.f24').first().text();
  }
}

Connector.getUniqueId = () => {
  return getTrackContainer().find('.play.player').attr('data-trackid');
}

Connector.isPlaying = () => $('.play.paused').length > 0;

Connector.isTrackArtDefault = (trackArtUrl) => {
  return trackArtUrl === 'https://www.residentadvisor.net/images/cover/blank.jpg'
}
