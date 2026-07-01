import { useTheme } from '@/hooks/use-theme';

export function useReveal<T extends Record<string, unknown>>(
  hidden: T,
  shown: T,
  viewport: Record<string, unknown> = { once: true }
) {
  const { isZenMode } = useTheme();
  return isZenMode
    ? { initial: false as const, animate: shown }
    : { initial: hidden, whileInView: shown, viewport };
}
