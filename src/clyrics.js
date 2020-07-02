#! /usr/bin/env node
const { searchSongMusixmatch, getLyricsMusixmatch } = require('./logic');
const { program } = require('commander');

const main = async () => {
  program
    .version('0.0.1')
    .description('Song lyrics in the terminal');

  program
    .option('-a, --artist <artist>', 'sets artist name')
    .option('-t, --title <title>', 'sets song title')
    .parse(process.argv);

  const artist = program.artist;
  const title = program.title;

  if(artist && title) { // Common search 'artist - title'
    let lyrics = await getLyricsMusixmatch('', artist , title);
    if(lyrics == null) console.log('Song was not found');
    // @todo make search if not found
    else {
      console.log('\n\t\t', artist, ' - ', title, '\n');
      console.log(lyrics);
    }
  }


  else if(title) { // Searching lyrics by title
    let searchLyricsResult = await searchSongMusixmatch('', title);
    let songName;
    let links;
    if(searchLyricsResult == null || searchLyricsResult == undefined || searchLyricsResult[0].length < 1) { // Exiting if not found
      console.log('Sorry, nothig was found. Exiting\n');
    }
    else { // Output lyrics search result
      songName = searchLyricsResult[0];
      links = searchLyricsResult[1];
      console.log('\n');
      for(let l of songName) {
        console.log('[' + songName.indexOf(l) + ']: ' + l);
      }
      console.log('\n');
      let songNumber = 0; // 0 by default
      try {
        songNumber = await prompt('choose a song >');
        if(songNumber != '' && !isNaN(songNumber) && songNumber < links.length && songNumber > -1) {
          console.log(songName[songNumber]);
          let lyrics = await getLyricsMusixmatch(links[songNumber], '', '');
          if(lyrics == null) console.log('Song was not found');
          else {
            console.log('\n\t\t', songName[songNumber], '\n\n');
            console.log(lyrics);
          }
        }
        else {
          console.log('Wrong input. Exiting');
        }
        process.stdin.pause();
      }
      catch(err) {
        console.log('Input error!');
        console.log(err);
      }
    }
  }


  else if(artist) { // Searching lyrics by artist
    // Firtsly try to find artist's page
    let searchLyricsResult = await searchSongMusixmatch(artist, '');
    let songName;
    let links;
    if(searchLyricsResult == null || searchLyricsResult == undefined) { // Exiting if not found
      console.log('Artist was not found. Make sure You\'ve not misstaken.\n');
    }
    else { // Output lyrics search result
      songName = searchLyricsResult[0];
      links = searchLyricsResult[1];
      console.log('\n');
      for(let l of songName) {
        console.log('[' + songName.indexOf(l) + ']: ' + l);
      }
      console.log('\n');
      let songNumber = 0; // 0 by default
      try {
        songNumber = await prompt('choose a song >');
        if(songNumber != '' && !isNaN(songNumber)) {
          console.log(songName[songNumber]);
          let lyrics = await getLyricsMusixmatch(links[songNumber], '', '');
          if(lyrics == null) console.log('Song was not found');
          else {
            console.log('\n\t\t', songName[songNumber], '\n\n');
            console.log(lyrics);
          }
        }
        else {
          console.log('Wrong input. Exiting');
        }
        process.stdin.pause();
      }
      catch(err) {
        console.log('Input error!');
        console.log(err);
      }
    }
  }


  process.exit();
};

// Used for user input
const prompt = (question) => {
  return new Promise((resolve, reject) => {
    const stdin = process.stdin;
    const stdout = process.stdout;
    stdin.resume();
    stdout.write(question);
    stdin.on('data', data => resolve(data.toString().trim()));
    stdin.on('error', err => reject(err));
  });
};
main();
