import "./index.css";
import {Composition} from "remotion";
import {GameplayRecording, PromoVideo} from "./Composition";
import {USER_GAMEPLAY_DURATION, UserGameplayEdit} from "./UserGameplayEdit";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="GameplayRecording"
        component={GameplayRecording}
        durationInFrames={600}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="PromoVideo"
        component={PromoVideo}
        durationInFrames={750}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="UserGameplayEdit"
        component={UserGameplayEdit}
        durationInFrames={USER_GAMEPLAY_DURATION}
        fps={30}
        width={720}
        height={1260}
      />
    </>
  );
};
