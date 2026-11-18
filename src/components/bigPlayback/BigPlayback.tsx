import { useEffect } from "react";
import useAccentColor from "../../hooks/useAccentColor";
import useIdle from "../../hooks/useIdle.ts";
import usePlayback from "../../hooks/usePlayback";
import minimiseIcon from "../../assets/icons/minimise.svg";
import PlaybackControllers from "../playbackControllers";
import PlaybackProgress from "../playbackProgress";
import Cover from "./cover";
import styles from "./bigPlayback.module.css";

interface Props {
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const BigPlayback = ({ isExpanded, onToggleExpand }: Props) => {
  const { data } = usePlayback((playbackData) => ({
    item: playbackData?.item,
    isPlaying: playbackData?.is_playing,
    progressMs: playbackData?.progress_ms,
    device: playbackData?.device,
  }));

  const backgroundColor = useAccentColor(data?.item?.album.images[0]?.url);
  const isIdle = useIdle(4000, isExpanded);

  useEffect(() => {
    if (!isExpanded) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onToggleExpand();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isExpanded, onToggleExpand]);

  if (!data || !data.item) return null;

  const wrapperClass = [
    styles.playback_wrapper,
    isExpanded && styles.playback_wrapper_open,
    isIdle && styles.playback_wrapper_idle,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClass} style={{ backgroundColor }}>
      <div className={styles.container}>
        <button className={styles.minimize_button} onClick={onToggleExpand}>
          <img className={styles.minimize_icon} src={minimiseIcon} alt="" />
        </button>
        <div className={styles.playback}>
          <div data-idle-ignore>
            <Cover imageSrc={data.item.album.images[0].url} />
          </div>
          <div className={styles.info}>
            <span className={styles.name}>{data.item.name}</span>
            <span className={styles.artists_list}>
              {data.item.artists.map((artist, index) => (
                <span className={styles.artist_item} key={artist.id}>
                  {artist.name}
                  {index < data.item!.artists.length - 1 && ","}
                </span>
              ))}
            </span>
          </div>
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
        </div>
      </div>
    </div>
  );
};

export default BigPlayback;
