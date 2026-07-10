import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Audio } from "@remotion/media";
import "./fonts.css";

// Fonts are embedded as base64 @font-face rules (fonts.css): the render
// browser cannot reach fonts.gstatic.com, and runtime font loading was flaky
// across parallel render workers.
const anton = "Anton";
const cinzel = "Cinzel";

// Tiling film-grain texture via SVG turbulence
const GRAIN =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2"/><feColorMatrix type="saturate" values="0"/></filter><rect width="300" height="300" filter="url(#n)" opacity="0.6"/></svg>`,
  );

const shake = (frame: number, amp: number, seed: number) => ({
  x: (Math.sin(frame * 1.7 + seed) + 0.6 * Math.sin(frame * 3.9 + seed * 2)) * amp,
  y: (Math.cos(frame * 2.3 + seed) + 0.6 * Math.sin(frame * 4.7 + seed * 3)) * amp,
  rot: Math.sin(frame * 1.3 + seed) * amp * 0.04,
});

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url("${GRAIN}")`,
        backgroundPosition: `${Math.floor(random(`gx-${frame}`) * 300)}px ${Math.floor(
          random(`gy-${frame}`) * 300,
        )}px`,
        opacity: 0.13,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    />
  );
};

const Vignette: React.FC<{ strength?: number }> = ({ strength = 1 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 35%, rgba(0,0,0,${
        0.55 * strength
      }) 78%, rgba(0,0,0,${0.92 * strength}) 100%)`,
    }}
  />
);

const Letterbox: React.FC = () => (
  <>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 130, background: "black" }} />
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 130, background: "black" }} />
  </>
);

// White impact flash that decays over the first few frames of a cut
const ImpactFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 7], [0.85, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return <AbsoluteFill style={{ background: "white", opacity }} />;
};

const RedPulse: React.FC<{ speed?: number }> = ({ speed = 0.35 }) => {
  const frame = useCurrentFrame();
  const pulse = (Math.sin(frame * speed) + 1) / 2;
  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse at center, rgba(120,0,0,0.0) 40%, rgba(150,0,0,0.5) 100%)",
        opacity: 0.25 + pulse * 0.45,
        mixBlendMode: "multiply",
      }}
    />
  );
};

// Photo with horror grade, Ken Burns push-in and camera shake
const ScaryPhoto: React.FC<{
  src: string;
  from: number;
  to: number;
  origin: string;
  amp: number;
  durationInFrames: number;
  seed?: number;
}> = ({ src, from, to, origin, amp, durationInFrames, seed = 1 }) => {
  const frame = useCurrentFrame();
  const s = shake(frame, amp, seed);
  const rampedAmp = interpolate(frame, [0, durationInFrames], [0.5, 1]);
  const scale = interpolate(frame, [0, durationInFrames], [from, to], {
    easing: Easing.bezier(0.45, 0, 0.55, 1),
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "black" }}>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transformOrigin: origin,
          scale: String(scale),
          translate: `${s.x * rampedAmp}px ${s.y * rampedAmp}px`,
          rotate: `${s.rot * rampedAmp}deg`,
          filter: "contrast(1.18) saturate(0.5) brightness(0.78)",
        }}
      />
      <AbsoluteFill style={{ background: "rgba(8, 18, 38, 0.28)", mixBlendMode: "multiply" }} />
    </AbsoluteFill>
  );
};

// Trailer caption that flickers in like a failing light
const Caption: React.FC<{
  children: React.ReactNode;
  at: number;
  size?: number;
  color?: string;
  font?: string;
}> = ({ children, at, size = 64, color = "#e8e4da", font = cinzel }) => {
  const frame = useCurrentFrame();
  const local = frame - at;
  if (local < 0) return null;
  const flicker = local < 12 ? (random(`cap-${Math.floor(local / 2)}`) > 0.35 ? 1 : 0.15) : 1;
  const drift = interpolate(local, [0, 90], [0, -14]);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 200 }}>
      <div
        style={{
          fontFamily: font,
          fontSize: size,
          color,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          textAlign: "center",
          textShadow: "0 2px 30px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.8)",
          opacity: flicker,
          translate: `0px ${drift}px`,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

const ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const flicker = frame < 14 ? (random(`open-${Math.floor(frame / 2)}`) > 0.3 ? 1 : 0.1) : 1;
  const fadeOut = interpolate(frame, [56, 68], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ background: "black", justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity: flicker * fadeOut, textAlign: "center" }}>
        <div
          style={{
            fontFamily: cinzel,
            fontSize: 58,
            color: "#d8d2c4",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
          }}
        >
          The following footage is real
        </div>
        <div
          style={{
            fontFamily: cinzel,
            fontSize: 30,
            color: "#7a2020",
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            marginTop: 40,
          }}
        >
          Viewer discretion advised
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Hard punch-in on the screaming rider, one cut of the strobe sequence
const PunchIn: React.FC<{ scale: number; amp: number; seed: number }> = ({ scale, amp, seed }) => {
  const frame = useCurrentFrame();
  const s = shake(frame, amp, seed);
  const creep = interpolate(frame, [0, 40], [scale, scale * 1.06]);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "black" }}>
      <Img
        src={staticFile("slide-5.jpg")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transformOrigin: "46% 42%",
          scale: String(creep),
          translate: `${s.x}px ${s.y}px`,
          rotate: `${s.rot}deg`,
          filter: "contrast(1.3) saturate(0.4) brightness(0.75)",
        }}
      />
      <AbsoluteFill style={{ background: "rgba(30, 5, 5, 0.3)", mixBlendMode: "multiply" }} />
      <ImpactFlash />
    </AbsoluteFill>
  );
};

const TitleSlam: React.FC = () => {
  const frame = useCurrentFrame();
  const slam = interpolate(frame, [0, 8], [3.2, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [0, 4], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          fontFamily: anton,
          fontSize: 170,
          color: "#ffffff",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          scale: String(slam),
          opacity,
          textShadow: "0 0 40px rgba(200,0,0,0.9), 0 6px 60px rgba(0,0,0,0.95)",
          WebkitTextStroke: "3px rgba(120,0,0,0.9)",
        }}
      >
        Survive the slide
      </div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const heartbeat = 1 + 0.035 * Math.max(0, Math.sin(frame * 0.42)) ** 6;
  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const dareIn = interpolate(frame, [40, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ background: "black", justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", opacity: fadeIn }}>
        <div
          style={{
            fontFamily: anton,
            fontSize: 150,
            color: "#c1121f",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            scale: String(heartbeat),
            textShadow: "0 0 60px rgba(193,18,31,0.55)",
          }}
        >
          HeHa Sky View
        </div>
        <div
          style={{
            fontFamily: cinzel,
            fontSize: 46,
            color: "#d8d2c4",
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            marginTop: 30,
          }}
        >
          Elevation: terrifying
        </div>
        <div
          style={{
            fontFamily: cinzel,
            fontSize: 32,
            color: "#6f6a5e",
            letterSpacing: "0.3em",
            marginTop: 55,
            opacity: dareIn,
          }}
        >
          if you dare.
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const HighAndScary: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "black" }}>
      {/* ── Sound design (all synthesized locally, see scripts/gen-sfx.mjs) ── */}
      <Sequence from={0}>
        <Audio src={staticFile("sfx-heartbeat.wav")} volume={0.55} />
      </Sequence>
      <Sequence from={62}>
        <Audio src={staticFile("sfx-boom.wav")} volume={0.7} />
      </Sequence>
      <Sequence from={70}>
        <Audio src={staticFile("sfx-rumble.wav")} volume={0.5} />
      </Sequence>
      <Sequence from={186}>
        <Audio src={staticFile("sfx-boom.wav")} volume={0.75} />
      </Sequence>
      <Sequence from={293}>
        <Audio src={staticFile("sfx-boom.wav")} volume={0.8} />
      </Sequence>
      <Sequence from={330}>
        <Audio src={staticFile("sfx-riser.wav")} volume={0.55} />
      </Sequence>
      <Sequence from={383}>
        <Audio src={staticFile("sfx-boom.wav")} volume={0.9} />
      </Sequence>
      <Sequence from={395}>
        <Audio src={staticFile("sfx-riser.wav")} volume={0.7} />
      </Sequence>
      <Sequence from={458}>
        <Audio src={staticFile("sfx-boom.wav")} volume={0.95} />
      </Sequence>
      <Sequence from={498}>
        <Audio src={staticFile("sfx-boom.wav")} volume={1} />
      </Sequence>
      <Sequence from={538}>
        <Audio src={staticFile("sfx-boom.wav")} volume={1} />
      </Sequence>
      <Sequence from={545}>
        <Audio src={staticFile("sfx-shriek.wav")} volume={0.8} />
      </Sequence>
      <Sequence from={614}>
        <Audio src={staticFile("sfx-boom.wav")} volume={0.85} />
      </Sequence>
      <Sequence from={620}>
        <Audio src={staticFile("sfx-heartbeat.wav")} volume={0.6} />
      </Sequence>

      {/* ── Cold open ── */}
      <Sequence durationInFrames={70}>
        <ColdOpen />
      </Sequence>

      {/* ── Scene 1: the "family attraction" ── */}
      <Sequence from={70} durationInFrames={120}>
        <ScaryPhoto
          src={staticFile("slide-1.jpg")}
          from={1}
          to={1.14}
          origin="50% 30%"
          amp={2}
          durationInFrames={120}
          seed={1}
        />
        <Caption at={30} size={52}>
          They called it a &ldquo;family attraction&rdquo;
        </Caption>
      </Sequence>

      {/* ── Scene 2: the point of no return ── */}
      <Sequence from={190} durationInFrames={105}>
        <ScaryPhoto
          src={staticFile("slide-2.jpg")}
          from={1.05}
          to={1.26}
          origin="50% 55%"
          amp={4}
          durationInFrames={105}
          seed={2}
        />
        <Caption at={22} size={56}>
          There is only one way down
        </Caption>
      </Sequence>

      {/* ── Scene 3: the descent ── */}
      <Sequence from={295} durationInFrames={90}>
        <ScaryPhoto
          src={staticFile("slide-3.jpg")}
          from={1.1}
          to={1.38}
          origin="46% 50%"
          amp={7}
          durationInFrames={90}
          seed={3}
        />
        <Caption at={12} size={72} font={anton} color="#e8e4da">
          No brakes
        </Caption>
      </Sequence>

      {/* ── Scene 4: it's coming right at you ── */}
      <Sequence from={385} durationInFrames={75}>
        <ScaryPhoto
          src={staticFile("slide-4.jpg")}
          from={1.15}
          to={1.55}
          origin="44% 48%"
          amp={12}
          durationInFrames={75}
          seed={4}
        />
        <RedPulse />
        <Caption at={10} size={82} font={anton} color="#ff2b2b">
          No mercy
        </Caption>
      </Sequence>

      {/* ── Scene 5: strobe punch-ins on the screamer ── */}
      <Sequence from={460} durationInFrames={40}>
        <PunchIn scale={1.3} amp={9} seed={5} />
      </Sequence>
      <Sequence from={500} durationInFrames={40}>
        <PunchIn scale={1.9} amp={12} seed={6} />
      </Sequence>
      <Sequence from={540} durationInFrames={70}>
        <PunchIn scale={2.7} amp={15} seed={7} />
        <RedPulse speed={0.6} />
      </Sequence>
      <Sequence from={560} durationInFrames={50}>
        <TitleSlam />
      </Sequence>

      {/* ── Grade overlays across all footage ── */}
      <Sequence from={70} durationInFrames={540}>
        <Vignette />
        <Grain />
        <Letterbox />
      </Sequence>

      {/* ── End card ── */}
      <Sequence from={610} durationInFrames={140}>
        <EndCard />
        <Grain />
      </Sequence>
    </AbsoluteFill>
  );
};
