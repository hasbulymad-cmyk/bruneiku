// Upbeat ad SFX + music bed as 16-bit mono WAVs in public/.
// Same reason as gen-sfx.mjs: no lavfi in the local ffmpeg, no remote audio hosts.
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
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
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

let seed = 424242;
const rand = () => {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff - 0.5;
};

// Bubbly pop: fast sine pitch drop
{
  const n = seconds(0.18);
  const out = new Float32Array(n);
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const freq = 620 * Math.exp(-14 * t) + 180;
    phase += (2 * Math.PI * freq) / SR;
    out[i] = Math.exp(-28 * t) * Math.sin(phase) * 0.85;
  }
  writeWav("public/ad-pop.wav", out);
}

// Whoosh: bandpassed noise, swell up then out
{
  const n = seconds(0.5);
  const out = new Float32Array(n);
  let lp = 0;
  let hp = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const p = t / 0.5;
    const cutoff = 0.05 + 0.3 * p;
    lp += cutoff * (rand() * 2 - lp);
    hp += 0.01 * (lp - hp);
    const env = Math.sin(Math.PI * Math.pow(p, 0.7));
    out[i] = (lp - hp) * env * 0.9;
  }
  writeWav("public/ad-whoosh.wav", out);
}

// Slam: bright thump with click transient
{
  const n = seconds(0.8);
  const out = new Float32Array(n);
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const freq = 150 * Math.exp(-8 * t) + 60;
    phase += (2 * Math.PI * freq) / SR;
    const click = t < 0.012 ? rand() * Math.exp(-500 * t) * 0.7 : 0;
    out[i] = Math.exp(-7 * t) * Math.sin(phase) * 0.95 + click;
  }
  writeWav("public/ad-slam.wav", out);
}

// Sparkle chime: staggered bell tones E6-B6-E7
{
  const n = seconds(1.4);
  const out = new Float32Array(n);
  const notes = [
    { f: 1318.5, at: 0 },
    { f: 1975.5, at: 0.09 },
    { f: 2637, at: 0.18 },
  ];
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let v = 0;
    for (const { f, at } of notes) {
      const dt = t - at;
      if (dt < 0) continue;
      v += Math.exp(-4 * dt) * (Math.sin(2 * Math.PI * f * dt) + 0.3 * Math.sin(2 * Math.PI * f * 2.01 * dt));
    }
    out[i] = v * 0.22;
  }
  writeWav("public/ad-chime.wav", out);
}

// Soda fizz: dense high-frequency ticks
{
  const n = seconds(1.3);
  const out = new Float32Array(n);
  let hp = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const burst = rand() > 0.485 ? rand() * 2 : 0;
    hp += 0.6 * (burst - hp);
    const env = Math.min(t / 0.1, 1) * Math.max(0, 1 - t / 1.3);
    out[i] = (burst - hp) * env * 0.5;
  }
  writeWav("public/ad-fizz.wav", out);
}

// Music bed: 126 BPM, ~14s. Kick on beats, hats offbeat, bass plucks, pentatonic melody.
{
  const BPM = 126;
  const beat = 60 / BPM;
  const dur = 14;
  const n = seconds(dur);
  const out = new Float32Array(n);

  const bassRoots = [110, 87.31, 130.81, 98]; // A2 F2 C3 G2, one per bar
  const penta = [523.25, 659.25, 783.99, 880, 1046.5]; // C5 E5 G5 A5 C6

  // Precompute melody notes: seeded choice on some eighth notes
  let mseed = 777;
  const mrand = () => {
    mseed = (mseed * 1103515245 + 12345) & 0x7fffffff;
    return mseed / 0x7fffffff;
  };
  const eighths = Math.floor(dur / (beat / 2));
  const melody = [];
  for (let e = 0; e < eighths; e++) {
    if (mrand() < 0.32) {
      melody.push({ at: e * (beat / 2), f: penta[Math.floor(mrand() * penta.length)] });
    }
  }

  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let v = 0;

    // Kick on every beat
    const bt = t % beat;
    v += 0.5 * Math.exp(-30 * bt) * Math.sin(2 * Math.PI * (120 * Math.exp(-25 * bt) + 45) * bt);

    // Hat on offbeats
    const ht = (t + beat / 2) % beat;
    if (ht < 0.04) v += rand() * Math.exp(-160 * ht) * 0.16;

    // Bass: eighth-note plucks, root-root-fifth-root per half bar
    const bar = Math.floor(t / (beat * 4)) % bassRoots.length;
    const root = bassRoots[bar];
    const e8 = Math.floor(t / (beat / 2)) % 4;
    const bf = e8 === 2 ? root * 1.5 : root;
    const pt = t % (beat / 2);
    v += 0.34 * Math.exp(-9 * pt) * (Math.sin(2 * Math.PI * bf * pt) + 0.4 * Math.sin(2 * Math.PI * bf * 2 * pt));

    // Melody plucks
    for (const m of melody) {
      const dt = t - m.at;
      if (dt >= 0 && dt < 0.5) {
        v += 0.13 * Math.exp(-10 * dt) * (Math.sin(2 * Math.PI * m.f * dt) + 0.25 * Math.sin(2 * Math.PI * m.f * 2 * dt));
      }
    }

    // Master fades
    const fadeIn = Math.min(t / 0.15, 1);
    const fadeOut = Math.min((dur - t) / 1.2, 1);
    out[i] = v * 0.85 * fadeIn * fadeOut;
  }
  writeWav("public/ad-music.wav", out);
}
