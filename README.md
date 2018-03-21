ToneGenerator for node.js
====

This thing generates an array of numbers in waveforms. This waveform can be written into a wavefile as raw PCM data.
It does not play the sounds. If you want to play sounds, make sure to read the examples on how to write wave files below.

## Generating Tones:

```javascript
var tone = require('tonegenerator')

// New Interface! More options!!
var tonedata = tone({
  freq: 440,
  lengthInSecs: 2.0,
  volume: 30,
  rate: 44100,
  shape: 'triangle'
})

// The old interface, still available for compatibility
var tonedata = tone(frequency, lengthInSeconds, volume = 30, rate = 44100)
```

#### Using the new interface
- **freq** frequency in hertz. *defaults to 440*
- **lengthInSecs** controls the length of the array output together with the samplerate *defaults to 2.0*
- **volume** controls max/min for the array values. If you intend to write 8-bit it should be less than or equal to tone.MAX_8, if 16 bit it should be less than or equal to tone.MAX_16. *defaults to 30*
- **rate** sample rate, number of samples per second. Together with lengthInSecs, this define the length of the output array (lengthInSeccs * rate). *defaults to 44100*
- **shape** controls the wave shape. Options are *'triangle', 'square', 'sine', 'saw'*. You can also pass in a custom function, see the tests for an example of this. *defaults to 'sine'*

#### Using the old interface
The old interface takes four arguments: *freq, lengthInSecs, volume, rate*.
**volume** and **rate** are optional, the default is shown above.
**Shape is not available in the old interface. If you want to specify rate, you have to specify volume!**

#### Useful constants
```javascript
tone.MAX_8 // max volume to be used with 8-bit sound
tone.MAX_16 // max volume for 16 bit sound

```javascript
var tone = require('tonegenerator');
var A440 = tone({ freq: 440, lengthInSeconds: 20, volume: 30 }); // get PCM data for a 440hz A, 20 seconds, volume 30
var A440_low_sample = tone(440, 20, 30, 22050); // (old interface) this array has lower sample rate and will only be half as long
```

The data is returned as a normal array, so you can do operations on it.

## Combining notes

```javascript
// An A-major chord
var tone1 = tone({ freq: 440, lengthInSecs: 2, volume: 60 })
var tone2 = tone({ freq: 554.37, lengthInSecs: 2, volume: 30 })
var tone3 = tone({ freq: 659.26, lengthInSecs: 2, volume: 30 })

// "playing" one tone at the time
// note that at this time, our sound is just an array
// of gain values. By appending the raw PCM data for one after another,
// we can play them in a sequence
var res = tone1.concat(tone2, tone3)

// By adding values of the tones for each sample,
// we play them simultaneously, as a chord
for(var i = 0; i < tone1.length; i++) {
  res.push(tone1[i] + tone2[i] + tone3[i])
}
```

## Volume on 8-bit and 16-bit PCM data

The meaning of the 'volume' value depends on whether you're creating 8-bit or 16-bit data. For 8-bit data, the max volume to avoid distortion is 128. For 16-bit data, the max volume is 32768. Those values are available as **require('tonegenerator').MAX_8** and **require('tonegenerator').MAX_16** respectively.

## Writing 8-bit data to a Wave File
Before writing your PCM data to a file, you need to convert it to a buffer of UInt8 values. 8-bit wave data goes from 0-255, so we need to add 128 to each value:

```javascript
var tone = require('tonegenerator');
// Use this package to write a header for the wave file
// https://www.npmjs.org/package/waveheader
var header = require('waveheader');
var fs = require('fs');

var file = fs.createWriteStream('8bit-example.wav')
var samples = tone({ freq: 440, lengthInSecs: 2, volume: tone.MAX_8 })

file.write(header(samples.length, {
  bitDepth: 8
}))

// Convert -128 -> 127 range into 0 -> 255
var data = Uint8Array.from(samples, function (val) {
  return val + 128
})

if (Buffer.from) { // Node 5+
  buffer = Buffer.from(data)
} else {
  buffer = new Buffer(data)
}
file.write(buffer)
file.end()
```

## Writing 16-bit data to a Wave file

16-bit data requires a little bit more work, since we need to take Endianess into account. Unlike 8-bit data, the volumes does not start at 0, but at -32768.

All the references to data length need to be doubled.

```javascript
var tone = require('tonegenerator');
var header = require('waveheader');
var fs = require('fs');

var file = fs.createWriteStream('16bit-example.wav')
var samples = tone({ freq: 440, lengthInSecs: 2, volume: tone.MAX_16 })

file.write(header(samples.length * 2, {
  bitDepth: 16
}))

var data = Int16Array.from(samples)

var size = data.length * 2 // 2 bytes per sample
if (Buffer.allocUnsafe) { // Node 5+
  buffer = Buffer.allocUnsafe(size)
} else {
  buffer = new Buffer(size)
}

data.forEach(function (value, index) {
  buffer.writeInt16LE(value, index * 2)
})

file.write(buffer)
file.end()
```

## Writing stereo sounds

In stereo wave data, the sample for each channel comes right after each other.
The principle looks like `[sample0-1 sample0-2 sample1-1 sample1-2]`. So we need to
first generate the data for each channel, then interleave them.


```javascript
var tone = require('tonegenerator');
var header = require('waveheader');
var fs = require('fs');

var file = fs.createWriteStream('16bit-stereo.wav')
// A loud A for channel 1
var channel1 = tone({ freq: 440, lengthInSecs: 2, volume: tone.MAX_16 })
// A not so loud C for channel 2
var channel2 = tone({ freq: 554.37, lengthInSecs: 2, volume: tone.MAX_16 / 4 })

// create an array where the 2 channels are interleaved:
var samples = []
for (var i = 0; i < channel1.length; i++) {
  samples.push(channel1[i])
  samples.push(channel2[i])
}

file.write(header(samples.length * 2, {
  channels: 2,
  bitDepth: 16
}))

var data = Int16Array.from(samples)

var size = data.length * 2 // 2 bytes per sample
if (Buffer.allocUnsafe) { // Node 5+
  buffer = Buffer.allocUnsafe(size)
} else {
  buffer = new Buffer(size)
}

data.forEach(function (value, index) {
  buffer.writeInt16LE(value, index * 2)
})

file.write(buffer)
file.end()
```

## Reading:

* [Wave PCM SoundFile format](http://soundfile.sapp.org/doc/WaveFormat/) - make sure to read the 'Notes' section
* [ABC of Uncompressed digital audio](http://blog.bjornroche.com/2013/05/the-abcs-of-pcm-uncompressed-digital.html)
