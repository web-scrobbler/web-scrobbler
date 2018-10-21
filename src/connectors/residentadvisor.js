'use strict';

const domain = 'https://www.residentadvisor.net';

Connector.playerSelector = '.content-list';

Connector.playButtonSelector = '.controls .play';

// This identifies the track element depending on the context of the play button
function getTrackContainer() {
  let ggParent = $('.play.paused').parents().eq(2);
  let level;
  if (ggParent.is('article') || ggParent.parent().hasClass('chart')) {
    level = 0; // recommended or chart track
  } else {
    level = 1 // archive / single  / label / DJ track
  }
  return ggParent.parents().eq(level);
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

function isDjOrLabelTrack() {
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
  } else if (isDjOrLabelTrack()) {
    artSelector = '.image a img';
  } else if (isChartTrack()) {
    artSelector = '.cover a img';
  } else if (isArchivedTrack()) {
    artSelector = 'li:first-child .pr8 a img';
  }
  return domain + getTrackContainer().find(artSelector).attr('src');
}

Connector.getTrack = () => {
  if (isTrackRecommended()) {
    return Util.splitArtistTrack(getTrackContainer().find('div a').text()).track;
  } else if (isTrackSingle()) {
    return Util.splitArtistTrack($('#sectionHead h1').text()).track;
  } else if (isDjOrLabelTrack()) {
    return getTrackContainer().find('.title').contents().first().text();
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
  } else if (isDjOrLabelTrack()) {
    let artistH1 = $('#featureHead h1').text();
    if (artistH1 === '') {
      let contents = getTrackContainer().find('.title').contents();
      if (contents.length === 3) {
        // no link, so need to remove "by"
        let byArtist = getTrackContainer().find('.title').contents().eq(2).text();
        let artist = byArtist.substr(3, byArtist.length);
        return artist
      } else {
        // get the artist link text
        return getTrackContainer().find('.title').contents().eq(3).text();
      }
    } else {
      return artistH1;
    }
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
