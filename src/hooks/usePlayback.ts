import { useQuery } from "@tanstack/react-query";
import { fetchPlaybackState } from "../services/api/player";
import type { PlaybackState } from "../types/player";

const usePlayback = <T = PlaybackState>(select?: (data: PlaybackState) => T) => {
  return useQuery({
    queryKey: ["playback-state"],
    queryFn: fetchPlaybackState,
    refetchInterval: (query) => {
      if (query.state.status === "error") {
        return false;
      }
      return 4000;
    },
    staleTime: 3500,
    select,
  });
};

export default usePlayback;
