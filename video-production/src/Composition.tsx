import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

const COLORS = {
  navy: "#050a16",
  ink: "#07111f",
  cyan: "#54d7e8",
  teal: "#0f9f8f",
  red: "#e11d48",
  paper: "#e8edf4",
};

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const FullFrameImage: React.FC<{
  src: string;
  start: number;
  end: number;
  zoom?: number;
  darken?: number;
}> = ({src, start, end, zoom = 1.025, darken = 0}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.navy, overflow: "hidden"}}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale: interpolate(frame, [start, end], [1, zoom], clamp),
        }}
      />
      {darken > 0 ? (
        <AbsoluteFill style={{backgroundColor: `rgba(2, 8, 18, ${darken})`}} />
      ) : null}
    </AbsoluteFill>
  );
};

const SceneFade: React.FC<{start: number; end: number; children: React.ReactNode}> = ({
  start,
  end,
  children,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [start, start + 14, end - 14, end],
    [0, 1, 1, 0],
    clamp,
  );
  return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};

const Cursor: React.FC<{
  start: number;
  end: number;
  from: [number, number];
  to: [number, number];
  clickAt?: number;
}> = ({start, end, from, to, clickAt}) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [start, end], [from[0], to[0]], {
    ...clamp,
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
  });
  const y = interpolate(frame, [start, end], [from[1], to[1]], {
    ...clamp,
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
  });
  const pulse = clickAt
    ? interpolate(frame, [clickAt - 4, clickAt, clickAt + 10], [0, 1, 0], clamp)
    : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 18,
        height: 18,
        borderRadius: "50%",
        backgroundColor: "rgba(255,255,255,0.96)",
        border: "3px solid #2563eb",
        boxShadow: `0 0 0 ${pulse * 22}px rgba(37,99,235,${0.3 * (1 - pulse)})`,
      }}
    />
  );
};

export const GameplayRecording: React.FC = () => {
  const frame = useCurrentFrame();
  const typedSearch = "常高".slice(
    0,
    Math.max(0, Math.floor(interpolate(frame, [88, 112], [0, 2], clamp))),
  );
  const typedPassword = "JXZZ60@WT11".slice(
    0,
    Math.max(0, Math.floor(interpolate(frame, [470, 535], [0, 11], clamp))),
  );

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.navy, fontFamily: '"Microsoft YaHei", sans-serif'}}>
      <SceneFade start={0} end={190}>
        <FullFrameImage src="01-oa-workbench.png" start={0} end={190} zoom={1.018} />
        <Cursor start={35} end={85} from={[1080, 600]} to={[760, 122]} clickAt={86} />
        {frame >= 88 ? (
          <div
            style={{
              position: "absolute",
              left: 530,
              top: 102,
              width: 390,
              height: 46,
              display: "flex",
              alignItems: "center",
              paddingLeft: 18,
              color: "#1f2937",
              fontSize: 22,
              background: "#f8fafc",
            }}
          >
            {typedSearch}
            <span style={{color: "#2563eb"}}>▍</span>
          </div>
        ) : null}
      </SceneFade>

      <SceneFade start={175} end={405}>
        <FullFrameImage src="02-audio-evidence.png" start={175} end={405} zoom={1.012} />
        <div
          style={{
            position: "absolute",
            left: 265,
            top: 210,
            width: 720,
            height: 118,
            borderRadius: 12,
            boxShadow: `0 0 ${interpolate(frame, [200, 250, 320, 390], [8, 30, 12, 26], clamp)}px rgba(16,185,129,0.28)`,
          }}
        />
      </SceneFade>

      <SceneFade start={390} end={600}>
        <FullFrameImage src="03-shadow-terminal.png" start={390} end={600} zoom={1.01} />
        {frame >= 470 ? (
          <div
            style={{
              position: "absolute",
              left: 46,
              top: 432,
              color: "#4ade80",
              fontFamily: 'Consolas, "Courier New", monospace',
              fontSize: 22,
              letterSpacing: 1,
              textShadow: "0 0 8px rgba(74,222,128,0.5)",
            }}
          >
            {typedPassword}<span>█</span>
          </div>
        ) : null}
      </SceneFade>
    </AbsoluteFill>
  );
};

const PromoBackdrop: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 72% 20%, rgba(20,184,166,0.22), transparent 34%), radial-gradient(circle at 15% 80%, rgba(225,29,72,0.2), transparent 35%), #050a16",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -120,
          opacity: 0.14,
          backgroundImage:
            "linear-gradient(rgba(84,215,232,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(84,215,232,.25) 1px, transparent 1px)",
          backgroundSize: "58px 58px",
          translate: `${interpolate(frame, [0, 750], [0, -58], clamp)}px ${interpolate(frame, [0, 750], [0, -29], clamp)}px`,
        }}
      />
    </AbsoluteFill>
  );
};

const PromoTitle: React.FC<{start: number; end: number; eyebrow?: string; title: string; sub?: string}> = ({
  start,
  end,
  eyebrow,
  title,
  sub,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [start, start + 16, end - 16, end], [0, 1, 1, 0], clamp);
  const y = interpolate(frame, [start, start + 22], [28, 0], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return (
    <div
      style={{
        opacity,
        translate: `0 ${y}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        textAlign: "center",
        color: COLORS.paper,
      }}
    >
      {eyebrow ? (
        <div style={{fontSize: 26, letterSpacing: 8, color: COLORS.cyan, fontWeight: 700}}>{eyebrow}</div>
      ) : null}
      <div style={{fontSize: 76, lineHeight: 1.08, fontWeight: 900, letterSpacing: 4}}>{title}</div>
      {sub ? <div style={{fontSize: 32, color: "#a9b7c9", letterSpacing: 3}}>{sub}</div> : null}
    </div>
  );
};

const FramedShot: React.FC<{
  src: string;
  start: number;
  end: number;
  side?: "left" | "right";
  imageScale?: number;
  imageY?: number;
}> = ({
  src,
  start,
  end,
  side = "right",
  imageScale = 1,
  imageY = 0,
}) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [start, start + 26], [side === "right" ? 80 : -80, 0], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const opacity = interpolate(frame, [start, start + 16, end - 15, end], [0, 1, 1, 0], clamp);
  return (
    <div
      style={{
        width: 760,
        height: 428,
        borderRadius: 22,
        overflow: "hidden",
        border: "1px solid rgba(125,211,252,0.38)",
        boxShadow: "0 30px 90px rgba(0,0,0,0.55), 0 0 42px rgba(45,212,191,0.12)",
        opacity,
        translate: `${x}px 0`,
        scale: interpolate(frame, [start, end], [1, 1.025], clamp),
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale: imageScale,
          translate: `0 ${imageY}px`,
        }}
      />
    </div>
  );
};

export const PromoVideo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{fontFamily: '"Microsoft YaHei", sans-serif', overflow: "hidden"}}>
      <PromoBackdrop />

      <Sequence durationInFrames={135}>
        <AbsoluteFill style={{display: "flex", alignItems: "center", justifyContent: "center", gap: 70}}>
          <Img
            src={staticFile("game-icon-512.png")}
            style={{
              width: 300,
              height: 300,
              borderRadius: 38,
              boxShadow: "0 30px 100px rgba(0,0,0,.55), 0 0 70px rgba(225,29,72,.18)",
              opacity: interpolate(frame, [0, 18, 115, 135], [0, 1, 1, 0], clamp),
              scale: interpolate(frame, [0, 28], [0.86, 1], {
                ...clamp,
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
            }}
          />
          <PromoTitle start={0} end={135} eyebrow="INTERACTIVE MYSTERY" title="生物公司杀人案" sub="从一张工单开始" />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={120} durationInFrames={190}>
        <AbsoluteFill style={{display: "flex", alignItems: "center", justifyContent: "center", gap: 70, padding: "70px 90px"}}>
          <div style={{width: 350}}>
            <PromoTitle start={0} end={190} eyebrow="INTERNAL CASE" title="潜入系统" sub="以外包员工身份，追查姐姐的死亡真相" />
          </div>
          <FramedShot src="promo-entry.png" start={0} end={190} imageScale={1.35} imageY={-42} />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={295} durationInFrames={190}>
        <AbsoluteFill style={{display: "flex", alignItems: "center", justifyContent: "center", gap: 68, padding: "70px 90px"}}>
          <FramedShot src="promo-mailbox.png" start={0} end={190} side="left" />
          <div style={{width: 350}}>
            <PromoTitle start={0} end={190} eyebrow="SEARCH" title="拼合线索" sub="邮件、工单与隐藏页面，都可能留下证据" />
          </div>
        </AbsoluteFill>
      </Sequence>

      <Sequence from={470} durationInFrames={170}>
        <AbsoluteFill style={{display: "flex", alignItems: "center", justifyContent: "center", gap: 70, padding: "70px 90px"}}>
          <div style={{width: 350}}>
            <PromoTitle start={0} end={170} eyebrow="TRUST NO ONE" title="识破谎言" sub="每一篇报道，都可能只说了一半真话" />
          </div>
          <FramedShot src="promo-profile.png" start={0} end={170} />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={625} durationInFrames={125}>
        <AbsoluteFill style={{display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 28}}>
          <PromoTitle start={0} end={125} eyebrow="WHO KILLED LIN LAN" title="真相藏在系统深处" sub="《生物公司杀人案》" />
          <div
            style={{
              width: interpolate(frame - 625, [10, 75], [0, 620], clamp),
              height: 3,
              background: `linear-gradient(90deg, ${COLORS.red}, ${COLORS.cyan})`,
              boxShadow: "0 0 20px rgba(84,215,232,.45)",
            }}
          />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
