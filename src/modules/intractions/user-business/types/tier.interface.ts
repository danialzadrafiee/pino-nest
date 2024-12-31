export interface Tier {
  requiredLevel: number;
  image: string;
  achievement: {
    type: string;
    multiplier: number;
  };
}
