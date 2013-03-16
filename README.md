ToneGenerator for node.js
====

This thing generates raw PCM data, specified by 
a frequency and length in seconds.

```javascript
var tone = require("tonegenerator");
var A440 = tone(440, 20); // get PCM data for a 440hz A, 20 seconds.
```
