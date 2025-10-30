# GW2 Inventory - Explorador de Inventario de Guild Wars 2

Aplicación Angular 20 standalone que muestra el inventario completo de una cuenta de Guild Wars 2 (personajes, banco, materiales y compartidas) con búsqueda, filtros y ordenación.

## Requisitos Previos

- Node.js 18+ y npm
- Una API key de Guild Wars 2 con los siguientes permisos:
  - `account`
  - `inventories`
  - `characters`

### Cómo obtener tu API Key

1. Ve a [https://account.arena.net/applications](https://account.arena.net/applications)
2. Inicia sesión con tu cuenta de Guild Wars 2
3. Crea una nueva clave de API
4. Selecciona los permisos: **account**, **inventories**, **characters**
5. Copia la clave generada

## Instalación

```bash
cd gw2-inventory
npm install
```

## Ejecución

```bash
npm start
```

La aplicación se abrirá en `http://localhost:4200`

## Uso

1. Pega tu API key en el campo de entrada
2. Pulsa el botón "Cargar inventario"
3. Espera a que se carguen todos los datos (puede tardar unos segundos)
4. Usa los filtros para:
   - **Buscar** por nombre o ID de ítem
   - **Filtrar por rareza**: Junk, Basic, Fine, Masterwork, Rare, Exotic, Ascended, Legendary
   - **Filtrar por tipo**: Armor, Weapon, Trinket, etc.
   - **Ordenar por**: Nombre, Cantidad, Rareza o Tipo
5. Haz clic en "Localizaciones" para ver dónde está cada ítem

## Estructura del Proyecto

```
gw2-inventory/
├── src/
│   ├── main.ts                      # Bootstrap de la aplicación
│   ├── index.html                   # HTML principal
│   ├── styles.css                   # Estilos globales
│   ├── app/
│   │   ├── app.routes.ts           # Configuración de rutas
│   │   ├── core/
│   │   │   ├── models/
│   │   │   │   ├── gw2.ts         # Tipos de la API GW2
│   │   │   │   └── inventory.ts    # Tipos de inventario agregado
│   │   │   └── services/
│   │   │       └── gw2-account-inventory.service.ts  # Servicio principal
│   │   ├── features/
│   │   │   └── inventory/
│   │   │       ├── inventory-page.component.ts       # Página principal
│   │   │       └── components/
│   │   │           ├── item-card/
│   │   │           ├── filters-bar/
│   │   │           └── search-bar/
│   │   └── shared/
│   │       ├── pipes/
│   │       │   └── rarity-color.pipe.ts
│   │       └── ui/
│   │           └── loading-state.component.ts
│   └── environments/
│       ├── environment.ts
│       └── environment.prod.ts
├── angular.json
├── package.json
└── tsconfig.json
```

## Características Técnicas

### Framework y Librerías
- **Angular 20.3.0** con componentes standalone
- **RxJS** para operaciones asíncronas
- **HttpClient** para llamadas HTTP
- **Signals** para reactividad

### API de Guild Wars 2
- Base URL: `https://api.guildwars2.com/v2`
- Endpoints utilizados:
  - `/characters?ids=all` - Lista de personajes con inventarios
  - `/account/bank` - Banco de cuenta
  - `/account/materials` - Almacén de materiales
  - `/account/inventory` - Casillas compartidas
  - `/items?ids=...&lang=es` - Metadatos de ítems en español

### Funcionalidades

1. **Carga de inventario completo**:
   - Personajes (bolsas + equipo equipado)
   - Banco
   - Materiales
   - Casillas compartidas

2. **Agregación inteligente**:
   - Suma cantidades por `item_id`
   - Guarda localizaciones detalladas
   - Batch de metadatos en grupos de 200 ítems

3. **UI reactiva con signals**:
   - Estados: cargando, error, sin resultados
   - Búsqueda en tiempo real
   - Filtros y ordenación instantáneos

4. **Filtros y ordenación**:
   - Búsqueda por nombre o ID
   - Filtro por rareza y tipo
   - Orden por nombre, cantidad, rareza o tipo

## Cumplimiento del Requisito

Este proyecto cumple con todos los requisitos del `README.md` original:

- ✅ Angular ~20.3.0 con componentes standalone
- ✅ Signals para actualizaciones reactivas
- ✅ Servicios para lógica de negocio
- ✅ HttpClientModule para llamadas API
- ✅ Manejo de estados (carga, error, vacío)
- ✅ Búsqueda y filtros
- ✅ UI interactiva y moderna
- ✅ API pública (Guild Wars 2)
- ✅ Asincronía con RxJS y Promises

## Build para Producción

```bash
npm run build
```

Los archivos de producción se generarán en `dist/gw2-inventory/`

## Notas

- La API key se guarda solo en memoria (signal), no se persiste
- Los límites de rate de la API GW2 son generosos para uso personal
- El idioma de los ítems está configurado a español (`lang=es`)
- Las imágenes de los ítems se cargan desde `render.guildwars2.com`

## Autor

Carlos López Calvo

