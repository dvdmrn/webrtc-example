# Auditory Context for Videoconferencing
Making predictions about auditory context in the browser using tensorflow.js and yamnet.

*Requires Chrome* to run. You can run it in Firefox in theory but you will need to change user setting flags and nobody has time for that in this economy!

File descriptions
```
+ scripts/
    |_ ...
    |_ yamnetparsing.js - predictions and audio processing
    |_ particle_display.js - particle rendering
    |_ ...
+ libs/
    |_ tensorflow27.js - v. 2.7.0 of tf.js (currently using a CDN but keeping for backup)
    |_ yamnet/ - yamnet weights (currently using a CDN but keeping for backup)
    |_ p5.min.js - minimized version of p5 viz library
+ index.html - where the party's at
```