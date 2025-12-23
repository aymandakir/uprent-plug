import { Variants, Transition } from "framer-motion";
import { AnimationConfig } from "../../../types/trust-builder";

export const easeOutExpo: number[] = [0.16, 1, 0.3, 1];

export const listItemVariants: Variants = {
  hidden: { opacity: 0, x: 40, filter: "blur(4px)" },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, delay, ease: easeOutExpo }
  }),
  exit: {
    opacity: 0,
    x: -30,
    filter: "blur(4px)",
    transition: { duration: 0.45, ease: easeOutExpo }
  }
};

export const metricVariants: Variants = {
  initial: { opacity: 0, y: 12, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: easeOutExpo }
  }
};

export const iconPulse: Transition = {
  repeat: Infinity,
  repeatType: "reverse",
  duration: 1.6,
  ease: easeOutExpo
};

export const reducedMotionTransition: Transition = {
  duration: 0
};

export const animationDefaults: AnimationConfig = {
  duration: 0.6,
  delay: 0.08,
  easing: easeOutExpo
};

