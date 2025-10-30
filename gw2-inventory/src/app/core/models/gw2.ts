export type Gw2Item = {
  id: number;
  name: string;
  icon?: string;
  type: string;
  rarity: string;
};

export type Gw2Character = {
  name: string;
  bags?: Array<{ size: number; inventory: Array<{ id: number; count?: number } | null> }>;
  equipment?: Array<{ id: number } | null>;
};

export type Gw2Material = { id: number; count: number; category: number };


