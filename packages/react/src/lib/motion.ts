const durationMap = {
  instant: 0,
  fast: 100,
  normal: 200,
  slow: 300,
  expressive: 500,
} as const;

const easingMap = {
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  emphasize: 'cubic-bezier(0.32, 0.72, 0, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

function transition(
  property: string,
  duration: keyof typeof durationMap = 'normal',
  easing: keyof typeof easingMap = 'default',
): string {
  return `${property} ${durationMap[duration]}ms ${easingMap[easing]}`;
}

export const motion = {
  duration: durationMap,
  easing: easingMap,
  transition,
} as const;
