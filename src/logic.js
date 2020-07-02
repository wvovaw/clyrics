const request = require('request');
const cherio = require('cheerio');

// Returns lyrics for a concrete song
const getLyricsMusixmatch = async (explicit_url, artist, title) => {
  let url = 'https://musixmatch.com';
  if(explicit_url !== '') { url += explicit_url; }
  else {
    url +=
       '/lyrics/'
      + encodeURI(artist.toLowerCase().trim().replace(/, /g, '-').replace(/\s+/g, '-').replace(/[^a-zA-Zа-яА-Я0-9- ]/g, ''))
      + '/'
      + encodeURI(title.toLowerCase().trim().replace(/[^a-zA-Zа-яА-Я0-9 ]/g, '').replace(/\s+/g, '-'));
  }
  console.log(url);

  let songPage = await new Promise((resolve, reject) => {
    request(url, (error, response, html) => {
      if(!error && response.statusCode == 200){
        const $ = cherio.load(html);
        let spans;
        if($('.mxm-lyrics-not-available')[0]) {
          const reason = $('.mxm-empty__title').text();
          resolve('\nLyrics are unavaliable\n\tReason: ' + reason);
        }
        if($('.lyrics__content__error')[0]) {
          console.log('Errors were found in the lyrics!');
          spans = $('.lyrics__content__error');
          console.log(spans.text());
        } 
        else if($('.lyrics__content__warning')[0]) {
          console.log('The lyrics are waiting for review!');
          spans = $('.lyrics__content__warning');
        } 
        else {
          spans = $('.lyrics__content__ok');
        } 
        let copyright = $('.mxm-lyrics__copyright');
        const songBodyLyrics = spans.text() + '\n\n\n' + copyright.text();
        resolve(songBodyLyrics);
      }     
      else resolve();
    });
  }).catch(() => {
    console.log('Song page doesn\'t exist. Performing a search ...');
  });

  if(songPage != undefined) {
    let lyrics = songPage.replace(/<\/?[^>]+(>|$)/g, '');
    lyrics = lyrics.replace(/&apos;/g, '\'');
    lyrics = lyrics.replace(/&quote;/g, '\'');
    return(lyrics);
  }
  else return(null);
};

// Returns list of the relevant songs
const searchSongMusixmatch = async (artist='', title='') => {
  let url = 'https://www.musixmatch.com/';
  
  if(artist != '' && title != '') { // Common search 'artist - title'
    url = url 
      + 'search/'
      + encodeURI(artist.toLowerCase().trim().replace(/[^a-zA-Zа-яА-Я0-9 ]/g, ' ')).replace(/\s+/g, '%20') + '%20'
      + encodeURI(title.toLowerCase().trim().replace(/[^a-zA-Zа-яА-Я0-9 ]/g, ' ')).replace(/\s+/g, '%20') + '/tracks';
    console.log(url);
  }
  else if(artist == '') { // Search by song title
    url = url
      + 'search/'
      + encodeURI(title.toLowerCase().trim().replace(/[^a-zA-Zа-яА-Я0-9 ]/g, ' ')).replace(/\s+/g, '%20') + '/tracks';
    console.log(url);
  }
  else if(title == '') { // Find top artists songs
    url = url
      + 'artist/' 
      + encodeURI(artist.toLowerCase().trim().replace(/[^a-zA-Zа-яА-Я0-9 ]/g, ' ').replace(/\s+/g, '-'));
    console.log(url);
  }
  else return(null);

  let searchResult = await new Promise((resolve, reject) => {
    request(url, (error, response, html) => {
      if(!error && response.statusCode == 200){
        const $ = cherio.load(html);
        let fullSongName = [];
        let songLinks = [];
        $('.track-card').each((i, trackCardEl) => {
          let artists = '';
          $(trackCardEl).find('.artist').each((j, artistEl) => {
            artists += $(artistEl).text() + ', ';
          });
          artists = artists.slice(0, -2);
          const title = $(trackCardEl).find('.title').text();
          const link = $(trackCardEl).find('.title').attr('href');
          fullSongName.push(artists + ' - ' + title);
          songLinks.push(link);
        });
        const result = [fullSongName, songLinks];
        resolve(result);
      }     
      else resolve();
    });
  }).catch(() => {
    console.log('searchSongMusixmatch: Nothing was found.');
  });

  if(searchResult != undefined && searchResult.length > 0) {
    return searchResult;
  }
  else return(null);
};

module.exports = { getLyricsMusixmatch, searchSongMusixmatch };
