ToneGenerator for node.js
====

This thing generates raw PCM data, specified by
a frequency and length in seconds.

```javascript
tone(frequency, lengthInSeconds, [volumen])
```

```javascript
var tone = require("tonegenerator");
var A440 = tone(440, 20, 30); // get PCM data for a 440hz A, 20 seconds, volume 30
```

I'm really unsure what the 'volume' value means, but you can use it to create
different tones with different volumes, let me know how it works for you!

The data is returned as a normal array, so you can do operations on it.
Before writing to a file, you need to convert it to a buffer:

```javascript
var tone = require("tonegenerator");
var header = require("waveheader"); // https://www.npmjs.org/package/waveheader
var fs = require("fs");

// An A-major chord
var tone1 = tone(440, 2, 60);
var tone2 = tone(554.37, 2, 30);
var tone3 = tone(659.26, 2, 30);

// "playing" one tone at the time
// note that at this time, our sound is just an array
// of gain values. By appending the raw PCM data for one after another,
// we can play them in a sequence
var res = [].concat(tone1);
res = res.concat(tone2);
res = res.concat(tone3);

// By adding values of the tones for each sample,
// we play them simultaneously, as a chord
for(var i = 0; i < tone1.length; i++) {
  res.push(tone1[i] + tone2[i] + tone3[i]);
}

// write to file (note conversion to buffer!)
var writer = new fs.createWriteStream("A-major.wav");
writer.write(header( 44100 * 8 )); // 44100 Hz * 8 seconds
writer.write(new Buffer(res));
writer.end();
```
