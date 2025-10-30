import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-filters-bar',
  imports: [CommonModule],
  template: `
  <section style="display:flex;gap:8px;flex-wrap:wrap;">
    <input placeholder="Buscar ítem" [value]="q" (input)="qChange.emit(($event.target as HTMLInputElement).value)" />
    <select [value]="rarity" (change)="rarityChange.emit(($event.target as HTMLSelectElement).value)">
      <option value="">Todas las rarezas</option>
      <option *ngFor="let r of rarezas" [value]="r">{{r}}</option>
    </select>
    <select [value]="type" (change)="typeChange.emit(($event.target as HTMLSelectElement).value)">
      <option value="">Todos los tipos</option>
      <option *ngFor="let t of tipos" [value]="t">{{t}}</option>
    </select>
    <select [value]="sortBy" (change)="sortByChange.emit(($event.target as HTMLSelectElement).value)">
      <option value="nombre">Nombre</option>
      <option value="cantidad">Cantidad</option>
      <option value="rareza">Rareza</option>
      <option value="tipo">Tipo</option>
    </select>
  </section>
  `
})
export class FiltersBarComponent {
  @Input() q = '';
  @Input() rarity = '';
  @Input() type = '';
  @Input() sortBy = 'nombre';
  @Input() rarezas: string[] = [];
  @Input() tipos: string[] = [];
  @Output() qChange = new EventEmitter<string>();
  @Output() rarityChange = new EventEmitter<string>();
  @Output() typeChange = new EventEmitter<string>();
  @Output() sortByChange = new EventEmitter<string>();
}


