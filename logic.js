const request = require('request');
const cherio = require('cheerio');

// Returns lyrics for a concrete song
const getLyricsMusixmatch = async (artist, title) => {
  let url = 'https://musixmatch.com/lyrics/'
    + encodeURI(artist.toLowerCase().trim().replace(/ /g, '-'))
    + '/'
    + encodeURI(title.toLowerCase().trim().replace(/ /g, '-'));

  let songPage = await new Promise((resolve, reject) => {
    request(url, (error, response, html) => {
      if(!error && response.statusCode == 200){
        const $ = cherio.load(html);
        let spans;
        if($('.lyrics__content__warning')[0]) {
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
      else reject(error);
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
      + encodeURI(artist.toLowerCase().trim().replace(/ /g, '%20') + '%20')
      + encodeURI(title.toLowerCase().trim().replace(/ /g, '%20')) + '/tracks';
    console.log(url);
  }
  else if(artist == '') { // Search by song title
    url = url
      + 'search/'
      + encodeURI(title.toLowerCase().trim().replace(/ /g, '%20')) + '/tracks';
    console.log(url);
  }
  else if(title == '') { // Find top artists songs
    url = url
      + 'artist/' 
      + encodeURI(artist.toLowerCase().trim().replace(/ /g, '-'));
    console.log(url);
  }
  else return(null);

  let searchResult = await new Promise((resolve, reject) => {
    request(url, (error, response, html) => {
      if(!error && response.statusCode == 200){
        const $ = cherio.load(html);
        let results = [];
        $('.track-card').each((i, el) => {
          const artist = $(el).find('.title').text();
          const title = $(el).find('.artist').text();
          results.push(artist + ' - ' + title);
        });
        resolve(results);
      }     
      else reject(error);
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
