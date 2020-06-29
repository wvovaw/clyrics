#!/usr/bin/env node
const { getLyrics, searchSong} = require('./logic');
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

  if(artist && title) {
    let lyrics = await getLyrics(artist , title);
    if(lyrics == null) console.log('Song was not found');
    else {
      console.log('\'', artist, '\' - \'', title, '\'\n');
      console.log(lyrics);
    }
  }
  else if(title) {
    // Find songs and prompt results
    let searchResult = await searchSong(title);
    console.log(searchResult);
  }
};
main();
