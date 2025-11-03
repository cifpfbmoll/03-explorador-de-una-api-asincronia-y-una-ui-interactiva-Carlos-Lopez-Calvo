import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { InventoryPageComponent } from './app/features/inventory/inventory-page.component';

bootstrapApplication(InventoryPageComponent, {
  providers: [provideHttpClient(withFetch()), provideRouter(routes)],
}).catch((err: unknown) => console.error(err));


