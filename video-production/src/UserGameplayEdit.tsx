import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

const segments = [
  {trimBefore: 150, trimAfter: 270, playbackRate: 1, duration: 120},
  {trimBefore: 1590, trimAfter: 1710, playbackRate: 1, duration: 120},
  {trimBefore: 2385, trimAfter: 2436, playbackRate: 1, duration: 51},
  {trimBefore: 3285, trimAfter: 3435, playbackRate: 1, duration: 150},
  {trimBefore: 3885, trimAfter: 4035, playbackRate: 1, duration: 150},
  {trimBefore: 4155, trimAfter: 4305, playbackRate: 1, duration: 150},
] as const;

export const USER_GAMEPLAY_DURATION = segments.reduce(
  (sum, segment) => sum + segment.duration,
  0,
);

const PixelMask: React.FC<{
  left: number;
  top: number;
  width: number;
  height: number;
  radius?: number;
}> = ({left, top, width, height, radius = 12}) => {
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        borderRadius: radius,
        backgroundColor: "#1f2937",
        backgroundImage:
          "linear-gradient(45deg, rgba(148,163,184,.58) 25%, transparent 25%, transparent 75%, rgba(148,163,184,.58) 75%), linear-gradient(45deg, rgba(15,23,42,.92) 25%, transparent 25%, transparent 75%, rgba(15,23,42,.92) 75%)",
        backgroundPosition: "0 0, 10px 10px",
        backgroundSize: "20px 20px",
        boxShadow: "0 0 0 2px rgba(15,23,42,.7)",
      }}
    />
  );
};

const GameplaySegment: React.FC<{
  trimBefore: number;
  trimAfter: number;
  playbackRate: number;
  redactUntil?: number;
}> = ({trimBefore, trimAfter, playbackRate, redactUntil}) => {
  const frame = useCurrentFrame();
  const shouldRedact = redactUntil !== undefined && frame <= redactUntil;

  return (
    <AbsoluteFill style={{backgroundColor: "#eef3f8", overflow: "hidden"}}>
      <OffthreadVideo
        src={staticFile("user-gameplay-source.mp4")}
        trimBefore={trimBefore}
        trimAfter={trimAfter}
        playbackRate={playbackRate}
        muted
        style={{
          position: "absolute",
          left: 0,
          top: -106,
          width: 720,
          height: 1543,
        }}
      />
      {shouldRedact ? (
        <>
          <PixelMask left={34} top={454} width={652} height={78} />
          <PixelMask left={34} top={584} width={652} height={92} />
          <PixelMask left={192} top={788} width={338} height={82} radius={38} />
        </>
      ) : null}
    </AbsoluteFill>
  );
};

export const UserGameplayEdit: React.FC = () => {
  const frame = useCurrentFrame();
  let from = 0;

  return (
    <AbsoluteFill style={{backgroundColor: "#000"}}>
      <AbsoluteFill
        style={{
          opacity: interpolate(
            frame,
            [0, 8, USER_GAMEPLAY_DURATION - 8, USER_GAMEPLAY_DURATION - 1],
            [0, 1, 1, 0],
            {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
          ),
        }}
      >
        {segments.map((segment, index) => {
          const sequenceFrom = from;
          from += segment.duration;
          return (
            <Sequence
              key={`${segment.trimBefore}-${segment.trimAfter}`}
              from={sequenceFrom}
              durationInFrames={segment.duration}
              name={`Gameplay segment ${index + 1}`}
            >
              <GameplaySegment {...segment} />
            </Sequence>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
