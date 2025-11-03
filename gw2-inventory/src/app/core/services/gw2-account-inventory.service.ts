import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom, catchError, throwError } from 'rxjs';
import { AggregatedItem } from '../models/inventory';
import { Gw2Character, Gw2Item, Gw2Material } from '../models/gw2';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class Gw2AccountInventoryService {
  private http = inject(HttpClient);
  private base = environment.apiUrl

  apiKey = signal<string | null>(null);

  private loading = signal(false);
  private error = signal<string | null>(null);
  private aggregated = signal<Map<number, AggregatedItem>>(new Map());

  loading$ = this.loading.asReadonly();
  error$ = this.error.asReadonly();
  items$ = computed(() => Array.from(this.aggregated().values()));

  setApiKey(key: string) { this.apiKey.set(key); }

  loadMockData() {
    this.loading.set(true);
    this.error.set(null);
    
    setTimeout(() => {
      const acc = new Map<number, AggregatedItem>();
      
      // Datos de ejemplo
      const mockItems = [
        { id: 19684, count: 250, where: 'banco', item: { id: 19684, name: 'Mineral de hierro', icon: 'https://render.guildwars2.com/file/0FC9A8A03E1B69E37E6C7AB2D29EF24670CBC1E3/619316.png', rarity: 'Basic', type: 'CraftingMaterial' } },
        { id: 24277, count: 50, where: 'personaje', detail: 'Mi Guerrero', item: { id: 24277, name: 'Espada de acero', icon: 'https://render.guildwars2.com/file/8C4C0B35D5BF3DEF55CE9B36B531AC804A290BE2/340533.png', rarity: 'Fine', type: 'Weapon' } },
        { id: 19721, count: 100, where: 'materiales', item: { id: 19721, name: 'Tela de algodón', icon: 'https://render.guildwars2.com/file/742F00C1ADB1489BD010C304D10E0FFAA8C2A7FD/619332.png', rarity: 'Fine', type: 'CraftingMaterial' } },
        { id: 19748, count: 5, where: 'equipado', detail: 'Mi Guardián', item: { id: 19748, name: 'Armadura de mithril', icon: 'https://render.guildwars2.com/file/2D0AE341F6C0250C6D3FE579E6F26EF33C8BED32/561520.png', rarity: 'Rare', type: 'Armor' } },
        { id: 24351, count: 150, where: 'banco', item: { id: 24351, name: 'Madera verde', icon: 'https://render.guildwars2.com/file/97FF89DBDA9C3FC58B40A595E6AD5C5A747F31DC/619324.png', rarity: 'Basic', type: 'CraftingMaterial' } },
        { id: 19750, count: 75, where: 'compartidas', item: { id: 19750, name: 'Cuero resistente', icon: 'https://render.guildwars2.com/file/8B9A7104328E31A72D2A5619D53D07E1A82684E9/619320.png', rarity: 'Fine', type: 'CraftingMaterial' } },
        { id: 30687, count: 1, where: 'personaje', detail: 'Mi Elementalista', item: { id: 30687, name: 'Báculo exótico', icon: 'https://render.guildwars2.com/file/4DBF8DC187020B6430C3974A57D8DEEC21034711/340561.png', rarity: 'Exotic', type: 'Weapon' } },
        { id: 24289, count: 200, where: 'materiales', item: { id: 24289, name: 'Mineral de cobre', icon: 'https://render.guildwars2.com/file/F1DC8D95EDC903B778A877B8DDE5C45C77C63800/619312.png', rarity: 'Basic', type: 'CraftingMaterial' } },
      ];
      
      for (const mock of mockItems) {
        this.add(acc, mock.id, mock.count, { where: mock.where as any, detail: mock.detail });
        const row = acc.get(mock.id);
        if (row && mock.item) {
          row.item = mock.item as any;
        }
      }
      
      this.aggregated.set(acc);
      this.loading.set(false);
    }, 500);
  }

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
      console.error('Error detallado:', e);
      if (e instanceof HttpErrorResponse) {
        if (e.status === 503) {
          const errorText = typeof e.error === 'string' ? e.error : '';
          if (errorText.includes('API Temporarily disabled')) {
            this.error.set('🔧 La API de Guild Wars 2 está temporalmente en mantenimiento. Por favor, intenta más tarde.');
          } else {
            this.error.set('⚠️ Servicio no disponible (503). Intenta más tarde.');
          }
        } else if (e.status === 404 || e.status === 403) {
          this.error.set('🔑 API key inválida o sin permisos. Verifica que tenga permisos: account, inventories, characters');
        } else if (e.status === 0) {
          this.error.set('🌐 Error de conexión. Verifica tu API key e internet.');
        } else {
          this.error.set(`❌ Error HTTP ${e.status}: ${e.message}`);
        }
      } else {
        this.error.set(e?.message ?? 'Error cargando inventario');
      }
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
    const key = this.apiKey();
    if (!key) throw new Error('API key no configurada');
    
    const headers = new HttpHeaders({ 
      'Authorization': `Bearer ${key}`,
      'Accept': 'application/json'
    });
    const p = new HttpParams({ fromObject: params ?? {} });
    const url = `${this.base}${path}`;
    
    console.log('Haciendo petición a:', url, 'con params:', params);
    
    return await firstValueFrom(
      this.http.get<T>(url, { headers, params: p }).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error en petición:', error);
          return throwError(() => error);
        })
      )
    );
  }
}


