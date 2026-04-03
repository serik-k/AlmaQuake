import { useCallback, useEffect, useState } from 'react';
import { Vibration } from 'react-native';

// Morse SOS: · · · — — — · · ·
// dot=200ms, dash=600ms, symbol gap=200ms, letter gap=600ms
const DOT = 200;
const DASH = 600;
const SYM = 200;
const LET = 600;

// Vibration pattern: [pause, vibrate, pause, vibrate, ...]
// React Native Vibration.vibrate(pattern, repeat) starts with a pause segment.
// We start with 0 to begin immediately.
const SOS_PATTERN = [
  // S: · · ·
  0, DOT, SYM, DOT, SYM, DOT, LET,
  // O: — — —
  DASH, SYM, DASH, SYM, DASH, LET,
  // S: · · ·
  DOT, SYM, DOT, SYM, DOT,
  // pause before repeat
  2000,
];

export function useSOS() {
  const [active, setActive] = useState(false);

  const start = useCallback(() => {
    Vibration.vibrate(SOS_PATTERN, true);
    setActive(true);
  }, []);

  const stop = useCallback(() => {
    Vibration.cancel();
    setActive(false);
  }, []);

  const toggle = useCallback(() => {
    if (active) {
      stop();
    } else {
      start();
    }
  }, [active, start, stop]);

  // Cancel vibration on unmount
  useEffect(() => {
    return () => { Vibration.cancel(); };
  }, []);

  return { active, start, stop, toggle };
}
