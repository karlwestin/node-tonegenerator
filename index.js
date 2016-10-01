/*
 * ToneGenerator for node.js
 * generates raw PCM data for a tone,
 * specify frequency, length, volume and sampling rate
 */
function generateCycle(cycle, volume) {
  var data = [];
  var tmp;
  for(var i = 0; i < cycle; i++) {
    tmp = Math.min(volume * Math.sin((i/cycle) * Math.PI * 2), volume - 1)
    data[i] = Math.round(tmp);
  }
  return data;
}

module.exports = function(freq, lengthInSecs, volume, rate) {
  freq = freq || 440;
  rate = rate || 44100
  lengthInSecs = lengthInSecs || 2.0;
  volume = volume || 30

  var cycle = Math.floor(rate/freq);
  var samplesLeft = lengthInSecs * rate;
  var cycles = samplesLeft/cycle;
  var ret = [];

  for(var i = 0; i < cycles; i++) {
    ret = ret.concat(generateCycle(cycle, volume));
  }

  return ret;
};

module.exports.MAX_16 = 32768;
module.exports.MAX_8 = 128;
