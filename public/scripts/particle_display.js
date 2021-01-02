// todo - nov 23 2020
// add fequency based spawning
// but too much for sure
// maybe choose top 3 candidates like old method (which only chose 1 instead?)


// ================================================================================
// GLOBALS
// ================================================================================


let capture;
let system;

let _size = 5;
let _speed = 2;
let _origin_spread = 1;
let _birthrate = 1
let _decayRate = 0.001;

let last = 0;


let freqThreshold = -10; 

var spawnRate = 1000;

var _EXP_GAIN = 0.2

const a1 = 0.01
var filt0 = new OnePole(a1);


// ================================================================================
// Main fns
// ================================================================================


function setup() {
  let canv = createCanvas(640, 480);
  canv.id('canvas-viz');
  // canv.parent("video-grid")
  capture = createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide();
  canv.hide()
  
  // system = new ParticleSystem(createVector(0, (height/3)*2));
  system = new ParticleSystem(createVector(0, height / 2));

}

function draw() {
  background(69);
  clear();
  image(capture, 0, 0, 640, 480);
  particleControl();
  // system.addParticle();  
  // system.run();

}

function keyPressed() {
  if (keyCode == 32){
    let fullSpectrum = _parameters.acoustic.spec.slice(_parameters.acoustic.spec.length - 64, _parameters.acoustic.spec.length);
    let spec = decimateBuckets(fullSpectrum);
    console.log(spec)
  }
}

function decimateBuckets(freqArr){
  // freqArr := a 64x1 array
  // reduces the frequency spectrum from 64 bins --> 8 by
  // iteratively taking the average of 8 bins
  
  const decimationFactor = 8;
  bins = new Array(decimationFactor)

  for (let i = 0; i < freqArr.length; i+=decimationFactor) {
    bins[i/decimationFactor] = arrMean(freqArr.slice(i,i+decimationFactor))
  }
  return(bins)
}



// ...............................................................................

function particleControl(){
  let threshold = 1000

  // !!! uncomment for new way of adding particles
  // let fullSpectrum = _parameters.acoustic.spec.slice(_parameters.acoustic.spec.length - 64, _parameters.acoustic.spec.length);
  // let spectrum = decimateBuckets(fullSpectrum);
  // for (let i = 0; i < spectrum.length; i++) {
  //   if(spectrum[i] > freqThreshold){
  //     system.addParticleSpectrum(i*8, spectrum[i])
  //   }
  // }
  
  
  // !!! old way of adding particles ----------------
    if ((millis() - last) > (threshold/(15000*(_parameters.acoustic.amp)))) {
      // console.log("max key: ",indexOfMax( _parameters.acoustic.spec.slice(_parameters.acoustic.spec.length - 64, _parameters.acoustic.spec.length)));
      system.addParticle();
      last = millis();
    }
    system.run();

}


// ================================================================================
// PARTICLE 
// ================================================================================

// A simple Particle class
let Particle = function (position, size, speed, boost, artificial, natural, indoor) {
  this.size = size**1.1;
  this.speed = speed;
  // !!!
  this.boost = boost;
  this.red = artificial*255;
  this.green = natural*255;

  this.pointyCorner = indoor;


  this.acceleration = createVector(0, 0);
  // this.acceleration = createVector(noise(millis()), (noise(millis())-0.5)/2);

  this.velocity = createVector(random(speed, 2 * speed), random(-0.08, 0.08));

  // this.velocity = createVector(random(speed, 2*speed), random(-0.08,0.08));
  let posSpread = (_parameters.semantic.is_background)*(height/4)
  // let posSpread = 0.5;
  this.position = position.copy().add(
                      createVector(-2, 
                                  random(-posSpread, posSpread)
                                  ));
  this.lifespan = 666;
};

Particle.prototype.run = function () {
  this.size -= (this.size**1.1/100);
  this.update();
  this.display();
  
};

// Method to update position
Particle.prototype.update = function () {


  this.velocity.add(this.acceleration);
  // var lenoise = this.velocity.mult(createVector(Math.sin(millis()) + 1, 1));

  this.position.add(this.velocity);
  // this.position.add(createVector(1, 2 * Math.sin(millis()/1000)))
  this.position.add(createVector(this.boost, 
                                 (this.boost/1.2) * Math.sin(millis()*(this.boost/2) / 1000)
  ));

  this.lifespan -= 2;
};

// Method to display
Particle.prototype.display = function () {  
  // fill(127, 0, 255);

  // this.size = (this.size - 10);

  fill(this.red,
       this.green,
       200);
  let d = Math.max(0,this.size)
  // ellipse(this.position.x, this.position.y, d, d);
  square(this.position.x, 
         this.position.y, 
         d, 
         Math.max(50 - (50 * this.pointyCorner),0)
         );
  blendMode(ADD)
};

// Is the particle still useful?
Particle.prototype.isDead = function () {
  return this.lifespan < 0;
};


// ================================================================================
// PARTICLE SYSTEM
// ================================================================================


let ParticleSystem = function (position) {
  this.origin = position.copy()
  this.particles = [];
};

ParticleSystem.prototype.addParticle = function () {
  let maxFreq = indexOfMax(_parameters.acoustic.spec.slice(_parameters.acoustic.spec.length - 64, _parameters.acoustic.spec.length));
  let boost = mapValues(maxFreq,0,64,1,15) // goes faster with higher freq
  this.particles.push(new Particle(this.origin, 
                                   (_parameters.acoustic.amp) * 500,
                                    _speed,
                                    boost,
                                    _parameters.semantic.is_artificial,
                                    _parameters.semantic.is_nature,
                                    _parameters.semantic.is_indoor
                                    ));
  
};

ParticleSystem.prototype.addParticleSpectrum = function (freqBand, freqBandPower) {
  let maxFreq = freqBand;
  let boost = mapValues(maxFreq, 0, 64, 1, 15) // goes faster with higher freq
  this.particles.push(new Particle(this.origin,
    (freqBandPower+Math.abs(freqThreshold)) * 10,
    _speed,
    boost,
    _parameters.semantic.is_artificial,
    _parameters.semantic.is_nature,
    _parameters.semantic.is_indoor
  ));

};


ParticleSystem.prototype.run = function () {
  for (let i = this.particles.length - 1; i >= 0; i--) {
    let p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }
};