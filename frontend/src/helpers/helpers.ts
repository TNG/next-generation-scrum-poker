import { dequal } from 'dequal';
import { useRef, useMemo } from 'preact/hooks';

export const doNothing = () => {
  /* nothing to do */
};

export function useDeepCompareMemoize<T>(value: T): T {
  const ref = useRef<T>(value);
  const signalRef = useRef<number>(0);

  if (!dequal(value, ref.current)) {
    ref.current = value;
    signalRef.current += 1;
  }

  return useMemo(() => ref.current, [signalRef.current]);
}
