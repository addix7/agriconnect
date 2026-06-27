import { useEffect, useRef } from "react";
import { animate } from "motion/react";

interface Props {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
}

export function AnimatedCounter({ to, prefix = "", suffix = "", duration = 1.1, decimals = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(val) {
        el.textContent = prefix + val.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + suffix;
      },
    });

    return controls.stop;
  }, [to, prefix, suffix, duration, decimals]);

  return (
    <span ref={ref}>
      {prefix}{to.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{suffix}
    </span>
  );
}
