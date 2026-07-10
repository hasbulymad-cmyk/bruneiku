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

const mont = "Montserrat";

const TEAL_DARK = "#052a2e";
const TEAL = "#0d4a4e";
const ORANGE = "#ff8c1a";
const ORANGE_LIGHT = "#ffb347";

const overshoot = Easing.bezier(0.34, 1.56, 0.64, 1);

// Teal gradient with drifting orange bokeh and twinkling sparkles
const AdBackground: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 30% 25%, ${TEAL} 0%, ${TEAL_DARK} 65%, #02181b 100%)`,
      }}
    >
      {Array.from({ length: 8 }).map((_, i) => {
        const x = random(`bx-${i}`) * 1920;
        const y = random(`by-${i}`) * 1080;
        const r = 60 + random(`br-${i}`) * 160;
        const drift = Math.sin(frame * 0.012 + i * 2.1) * 40;
        const bob = Math.cos(frame * 0.015 + i * 1.3) * 30;
        return (
          <div
            key={`b-${i}`}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: r,
              height: r,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${
                i % 2 ? ORANGE : ORANGE_LIGHT
              }26 0%, transparent 70%)`,
              filter: "blur(6px)",
              translate: `${drift}px ${bob}px`,
            }}
          />
        );
      })}
      {Array.from({ length: 14 }).map((_, i) => {
        const x = random(`sx-${i}`) * 1920;
        const y = random(`sy-${i}`) * 1080;
        const tw = (Math.sin(frame * 0.11 + i * 2.7) + 1) / 2;
        return (
          <div
            key={`s-${i}`}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "white",
              opacity: 0.12 + tw * 0.4,
              boxShadow: "0 0 8px rgba(255,255,255,0.7)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Word that slams in with overshoot
const SlamText: React.FC<{
  children: React.ReactNode;
  at: number;
  size?: number;
  color?: string;
}> = ({ children, at, size = 160, color = "white" }) => {
  const frame = useCurrentFrame();
  const local = frame - at;
  if (local < 0) return null;
  const scale = interpolate(local, [0, 10], [2.6, 1], {
    easing: overshoot,
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(local, [0, 4], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div
      style={{
        fontFamily: mont,
        fontWeight: 800,
        fontSize: size,
        color,
        letterSpacing: "-0.02em",
        scale: String(scale),
        opacity,
        textShadow: "0 10px 50px rgba(0,0,0,0.45)",
      }}
    >
      {children}
    </div>
  );
};

const OpenScene: React.FC = () => {
  const frame = useCurrentFrame();
  const circle = interpolate(frame, [2, 12], [0, 1], {
    easing: overshoot,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = interpolate(frame, [30, 35], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: exit }}>
      <div
        style={{
          position: "absolute",
          width: 520,
          height: 520,
          borderRadius: "50%",
          background: `radial-gradient(circle at 35% 30%, ${ORANGE_LIGHT}, ${ORANGE} 70%)`,
          scale: String(circle),
          boxShadow: `0 0 120px ${ORANGE}66`,
        }}
      />
      <SlamText at={12} size={170} color="white">
        THIRSTY?
      </SlamText>
    </AbsoluteFill>
  );
};

const FreshScene: React.FC = () => {
  const frame = useCurrentFrame();
  const underline = interpolate(frame, [10, 22], [0, 100], {
    easing: Easing.bezier(0.22, 1, 0.36, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = interpolate(frame, [35, 40], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: exit }}>
      <div style={{ textAlign: "center" }}>
        <SlamText at={5} size={190}>
          100% FRESH
        </SlamText>
        <div
          style={{
            height: 14,
            width: `${underline}%`,
            margin: "18px auto 0",
            borderRadius: 7,
            background: `linear-gradient(90deg, ${ORANGE}, ${ORANGE_LIGHT})`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const WordsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const exit = interpolate(frame, [35, 40], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 60,
        opacity: exit,
      }}
    >
      <SlamText at={3} size={140}>
        COLD.
      </SlamText>
      <SlamText at={15} size={140} color={ORANGE_LIGHT}>
        SWEET.
      </SlamText>
      <SlamText at={27} size={140}>
        REAL.
      </SlamText>
    </AbsoluteFill>
  );
};

const Chip: React.FC<{ children: React.ReactNode; at: number }> = ({ children, at }) => {
  const frame = useCurrentFrame();
  const local = frame - at;
  const enter = interpolate(local, [0, 12], [0, 1], {
    easing: overshoot,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        fontFamily: mont,
        fontWeight: 800,
        fontSize: 34,
        letterSpacing: "0.08em",
        color: TEAL_DARK,
        background: `linear-gradient(180deg, white, #ffeeda)`,
        borderRadius: 99,
        padding: "18px 44px",
        opacity: enter,
        scale: String(0.5 + enter * 0.5),
        translate: `0px ${(1 - enter) * 60}px`,
        boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
      }}
    >
      {children}
    </div>
  );
};

const HeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 14], [0, 1], {
    easing: overshoot,
    extrapolateRight: "clamp",
  });
  const drift = interpolate(frame, [14, 165], [1, 1.045], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bob = Math.sin(frame * 0.06) * 7;
  const sway = Math.sin(frame * 0.045) * 0.5;
  const shine = interpolate(frame, [35, 60], [-40, 140], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = interpolate(frame, [160, 165], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: exit }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 44,
          translate: `0px ${bob - 20}px`,
        }}
      >
        <div
          style={{
            width: 1180,
            borderRadius: 28,
            overflow: "hidden",
            boxShadow: `0 40px 120px rgba(0,0,0,0.55), 0 0 90px ${ORANGE}22`,
            scale: String(enter * drift),
            rotate: `${sway}deg`,
            opacity: enter,
            position: "relative",
          }}
        >
          <Img src={staticFile("juice-ad.jpg")} style={{ width: "100%", display: "block" }} />
          <div
            style={{
              position: "absolute",
              top: -80,
              bottom: -80,
              width: 220,
              left: `${shine}%`,
              rotate: "18deg",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.38), transparent)",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 36 }}>
          <Chip at={75}>NO ADDED SUGAR</Chip>
          <Chip at={88}>VITAMIN C BOOST</Chip>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const EndScene: React.FC = () => {
  const frame = useCurrentFrame();
  const subIn = interpolate(frame, [18, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaIn = interpolate(frame, [32, 44], [0, 1], {
    easing: overshoot,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulse = 1 + 0.025 * Math.max(0, Math.sin((frame - 44) * 0.18));
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 40,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <SlamText at={4} size={165}>
          TASTE THE <span style={{ color: ORANGE_LIGHT }}>MAGIC.</span>
        </SlamText>
      </div>
      <div
        style={{
          fontFamily: mont,
          fontWeight: 500,
          fontSize: 46,
          color: "rgba(255,255,255,0.85)",
          letterSpacing: "0.18em",
          opacity: subIn,
        }}
      >
        100% FRESH ORANGE JUICE
      </div>
      <div
        style={{
          fontFamily: mont,
          fontWeight: 800,
          fontSize: 42,
          color: "white",
          letterSpacing: "0.1em",
          background: `linear-gradient(180deg, ${ORANGE_LIGHT}, ${ORANGE})`,
          borderRadius: 99,
          padding: "26px 70px",
          marginTop: 20,
          boxShadow: `0 18px 60px ${ORANGE}55`,
          opacity: ctaIn,
          scale: String(ctaIn * pulse),
        }}
      >
        DRINK FRESH TODAY
      </div>
    </AbsoluteFill>
  );
};

export const JuiceAd: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: TEAL_DARK }}>
      {/* ── Sound design (synthesized, see scripts/gen-ad-sfx.mjs) ── */}
      <Sequence from={0}>
        <Audio src={staticFile("ad-music.wav")} volume={0.5} />
      </Sequence>
      <Sequence from={2}>
        <Audio src={staticFile("ad-pop.wav")} volume={0.8} />
      </Sequence>
      <Sequence from={12}>
        <Audio src={staticFile("ad-slam.wav")} volume={0.7} />
      </Sequence>
      <Sequence from={35}>
        <Audio src={staticFile("ad-whoosh.wav")} volume={0.7} />
      </Sequence>
      <Sequence from={40}>
        <Audio src={staticFile("ad-slam.wav")} volume={0.75} />
      </Sequence>
      <Sequence from={78}>
        <Audio src={staticFile("ad-pop.wav")} volume={0.8} />
      </Sequence>
      <Sequence from={90}>
        <Audio src={staticFile("ad-pop.wav")} volume={0.85} />
      </Sequence>
      <Sequence from={102}>
        <Audio src={staticFile("ad-pop.wav")} volume={0.9} />
      </Sequence>
      <Sequence from={113}>
        <Audio src={staticFile("ad-whoosh.wav")} volume={0.8} />
      </Sequence>
      <Sequence from={118}>
        <Audio src={staticFile("ad-slam.wav")} volume={0.85} />
      </Sequence>
      <Sequence from={150}>
        <Audio src={staticFile("ad-chime.wav")} volume={0.75} />
      </Sequence>
      <Sequence from={152}>
        <Audio src={staticFile("ad-fizz.wav")} volume={0.55} />
      </Sequence>
      <Sequence from={188}>
        <Audio src={staticFile("ad-whoosh.wav")} volume={0.6} />
      </Sequence>
      <Sequence from={190}>
        <Audio src={staticFile("ad-pop.wav")} volume={0.8} />
      </Sequence>
      <Sequence from={203}>
        <Audio src={staticFile("ad-pop.wav")} volume={0.85} />
      </Sequence>
      <Sequence from={280}>
        <Audio src={staticFile("ad-whoosh.wav")} volume={0.75} />
      </Sequence>
      <Sequence from={284}>
        <Audio src={staticFile("ad-slam.wav")} volume={0.9} />
      </Sequence>
      <Sequence from={286}>
        <Audio src={staticFile("ad-chime.wav")} volume={0.8} />
      </Sequence>
      <Sequence from={312}>
        <Audio src={staticFile("ad-pop.wav")} volume={0.9} />
      </Sequence>

      {/* ── Visuals ── */}
      <AdBackground />

      <Sequence durationInFrames={35}>
        <OpenScene />
      </Sequence>
      <Sequence from={35} durationInFrames={40}>
        <FreshScene />
      </Sequence>
      <Sequence from={75} durationInFrames={40}>
        <WordsScene />
      </Sequence>
      <Sequence from={115} durationInFrames={165}>
        <HeroScene />
      </Sequence>
      <Sequence from={280} durationInFrames={110}>
        <EndScene />
      </Sequence>
    </AbsoluteFill>
  );
};
