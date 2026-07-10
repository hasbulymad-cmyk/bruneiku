// Generates the horror SFX as 16-bit mono WAVs in public/.
// The environment's ffmpeg build has no lavfi, so synthesize PCM directly.
import { writeFileSync } from "node:fs";

const SR = 44100;

const writeWav = (path, samples) => {
  const data = Buffer.alloc(samples.length * 2);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    data.writeInt16LE(Math.round(s * 32767), i * 2);
  }
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(SR, 24);
  header.writeUInt32LE(SR * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(data.length, 40);
  writeFileSync(path, Buffer.concat([header, data]));
  console.log(path, ((header.length + data.length) / 1024).toFixed(0) + "KB");
};

const seconds = (d) => Math.floor(d * SR);

// Deterministic PRNG so renders are reproducible
let seed = 1234567;
const rand = () => {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff - 0.5;
};

// Sub-bass impact with pitch drop
{
  const n = seconds(1.6);
  const out = new Float32Array(n);
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const freq = 52 - 22 * Math.min(t, 1);
    phase += (2 * Math.PI * freq) / SR;
    out[i] = Math.exp(-3.5 * t) * Math.sin(phase) * 0.95;
  }
  writeWav("public/sfx-boom.wav", out);
}

// Noise riser: lowpassed noise swelling in over 2.2s
{
  const n = seconds(2.2);
  const out = new Float32Array(n);
  let lp = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const swell = Math.pow(t / 2.2, 2.2);
    const cutoff = 0.02 + 0.25 * (t / 2.2); // opens up as it rises
    lp += cutoff * (rand() * 2 - lp);
    const tail = t > 2.0 ? (2.2 - t) / 0.2 : 1;
    out[i] = lp * swell * tail * 0.8;
  }
  writeWav("public/sfx-riser.wav", out);
}

// Low rumble underscore, 20s of heavily lowpassed noise
{
  const n = seconds(20);
  const out = new Float32Array(n);
  let lp1 = 0;
  let lp2 = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    lp1 += 0.008 * (rand() * 2 - lp1);
    lp2 += 0.02 * (lp1 - lp2);
    const fadeIn = Math.min(t / 1.5, 1);
    const fadeOut = Math.min((20 - t) / 1.5, 1);
    out[i] = lp2 * 14 * fadeIn * fadeOut;
  }
  writeWav("public/sfx-rumble.wav", out);
}

// Dissonant rising shriek stinger
{
  const n = seconds(1.8);
  const out = new Float32Array(n);
  const phases = [0, 0, 0];
  const bases = [780, 1085, 1430];
  const rises = [320, 355, 390];
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let v = 0;
    for (let k = 0; k < 3; k++) {
      phases[k] += (2 * Math.PI * (bases[k] + rises[k] * t)) / SR;
      v += Math.sin(phases[k]);
    }
    out[i] = 0.26 * Math.exp(-1.6 * t) * v;
  }
  writeWav("public/sfx-shriek.wav", out);
}

// Heartbeat: lub-dub every second, 6s
{
  const n = seconds(6);
  const out = new Float32Array(n);
  const thump = (dt, freq) =>
    dt < 0 ? 0 : Math.exp(-22 * dt) * Math.sin(2 * Math.PI * freq * dt);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const cyc = t % 1.0;
    out[i] = 0.9 * thump(cyc, 54) + 0.6 * thump(cyc - 0.22, 48);
  }
  writeWav("public/sfx-heartbeat.wav", out);
}
