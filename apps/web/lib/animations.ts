// Animation configuration objects for Framer Motion
// These can be spread directly onto motion components

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

export const fadeIn = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.4, ease: 'easeOut' },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

export const slideInLeft = {
  initial: { opacity: 0, x: -30 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

export const slideInRight = {
  initial: { opacity: 0, x: 30 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

// Helper function to create custom animations with consistent viewport settings
export const createAnimation = (
  initial: { opacity?: number; y?: number; x?: number; scale?: number },
  whileInView: { opacity?: number; y?: number; x?: number; scale?: number },
  duration: number = 0.5
) => ({
  initial,
  whileInView,
  viewport: { once: true, amount: 0.3 },
  transition: { duration, ease: 'easeOut' },
});
