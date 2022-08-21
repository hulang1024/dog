let prng;

export function initRandomSeed(seed) {
  prng = new Math.seedrandom(seed);
  console.log('random seed=', seed);
}

export function random() {
  return prng();
}

export function randomRange(min, max) {
  return random() * (max - min) + min;
}