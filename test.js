var assert = require('assert')
var tonegenerator = require('./')

console.log('Testing Tonegenerator...')


var tone1 = tonegenerator(440, 2, 10)
var tone2 = tonegenerator(440, 2, 30)
var tonefrequency = tonegenerator(440, 2, 10, 22050)

assert(Array.isArray(tone1), 'Data is an array')

// takes the volume argument - 1 as max
assert.strictEqual(Math.max.apply(Math, tone1), 9)
// takes the volume argument as min
assert.strictEqual(Math.min.apply(Math, tone1), -10)
// takes the volume argument as max
assert.strictEqual(Math.max.apply(Math, tone2), 29)

assert.equal(tone1.length/2, tonefrequency.length, 'when halving audio sampling rate, the array length should be half of default')

console.log('...done')
