import { Gw2Item } from './gw2';

export type ItemLocation = { where: 'personaje' | 'equipado' | 'banco' | 'materiales' | 'compartidas'; detail?: string; count?: number };

export type AggregatedItem = {
  id: number;
  total: number;
  locations: ItemLocation[];
  item?: Gw2Item;
};


