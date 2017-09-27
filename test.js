var assert = require('assert')
var tonegenerator = require('./')

console.log('Testing Tonegenerator...')


var tone1 = tonegenerator({ freq: 440, lengthInSecs: 2, volume: 10 })
var tone2 = tonegenerator({ freq: 440, lengthInSecs: 2, volume: 30 })
var tonefrequency = tonegenerator({ freq: 440, lengthInSecs: 2, volume: 10, rate: 22050 })


console.log('Testing Sine Waves')
assert(Array.isArray(tone1), 'Data is an array')

// takes the volume argument - 1 as max
assert.strictEqual(Math.max.apply(Math, tone1), 9)
// takes the volume argument as min
assert.strictEqual(Math.min.apply(Math, tone1), -10)
// takes the volume argument as max
assert.strictEqual(Math.max.apply(Math, tone2), 29)

assert.equal(tone1.length/2, tonefrequency.length, 'when halving audio sampling rate, the array length should be half of default')


console.log('Testing Triangle Waves')
var tone4 = tonegenerator({ freq: 440, lengthInSecs: 2, volume: 10, shape: 'triangle' })
// test that max is correct
assert.strictEqual(Math.max.apply(Math, tone4), 9)
// test that min is correct
assert.strictEqual(Math.min.apply(Math, tone4), -10)
// test that there are intermediate values
assert(tone4.includes(0))
assert(tone4.includes(-1))


console.log('Testing Saw Waves')
var tone5 = tonegenerator({ freq: 440, lengthInSecs: 2, volume: 10, shape: 'saw' })
// test first val, should be min
assert.strictEqual(tone5.shift(), -10)
// test last val, should be max
assert.strictEqual(tone5.pop(), 9)
// test that there's intermediate values generated
assert(tone5.includes(0))


console.log('Testing Square Waves')
var tone6 = tonegenerator({ freq: 440, lengthInSecs: 2, volume: 10, shape: 'square' })
// test first val
assert.strictEqual(tone6.pop(), 9)
// test last val
assert.strictEqual(tone6.shift(), -10)
// make sure there's no intermediate values
assert(!tone6.includes(0))


console.log('Testing Custom Waves')
var tone7 = tonegenerator({
  freq: 440,
  lengthInSecs: 2,
  volume: 11,
  shape: function (i, cycle, volume) {
    return volume - 1;
  }
})
// test first val
assert.strictEqual(tone7.pop(), 10)
// test last val
assert.strictEqual(tone7.shift(), 10)
// make sure there's no intermediate values
assert(!tone7.includes(0))


console.log('Testing old-style interface')
var tone8 = tonegenerator(440, 2, 10)
var tone9 = tonegenerator(440, 2, 30)
var tonefrequency2 = tonegenerator(440, 2, 10, 22050)
// takes the volume argument - 1 as max
assert.strictEqual(Math.max.apply(Math, tone8), 9)
// takes the volume argument as min
assert.strictEqual(Math.min.apply(Math, tone8), -10)
// takes the volume argument as max
assert.strictEqual(Math.max.apply(Math, tone9), 29)

assert.equal(tone8.length/2, tonefrequency2.length, 'when halving audio sampling rate, the array length should be half of default')

console.log('...done')
