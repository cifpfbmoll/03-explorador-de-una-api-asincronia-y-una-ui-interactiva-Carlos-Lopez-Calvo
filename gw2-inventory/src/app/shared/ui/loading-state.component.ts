import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-loading-state',
  imports: [CommonModule],
  template: `
    <div *ngIf="loading" class="loading">Cargando…</div>
    <div *ngIf="error" class="error">{{error}}</div>
    <div *ngIf="!loading && !error && empty" class="empty">Sin resultados.</div>
  `
})
export class LoadingStateComponent {
  @Input() loading = false;
  @Input() error: string | null = null;
  @Input() empty = false;
}


