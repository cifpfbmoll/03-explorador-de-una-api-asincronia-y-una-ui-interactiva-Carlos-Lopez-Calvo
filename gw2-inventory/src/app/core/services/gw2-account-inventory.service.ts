import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AggregatedItem } from '../models/inventory';
import { Gw2Character, Gw2Item, Gw2Material } from '../models/gw2';

@Injectable({ providedIn: 'root' })
export class Gw2AccountInventoryService {
  private http = inject(HttpClient);
  private base = 'https://api.guildwars2.com/v2';

  apiKey = signal<string | null>(null);

  private loading = signal(false);
  private error = signal<string | null>(null);
  private aggregated = signal<Map<number, AggregatedItem>>(new Map());

  loading$ = this.loading.asReadonly();
  error$ = this.error.asReadonly();
  items$ = computed(() => Array.from(this.aggregated().values()));

  setApiKey(key: string) { this.apiKey.set(key); }

  async loadAll(lang: 'es' | 'en' = 'es') {
    const key = this.apiKey();
    if (!key) { this.error.set('Falta API key'); return; }
    this.loading.set(true); this.error.set(null);
    const acc = new Map<number, AggregatedItem>();
    try {
      const [characters, bank, materials, shared] = await Promise.all([
        this.get<Gw2Character[]>(`/characters`, { ids: 'all' }),
        this.get<(null | { id: number; count: number })[]>(`/account/bank`),
        this.get<Gw2Material[]>(`/account/materials`),
        this.get<(null | { id: number; count: number })[]>(`/account/inventory`),
      ]);

      for (const ch of characters ?? []) {
        const name = ch?.name ?? 'Unknown';
        for (const bag of ch?.bags ?? []) {
          for (const slot of bag?.inventory ?? []) {
            if (!slot || !slot.id) continue;
            this.add(acc, slot.id, slot.count ?? 1, { where: 'personaje', detail: name });
          }
        }
        for (const eq of ch?.equipment ?? []) {
          const id = (eq as any)?.id; if (!id) continue;
          this.add(acc, id, 1, { where: 'equipado', detail: name });
        }
      }

      for (const slot of bank ?? []) {
        const id = (slot as any)?.id; if (!id) continue;
        this.add(acc, id, (slot as any).count ?? 1, { where: 'banco' });
      }

      for (const m of materials ?? []) {
        if (!m?.id) continue;
        this.add(acc, m.id, m.count ?? 0, { where: 'materiales' });
      }

      for (const slot of shared ?? []) {
        const id = (slot as any)?.id; if (!id) continue;
        this.add(acc, id, (slot as any).count ?? 1, { where: 'compartidas' });
      }

      const ids = Array.from(acc.keys());
      const meta = await this.fetchItemsInBatches(ids, lang);
      for (const it of meta) { const row = acc.get(it.id); if (row) row.item = it as any; }

      this.aggregated.set(acc);
    } catch (e: any) {
      this.error.set(e?.message ?? 'Error cargando inventario');
    } finally { this.loading.set(false); }
  }

  private add(map: Map<number, AggregatedItem>, id: number, count: number, loc: AggregatedItem['locations'][number]) {
    if (!map.has(id)) map.set(id, { id, total: 0, locations: [] });
    const row = map.get(id)!;
    row.total += count;
    row.locations.push({ ...loc, count });
  }

  private async fetchItemsInBatches(ids: number[], lang: string) {
    const out: Gw2Item[] = [];
    const chunk = 200;
    for (let i = 0; i < ids.length; i += chunk) {
      const part = ids.slice(i, i + chunk);
      const params: any = { ids: part.join(','), lang };
      const res = await this.get<Gw2Item[]>(`/items`, params);
      out.push(...(res ?? []));
    }
    return out;
  }

  private async get<T>(path: string, params?: Record<string, string>) {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.apiKey()}` });
    const p = new HttpParams({ fromObject: params ?? {} });
    return await firstValueFrom(this.http.get<T>(`${this.base}${path}`, { headers, params: p }));
  }
}


