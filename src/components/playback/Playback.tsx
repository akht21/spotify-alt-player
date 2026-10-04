import usePlayback from "../../hooks/usePlayback";
import PlaybackControllers from "../playbackControllers";
import PlaybackProgress from "../playbackProgress";
import Skeleton from "./skeleton";
import CurrentTrack from "./currentTrack";
import Device from "./device";
import Volume from "./volume";
import styles from "./playback.module.css";

interface Props {
  onToggleExpand: () => void;
}

const Playback = ({ onToggleExpand }: Props) => {
  const { data, isLoading, isError } = usePlayback((playbackData) => ({
    item: playbackData?.item,
    isPlaying: playbackData?.is_playing,
    progressMs: playbackData?.progress_ms,
    device: playbackData?.device,
  }));

  if (isError || (data && data.device === undefined)) {
    return (
      <div className={styles.player}>
        <div className={styles.no_player}>playback not found</div>
      </div>
    );
  }

  if (isLoading || !data) {
    return <Skeleton />;
  }

  return (
    <div className={styles.player} id="player">
      <div className={styles.player_inner}>
        {data?.item === null ? (
          <div className={styles.no_track}>
            <div className={styles.no_track_image}></div>
            <span className={styles.no_track_text}>Track not found</span>
          </div>
        ) : (
          <CurrentTrack
            name={data.item.name}
            artists={data.item.artists}
            imageSrc={data.item.album.images[1].url}
            uri={data.item.uri}
            onToggleExpand={onToggleExpand}
          />
        )}

        <div className={styles.controllers_wrapper}>
          <PlaybackControllers />
          {data?.item === null || data?.progressMs === null ? (
            <div className={styles.no_track_range}></div>
          ) : (
            <PlaybackProgress
              progressMs={data.progressMs}
              durationMs={data.item.duration_ms}
              isPlaying={data.isPlaying}
            />
          )}
        </div>
        <div className={styles.playback_settings}>
          <Device isPlaying={data.isPlaying} />
          <Volume />
        </div>
      </div>
    </div>
  );
};

export default Playback;
