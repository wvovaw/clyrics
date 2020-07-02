# Clyrics (Console lyrics)

Comand line song lyrics provider powered by Musixmatch

---

## Quick start

### Clone

```sh
$ git clone https://github.com/wvovaw/clyrics.git
```

### Make clyrics executable

```sh
$ cd clyrics
$ chmod +x clyrics.js
$ npm link
```

### Check the result

```sh
$ whereis clyrics
clyrics: /usr/bin/clyrics
```

Now you can run Clyrics just typing clyrics wherever you want

---

## Usage

```sh
$ clyrics -h

Usage: clyrics [options]

Song lyrics in the terminal

Options:
  -V, --version          output the version number
  -a, --artist <artist>  sets artist name
  -t, --title <title>    sets song title
  -h, --help             display help for command
```

---

## Examples

### Search for a concrete song

```sh
$ clyrics -a tool -t 'forty six & 2'

      tool  -  forty six & 2

Join in my, join in my child
And listen, digging through my old numb shadow
My shadow's shedding skin
I've been picking scabs again
I'm down, digging through
My old muscles, looking for a clue
etc...

Writer(s): Keenan Maynard James, Carey Daniel Edwin, Chancellor Justin Gunner,
Jones Adam Thomas
$
```

### Search for top artist songs

```sh
$ clyrics -a 'Michael Jackson'

[0]: Michael Jackson, Justin Timberlake - Love Never Felt So Good
[1]: Michael Jackson - Smooth Criminal
[2]: Michael Jackson - Thriller
[3]: Michael Jackson - They Don't Care About Us
[4]: Michael Jackson - Liberian Girl
[5]: Michael Jackson - Smooth Criminal - 2012 Remaster
[6]: Michael Jackson - Love Never Felt so Good
[7]: Drake, Michael Jackson - Don't Matter To Me
[8]: Michael Jackson - Heal the World
[9]: Michael Jackson - Remember the Time
[10]: Michael Jackson - The Way You Make Me Feel - 2012 Remaster
[11]: Michael Jackson - P.Y.T. (Pretty Young Thing)
[12]: Michael Jackson - Earth Song
[13]: Michael Jackson - You Rock My World
[14]: Michael Jackson - Bad - 2012 Remaster

choose a song >
```

After you input a number of the song you want you will get the lyrics of it

### Search for a song but using only title

```sh
$ clyrics -t 'Trust me'

[0]: 3OH!3 - DONTTRUSTME
[1]: Katy Perry - Trust In Me
[2]: Selena Gomez - Trust in Me
[3]: Men I Trust - Show Me How
[4]: 2Pac - Don't You Trust Me
[5]: Chris Brown - Trust Me
[6]: Beyoncé - Trust In Me
... etc
[29]: SOB X RBE - Trust me

choose a song >
```

Analogiosly as the previous. Choose the number of the song you want and get the
lyrics.

---

Enjoy!
