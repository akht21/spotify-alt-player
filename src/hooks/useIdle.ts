import { useEffect, useState } from "react";

const ACTIVITY_EVENTS = ["pointermove", "pointerdown", "keydown", "wheel"] as const;

const useIdle = (timeout = 3000, enabled = true): boolean => {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setIsIdle(false);
      return;
    }

    let timer: ReturnType<typeof setTimeout>;

    const startTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setIsIdle(true), timeout);
    };

    const onActivity = (event: Event) => {
      if (event.target instanceof Element && event.target.closest("[data-idle-ignore]")) {
        return;
      }

      setIsIdle(false);
      startTimer();
    };

    startTimer();
    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, onActivity, { passive: true }),
    );

    return () => {
      clearTimeout(timer);
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, onActivity));
    };
  }, [timeout, enabled]);

  return isIdle;
};

export default useIdle;
