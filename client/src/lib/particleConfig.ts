export interface ParticleConfig {
  particleCount: number;
  baseRadius: number;
  maxRadius: number;
  baseOpacity: number;
  maxOpacity: number;
  mouseInfluenceRadius: number;
  connectionDistance: number;
  attractionStrength: number;
  colors: {
    minHue: number;
    maxHue: number;
    saturation: number;
    lightness: number;
  };
  trail: {
    enabled: boolean;
    maxPoints: number;
    fadeTime: number;
  };
  glow: {
    enabled: boolean;
    intensity: number;
  };
  mouseGlow: {
    enabled: boolean;
    radius: number;
    opacity: number;
  };
}

export const particleConfigs = {
  home: {
    particleCount: 80,
    baseRadius: 1,
    maxRadius: 3,
    baseOpacity: 0.3,
    maxOpacity: 0.8,
    mouseInfluenceRadius: 150,
    connectionDistance: 120,
    attractionStrength: 0.002,
    colors: {
      minHue: 200,
      maxHue: 260,
      saturation: 80,
      lightness: 60,
    },
    trail: {
      enabled: true,
      maxPoints: 10,
      fadeTime: 1000,
    },
    glow: {
      enabled: true,
      intensity: 3,
    },
    mouseGlow: {
      enabled: true,
      radius: 30,
      opacity: 0.1,
    },
  },
  
  other: {
    particleCount: 40,
    baseRadius: 0.5,
    maxRadius: 1.5,
    baseOpacity: 0.1,
    maxOpacity: 0.3,
    mouseInfluenceRadius: 80,
    connectionDistance: 80,
    attractionStrength: 0.001,
    colors: {
      minHue: 200,
      maxHue: 230,
      saturation: 40,
      lightness: 50,
    },
    trail: {
      enabled: false,
      maxPoints: 5,
      fadeTime: 500,
    },
    glow: {
      enabled: false,
      intensity: 1,
    },
    mouseGlow: {
      enabled: false,
      radius: 15,
      opacity: 0.05,
    },
  },
} as const;