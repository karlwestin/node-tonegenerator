var assert = require('assert')
var tonegenerator = require('./')

console.log('Testing Tonegenerator...')


var tone1 = tonegenerator(440, 2, 10)
var tone2 = tonegenerator(440, 2, 30)

assert(Array.isArray(tone1), 'Data is an array')

assert.strictEqual(Math.max.apply(Math, tone1), 10, 'takes the volume argument as max')
assert.strictEqual(Math.min.apply(Math, tone1), -10, 'takes the volume argument as max')

assert.strictEqual(Math.max.apply(Math, tone2), 30, 'takes the volume argument as max')

console.log('...done')
