import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Gw2AccountInventoryService } from '../../core/services/gw2-account-inventory.service';

type SortKey = 'nombre' | 'cantidad' | 'rareza' | 'tipo';

@Component({
  standalone: true,
  selector: 'app-inventory-page',
  imports: [CommonModule],
  template: `
  <div class="container">
    <section class="toolbar" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
      <input placeholder="API key" [value]="apiKey()" (input)="apiKey.set(($event.target as HTMLInputElement).value)" />
      <button (click)="load()">Cargar inventario</button>
    </section>

    <section class="filters" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
      <input placeholder="Buscar ítem" [value]="q()" (input)="q.set(($event.target as HTMLInputElement).value)" />
      <select [value]="rarity()" (change)="rarity.set(($event.target as HTMLSelectElement).value)">
        <option value="">Todas las rarezas</option>
        <option *ngFor="let r of rarezas" [value]="r">{{r}}</option>
      </select>
      <select [value]="type()" (change)="type.set(($event.target as HTMLSelectElement).value)">
        <option value="">Todos los tipos</option>
        <option *ngFor="let t of tipos" [value]="t">{{t}}</option>
      </select>
      <select [value]="sortBy()" (change)="sortBy.set(($event.target as HTMLSelectElement).value as any)">
        <option value="nombre">Nombre</option>
        <option value="cantidad">Cantidad</option>
        <option value="rareza">Rareza</option>
        <option value="tipo">Tipo</option>
      </select>
    </section>

    @if (svc.loading$()) {
      <div class="loading">Cargando…</div>
    } @else if (svc.error$()) {
      <div class="error">{{svc.error$()}}</div>
    } @else {
      @if (filtered().length === 0) {
        <div class="empty">Sin resultados.</div>
      } @else {
        <div class="grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;">
          @for (item of filtered(); track item.id) {
            <article class="card" style="border:1px solid #e2e5e9;border-radius:8px;padding:10px;background:#fff;">
              <div style="display:flex;gap:10px;align-items:center;">
                <img [src]="item.item?.icon" [alt]="item.item?.name ?? item.id" style="width:48px;height:48px;object-fit:contain;" />
                <div>
                  <h3 style="margin:0 0 4px 0;">{{item.item?.name ?? ('#' + item.id)}}</h3>
                  <div class="meta" style="display:flex;gap:8px;font-size:12px;color:#555;">
                    <span>{{item.item?.type}} • {{item.item?.rarity}}</span>
                    <span>Cantidad: {{item.total}}</span>
                  </div>
                </div>
              </div>
              <details style="margin-top:6px;">
                <summary>Localizaciones ({{item.locations.length}})</summary>
                <ul>
                  <li *ngFor="let loc of item.locations">
                    {{loc.where}} {{loc.detail ? ('- ' + loc.detail) : ''}} ({{loc.count}})
                  </li>
                </ul>
              </details>
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
  sortBy = signal<SortKey>('nombre');

  rarezas = ['Junk','Basic','Fine','Masterwork','Rare','Exotic','Ascended','Legendary'];
  tipos = ['Armor','Weapon','Trinket','UpgradeComponent','Consumable','CraftingMaterial','Container','Gizmo','Back','Bag','SalvageKit','MiniPet','Tool','Trait','Trophy','Key'];

  constructor() {
    effect(() => { if (this.apiKey()) this.svc.setApiKey(this.apiKey()); });
  }

  load() { this.svc.loadAll('es'); }

  filtered = computed(() => {
    const q = this.q().trim().toLowerCase();
    const rar = this.rarity();
    const typ = this.type();
    const sort = this.sortBy();
    const items = this.svc.items$();
    type Item = (typeof items)[number];
    
    let arr = items;

    if (q) arr = arr.filter((a: Item) => (a.item?.name?.toLowerCase().includes(q)) || String(a.id).includes(q));
    if (rar) arr = arr.filter((a: Item) => a.item?.rarity === rar);
    if (typ) arr = arr.filter((a: Item) => a.item?.type === typ);

    const byName = (a: Item, b: Item) => (a.item?.name ?? '').localeCompare(b.item?.name ?? '');
    const byCount = (a: Item, b: Item) => b.total - a.total;
    const byRarity = (a: Item, b: Item) => (a.item?.rarity ?? '').localeCompare(b.item?.rarity ?? '');
    const byType = (a: Item, b: Item) => (a.item?.type ?? '').localeCompare(b.item?.type ?? '');

    const map: Record<SortKey, (a: Item, b: Item) => number> = { nombre: byName, cantidad: byCount, rareza: byRarity, tipo: byType };
    const sortFn = map[sort as SortKey];
    return [...arr].sort(sortFn);
  });
}


