/**
 * Design System Motion Presets
 * Pre-calibrated Framer Motion transitions enforcing subtle, non-excessive choreography.
 */

export const motion = {
  duration: {
    instant: 0.1,
    fast: 0.15,
    normal: 0.25,
    slow: 0.4,
  },
  easing: {
    default: [0.16, 1, 0.3, 1] as const, // Spring-like cubic bezier
    anticipate: [0.36, 0, 0.66, -0.56] as const,
    sharp: [0.4, 0, 0.2, 1] as const,
  },
} as const;

export const motionPresets = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: motion.duration.normal, ease: motion.easing.default },
  },
  slideUp: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 16 },
    transition: { duration: motion.duration.normal, ease: motion.easing.default },
  },
  slideDown: {
    initial: { opacity: 0, y: -16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
    transition: { duration: motion.duration.normal, ease: motion.easing.default },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.96 },
    transition: { duration: motion.duration.fast, ease: motion.easing.default },
  },
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  },
  hoverCard: {
    rest: { y: 0, transition: { duration: motion.duration.fast, ease: motion.easing.default } },
    hover: { y: -4, transition: { duration: motion.duration.fast, ease: motion.easing.default } },
  },
} as const;

export type MotionTokens = typeof motion;
