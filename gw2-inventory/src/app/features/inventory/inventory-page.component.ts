import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Gw2AccountInventoryService } from '../../core/services/gw2-account-inventory.service';
import { RarityColorPipe } from '../../shared/pipes/rarity-color.pipe';
type SortKey = 'nombre' | 'cantidad' | 'rareza' | 'tipo';

@Component({
  standalone: true,
  selector: 'app-inventory-page',
  imports: [CommonModule, RarityColorPipe],
  template: `
  <div class="container">
    <section class="toolbar" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;align-items:center;">
      <input placeholder="API key" [value]="apiKey()" (input)="apiKey.set($any($event.target).value)" style="flex:1;min-width:200px;padding:8px;border:1px solid #ccc;border-radius:4px;" />
      <button (click)="load()" style="padding:8px 16px;background:#5865f2;color:white;border:none;border-radius:4px;cursor:pointer;font-weight:500;">Cargar inventario</button>
      <button (click)="loadDemo()" style="padding:8px 16px;background:#57f287;color:white;border:none;border-radius:4px;cursor:pointer;font-weight:500;">📦 Ver Demo</button>
    </section>

    <section class="filters" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
      <input placeholder="🔍 Buscar ítem" [value]="q()" (input)="q.set($any($event.target).value)" style="flex:1;min-width:200px;padding:8px;border:1px solid #ddd;border-radius:4px;" />
      <select [value]="rarity()" (change)="rarity.set($any($event.target).value)" style="padding:8px;border:1px solid #ddd;border-radius:4px;">
        <option value="">Todas las rarezas</option>
        <option *ngFor="let r of rarezas" [value]="r">{{r}}</option>
      </select>
      <select [value]="type()" (change)="type.set($any($event.target).value)" style="padding:8px;border:1px solid #ddd;border-radius:4px;">
        <option value="">Todos los tipos</option>
        <option *ngFor="let t of tipos" [value]="t">{{t}}</option>
      </select>
      <select [value]="location()" (change)="location.set($any($event.target).value)" style="padding:8px;border:1px solid #ddd;border-radius:4px;">
        <option value="">📍 Todas las ubicaciones</option>
        <option *ngFor="let loc of ubicaciones" [value]="loc">{{loc}}</option>
      </select>
      <select [value]="sortBy()" (change)="sortBy.set($any($event.target).value)" style="padding:8px;border:1px solid #ddd;border-radius:4px;">
        <option value="nombre">📝 Nombre</option>
        <option value="cantidad">🔢 Cantidad</option>
        <option value="rareza">⭐ Rareza</option>
        <option value="tipo">📦 Tipo</option>
      </select>
    </section>

    @if (svc.loading$()) {
      <div class="loading" style="text-align:center;padding:40px;font-size:18px;color:#5865f2;">
        ⏳ Cargando inventario...
      </div>
    } @else if (svc.error$()) {
      <div class="error" style="background:#fee;border:1px solid #fcc;border-radius:8px;padding:16px;margin:20px 0;color:#c33;">
        {{svc.error$()}}
      </div>
    } @else {
      @if (filtered().length === 0) {
        <div class="empty" style="text-align:center;padding:40px;color:#999;font-size:16px;">
          🔍 Sin resultados. Intenta ajustar los filtros o haz clic en "Ver Demo" para ver datos de ejemplo.
        </div>
      } @else {
        <div class="grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;">
          @for (item of filtered(); track item.id) {
                      <article class="card" [style.border]="'3px solid ' + (item.item?.rarity | rarityColor)" style="border-radius:8px;padding:14px;background:#fff;box-shadow:0 2px 4px rgba(0,0,0,0.05);">
              <!-- Icono + Nombre -->
              <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:12px;">
                <img [src]="item.item?.icon" [alt]="item.item?.name ?? item.id" 
                     style="width:56px;height:56px;object-fit:contain;border-radius:6px;background:#f8f9fa;padding:4px;" />
                <div style="flex:1;min-width:0;">
                  <h3 style="margin:0 0 8px 0;font-size:16px;font-weight:600;line-height:1.3;word-break:break-word;">
                    {{item.item?.name ?? ('#' + item.id)}}
                  </h3>
                  <!-- Tipo + Cantidad -->
                  <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
                    <span style="display:inline-flex;align-items:center;padding:4px 8px;background:#f1f3f5;border-radius:4px;font-size:11px;font-weight:500;color:#495057;">
                      📦 {{item.item?.type || 'Unknown'}}
                    </span>
                    <span style="display:inline-flex;align-items:center;padding:4px 8px;background:#e7f5ff;border-radius:4px;font-size:11px;font-weight:600;color:#1971c2;">
                      ×{{item.total}}
                    </span>
                  </div>
                </div>
              </div>
              
              <!-- Localizaciones -->
              <div style="border-top:1px solid #e9ecef;padding-top:10px;">
                <div style="font-size:11px;font-weight:600;color:#868e96;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">
                  📍 Localizaciones ({{item.locations.length}})
                </div>
                <div style="display:flex;flex-direction:column;gap:4px;">
                  @for (loc of item.locations; track $index) {
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;background:#f8f9fa;border-radius:4px;font-size:12px;">
                      <span style="color:#495057;">
                        <strong>{{loc.where}}</strong>
                        @if (loc.detail) {
                          <span style="color:#868e96;"> — {{loc.detail}}</span>
                        }
                      </span>
                      <span style="font-weight:600;color:#1971c2;">×{{loc.count}}</span>
                    </div>
                  }
                </div>
              </div>
            </article>
          }
        </div>
      }
    }
  </div>
  `
})
export class InventoryPageComponent {
  svc = inject(Gw2AccountInventoryService);

  apiKey = signal('');
  q = signal('');
  rarity = signal('');
  type = signal('');
  location = signal('');
  sortBy = signal<SortKey>('nombre');

  rarezas = ['Junk','Basic','Fine','Masterwork','Rare','Exotic','Ascended','Legendary'];
  tipos = ['Armor','Weapon','Trinket','UpgradeComponent','Consumable','CraftingMaterial','Container','Gizmo','Back','Bag','SalvageKit','MiniPet','Tool','Trait','Trophy','Key'];
  ubicaciones = ['banco', 'personaje', 'materiales', 'equipado', 'compartidas'];

  constructor() {
    effect(() => { if (this.apiKey()) this.svc.setApiKey(this.apiKey()); });
  }

  load() { this.svc.loadAll('es'); }
  
  loadDemo() { this.svc.loadMockData(); }

  filtered = computed(() => {
    const q = this.q().trim().toLowerCase();
    const rar = this.rarity();
    const typ = this.type();
    const loc = this.location();
    const sort = this.sortBy();
    const items = this.svc.items$();
    type Item = (typeof items)[number];
    
    let arr = items;

    if (q) arr = arr.filter((a: Item) => (a.item?.name?.toLowerCase().includes(q)) || String(a.id).includes(q));
    if (rar) arr = arr.filter((a: Item) => a.item?.rarity === rar);
    if (typ) arr = arr.filter((a: Item) => a.item?.type === typ);
    if (loc) arr = arr.filter((a: Item) => a.locations.some(l => l.where === loc));

    const byName = (a: Item, b: Item) => (a.item?.name ?? '').localeCompare(b.item?.name ?? '');
    const byCount = (a: Item, b: Item) => b.total - a.total;
    const byRarity = (a: Item, b: Item) => (a.item?.rarity ?? '').localeCompare(b.item?.rarity ?? '');
    const byType = (a: Item, b: Item) => (a.item?.type ?? '').localeCompare(b.item?.type ?? '');

    const map: Record<SortKey, (a: Item, b: Item) => number> = { nombre: byName, cantidad: byCount, rareza: byRarity, tipo: byType };
    const sortFn = map[sort as SortKey];
    return [...arr].sort(sortFn);
  });
}


