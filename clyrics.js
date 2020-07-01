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
    let lyrics = await getLyricsMusixmatch(artist , title);
    if(lyrics == null) console.log('Song was not found');
    else {
      console.log('\n\t\t', artist, ' - ', title, '\n\n');
      console.log(lyrics);
    }
  }


  else if(title) { // Searching lyrics by title
    let searchLyricsResult = await searchSongMusixmatch('', title);
    if(searchLyricsResult == undefined) { // Exiting if not found
      console.log('Sorry, nothig was found. Exiting\n');
    }
    else {
      console.log('\n');
      for(let l of searchLyricsResult) {
        console.log('[' + searchLyricsResult.indexOf(l) + ']: ' + l);
      }
      console.log('\n');

    }
    // FIXME: when there is no input songNumber is not initialized and its type
    // is String if statement pases and i can't realize wtf is going on there
    let songNumber = 0; // 0 by default
    try {
      songNumber = await prompt('choose a song >');
      if(songNumber !== undefined && !isNaN(songNumber)) {
        console.log(searchLyricsResult[songNumber]);
        const artist = searchLyricsResult[songNumber].split(' - ')[1];
        const title = searchLyricsResult[songNumber].split(' - ')[0];
        let lyrics = await getLyricsMusixmatch(artist , title);
        if(lyrics == null) console.log('Song was not found');
        else {
          console.log('\n\t\t', searchLyricsResult[songNumber], '\n\n');
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


  else if(artist) { // Searching lyrics by artist
    // Firtsly try to find artist's page
    let searchLyricsResult = await searchSongMusixmatch(artist, '');
    if(searchLyricsResult == undefined) { // Exiting if not found
      console.log('Artist was not found. Make sure You\'ve not misstaken.\n');
    }
    else { // Output lyrics search result
      console.log('\n');
      for(let l of searchLyricsResult) {
        console.log('[' + searchLyricsResult.indexOf(l) + ']: ' + l);
      }
      console.log('\n');
    }
    // TODO: offer user to choose a song
    let songNumber = 0; // 0 by default
    try {
      songNumber = await prompt('choose a song >');
      if(!isNaN(songNumber) && songNumber != undefined) {
        console.log(searchLyricsResult[songNumber]);
        const artist = searchLyricsResult[songNumber].split(' - ')[1];
        const title = searchLyricsResult[songNumber].split(' - ')[0];
        let lyrics = await getLyricsMusixmatch(artist , title);
        if(lyrics == null) console.log('Song was not found');
        else {
          console.log('\n\t\t', searchLyricsResult[songNumber], '\n\n');
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
