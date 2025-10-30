import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AggregatedItem } from '../../../../core/models/inventory';

@Component({
  standalone: true,
  selector: 'app-item-card',
  imports: [CommonModule],
  template: `
  <article class="card" style="border:1px solid #e2e5e9;border-radius:8px;padding:10px;background:#fff;">
    <div style="display:flex;gap:10px;align-items:center;">
      <img [src]="item?.item?.icon" [alt]="item?.item?.name ?? item?.id" style="width:48px;height:48px;object-fit:contain;" />
      <div>
        <h3 style="margin:0 0 4px 0;">{{item?.item?.name ?? ('#' + item?.id)}}</h3>
        <div class="meta" style="display:flex;gap:8px;font-size:12px;color:#555;">
          <span>{{item?.item?.type}} • {{item?.item?.rarity}}</span>
          <span>Cantidad: {{item?.total}}</span>
        </div>
      </div>
    </div>
    <details style="margin-top:6px;" *ngIf="item">
      <summary>Localizaciones ({{item.locations.length}})</summary>
      <ul>
        <li *ngFor="let loc of item.locations">{{loc.where}} {{loc.detail ? ('- ' + loc.detail) : ''}} ({{loc.count}})</li>
      </ul>
    </details>
  </article>
  `
})
export class ItemCardComponent { @Input() item?: AggregatedItem }


