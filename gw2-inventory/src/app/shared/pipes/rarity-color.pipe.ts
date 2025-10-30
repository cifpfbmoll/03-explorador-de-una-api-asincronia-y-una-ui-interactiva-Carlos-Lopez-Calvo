import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'rarityColor', standalone: true })
export class RarityColorPipe implements PipeTransform {
  transform(rarity?: string): string {
    switch (rarity) {
      case 'Junk': return '#AAAAAA';
      case 'Basic': return '#FFFFFF';
      case 'Fine': return '#62A4DA';
      case 'Masterwork': return '#1a9306';
      case 'Rare': return '#fcd00b';
      case 'Exotic': return '#ffa405';
      case 'Ascended': return '#fb3e8d';
      case 'Legendary': return '#4C139D';
      default: return '#e2e5e9';
    }
  }
}


