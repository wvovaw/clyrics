const request = require('request');
const cherio = require('cherio');

const getLyrics = async (artist, title) => {
  let url = 'https://genius.com/'
    + artist.toLowerCase().trim().replace(/ /g, '-')
    + '-'
    + title.toLowerCase().trim().replace(/ /g, '-')+ '-lyrics';

  let songPage = await new Promise((resolve, reject) => {
    request(url, (error, response, html) => {
      if(!error && response.statusCode == 200){
        const $ = cherio.load(html);
        const songBodyLyrics = $('.lyrics').text();
        resolve(songBodyLyrics);
      }     
      else reject(error);
    });
  }).catch(() => {
    console.log('Song page don\'t exists. Perform searching ...');
  });
  
  if(songPage != undefined) {
    let lyrics = songPage.replace(/<\/?[^>]+(>|$)/g, '');
    lyrics = lyrics.replace(/&apos;/g, '\'');
    lyrics = lyrics.replace(/&quote;/g, '\'');
    return(lyrics);
  }
  else return(null);
};

const searchSong = async (artist='', title='') => {
  let url = 'https://genius.com/search?q=';
  if(artist != '' && title != '') {
    url = url 
      + artist.toLowerCase().trim().replace(/ /g, '%20') + '%20'
      + title.toLowerCase().trim().replace(/ /g, '%20');
  }
  else if(artist == '') {
    url = url
      + title.toLowerCase().trim().replace(/ /g, '%20');
  }
  else if(title == '') {
    url = url
      + artist.toLowerCase().trim().replace(/ /g, '%20');
  }
  else return(null);

  let searchResult = await new Promise((resolve, reject) => {
    request(url, (error, response, html) => {
      if(!error && response.statusCode == 200){
        const $ = cherio.load(html);
        console.log($.text());
        let results = [];
        $('.mini_card-title_and_subtitle').each((i, el) => {
          const artist = $(el).find('.mini_card-subtitle').text();
          const title = $(el).find('.mini_card-subtitle').text();
          results += '[' + i + ']: ' + artist + ' - ' + title;
        });
        resolve(results);
      }     
      else reject(error);
    });
  }).catch(() => {
    console.log('None was found.');
  });

  if(searchResult != undefined) {
    return searchResult;
  }
  else return(null);
};

module.exports = {getLyrics, searchSong};
