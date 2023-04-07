export type Item = {
  implicitRoll: number;
  quality: Quality;
  influence: Influence;
  modifiers: AffixTierRoll[];
  anoints: Anointment[];
};

export type AffixTierRoll = {
  name: string;
  roll1: number;
  roll2?: number;
  tags: Quality[];
};

export type Quality =
  | "Attribute"
  | "Attack"
  | "Resistance"
  | "Life and Mana"
  | "Caster"
  | "Defense"
  | "Elemental Damage"
  | "Speed"
  | "Critical"
  | "Physical and Chaos Damage";

export type Anointment = {
  name: string;
  description: string;
};

export type Modifier = {
  name: string;
  tier: number;
  weight: number;
};

export type Influence =
  | "Hunter"
  | "Redeemer"
  | "Warlord"
  | "Crusader"
  | "Shaper"
  | "Elder";

type AffixTier = {
  weight: number;
  roll1min: number;
  roll1max: number;
  roll2min?: number;
  roll2max?: number;
};

export type AffixFamily = {
  name: string;
  weight: number;
  tags: Quality[];
  tiers: AffixTier[];
  id: string;
};
