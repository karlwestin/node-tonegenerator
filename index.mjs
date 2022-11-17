/*
 * ToneGenerator for node.js
 * generates raw PCM data for a tone,
 * specify frequency, length, volume and sampling rate
 */

var shapes = {
  sine: function (i, cycle, volume) {
    // i / cycle => value between 0 and 1
    // 0 = beginning of circly
    // 0.25 Math.sin = 1
    // 0.5 Math.sin = 0
    // 0.75 Math.sin = -1
    // 1 Math.sin = 1
    return Math.min(volume * Math.sin((i/cycle) * Math.PI * 2), volume - 1);
  },
  triangle: function (i, cycle, volume) {
    var halfCycle = cycle / 2
    var level

    if (i < halfCycle) {
      level = (volume * 2) * (i / halfCycle) - volume;
    } else {
      i = i - halfCycle
      level = -(volume * 2) * (i / halfCycle) + volume;
    }

    return Math.min(level, volume - 1);
  },
  saw: function (i, cycle, volume) {
    return Math.min((volume * 2) * (i / cycle) - volume, volume - 1);
  },
  square: function (i, cycle, volume) {
    if(i > cycle / 2) {
      return volume - 1;
    }

    return -volume;
  }
}

function generateCycle(cycle, volume, shape) {
  var data = [];
  var tmp;
  var generator = typeof shape == 'function' ? shape : shapes[shape];
  if (!generator) {
    throw new Error('Invalid wave form: "' + shape + '" choose between: ' + Object.keys(shapes));
  }

  for(var i = 0; i < cycle; i++) {
    tmp = generator(i, cycle, volume);
    data[i] = Math.round(tmp);
  }
  return data;
}

function generateWaveForm(opts) {
  opts = opts || {}
  var freq = opts.freq || 440;
  var rate = opts.rate || 44100
  var lengthInSecs = opts.lengthInSecs || 2.0;
  var volume = opts.volume || 30;
  var shape = opts.shape || 'sine';

  var cycle = Math.floor(rate/freq);
  var samplesLeft = lengthInSecs * rate;
  var cycles = samplesLeft/cycle;
  var ret = [];

  for(var i = 0; i < cycles; i++) {
    ret = ret.concat(generateCycle(cycle, volume, shape));
  }

  return ret;
};

module.exports = function() {
  // to support both old interface and the new one:
  var opts = arguments[0]
  if (arguments.length > 1 && typeof opts === "number") {
    opts = {}
    opts.freq = arguments[0]
    opts.lengthInSecs = arguments[1]
    opts.volume = arguments[2]
    opts.rate = arguments[3]
  }

  return generateWaveForm(opts)
}

module.exports.MAX_16 = 32768;
module.exports.MAX_8 = 128;
