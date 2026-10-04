import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPlaybackNext,
  fetchPlaybackPause,
  fetchPlaybackPlay,
  fetchPlaybackPrevious,
  fetchPlaybackRepeat,
  fetchPlaybackResume,
  fetchPlaybackSeek,
  fetchPlaybackShuffle,
  fetchTransferPlayback,
} from "../services/api/player";
import { useOptimisticPlaybackMutation } from "./useOptimisticPlaybackMutation";
import type { RepeatState } from "../types/player";

const usePlaybackActions = () => {
  const queryClient = useQueryClient();
  const invalidate = async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    await queryClient.invalidateQueries({ queryKey: ["playback-state"] });
  };

  const pauseMutation = useOptimisticPlaybackMutation(fetchPlaybackPause, () => ({
    is_playing: false,
  }));

  const resumeMutation = useOptimisticPlaybackMutation(fetchPlaybackResume, () => ({
    is_playing: true,
  }));

  const playMutation = useMutation({
    mutationFn: ({ uri, offset = 0 }: { uri: string; offset?: number }) =>
      fetchPlaybackPlay(uri, offset),
    onSuccess: invalidate,
  });

  const prevMutation = useMutation({
    mutationFn: fetchPlaybackPrevious,
    onSuccess: invalidate,
  });

  const nextMutation = useMutation({
    mutationFn: fetchPlaybackNext,
    onSuccess: invalidate,
  });

  const resetProgressMutation = useMutation({
    mutationFn: () => fetchPlaybackSeek(0),
    onSuccess: invalidate,
  });

  const shuffleMutation = useOptimisticPlaybackMutation(
    (state: boolean) => fetchPlaybackShuffle(state),
    (state: boolean) => ({ shuffle_state: state }),
  );

  const repeatMutation = useOptimisticPlaybackMutation(
    (state: RepeatState) => fetchPlaybackRepeat(state),
    (state: RepeatState) => ({ repeat_state: state }),
  );

  const transferMutation = useMutation({
    mutationFn: ({ deviceId, isPlaying = false }: { deviceId: string; isPlaying?: boolean }) =>
      fetchTransferPlayback(deviceId, isPlaying),
    onSuccess: async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      queryClient.invalidateQueries({ queryKey: ["devices"] });
      queryClient.invalidateQueries({ queryKey: ["playback-state"] });
    },
  });

  return {
    pause: pauseMutation.mutate,
    resume: resumeMutation.mutate,
    play: playMutation.mutate,
    prev: prevMutation.mutate,
    next: nextMutation.mutate,
    resetProgress: resetProgressMutation.mutate,
    shuffle: shuffleMutation.mutate,
    repeat: repeatMutation.mutate,
    transfer: transferMutation.mutate,
  };
};

export default usePlaybackActions;
