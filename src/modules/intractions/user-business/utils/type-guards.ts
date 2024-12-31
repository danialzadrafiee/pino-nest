import { Tier } from '../types/tier.interface';

export function isTier(obj: any): obj is Tier {
  return (
    typeof obj === 'object' &&
    typeof obj.requiredLevel === 'number' &&
    typeof obj.image === 'string' &&
    typeof obj.achievement === 'object' &&
    typeof obj.achievement.type === 'string' &&
    typeof obj.achievement.multiplier === 'number'
  );
}
