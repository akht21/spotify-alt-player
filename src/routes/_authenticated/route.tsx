import { useState } from "react";
import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "../../services/auth";
import usePlayback from "../../hooks/usePlayback";
import UserProfilePreview from "../../components/userProfilePreview";
import Playback from "../../components/playback";
import ActiveDevice from "../../components/activeDevice";
import BigPlayback from "../../components/bigPlayback";
import styles from "./index.module.css";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({
        to: "/preview",
      });
    }
  },

  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data, isLoading } = usePlayback((playbackData) => ({
    device: playbackData?.device,
  }));

  return (
    <div className={styles.wrapper}>
      {!isLoading && data?.device === undefined ? <ActiveDevice /> : null}

      <div className={styles.app}>
        <div className={styles.header_wrapper}>
          <Link to={"/"} className={styles.brand}>
            Spotify / alt player
          </Link>
          <UserProfilePreview />
        </div>
        <div className={styles.app_content}>
          <Outlet />
        </div>
        <div className={styles.playback_wrapper}>
          {!isExpanded && <Playback onToggleExpand={() => setIsExpanded((v) => !v)} />}
        </div>
      </div>
      <BigPlayback isExpanded={isExpanded} onToggleExpand={() => setIsExpanded((v) => !v)} />
    </div>
  );
}
