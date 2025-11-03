# GW2 Inventory - Explorador de Inventario de Guild Wars 2

Aplicación Angular 20 standalone que muestra el inventario completo de una cuenta de Guild Wars 2 (personajes, banco, materiales y compartidas) con búsqueda, filtros, ordenación y una interfaz visual moderna e intuitiva.

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

### Opción 1: Modo Demostración (Recomendado para prueba rápida)

1. Haz clic en el botón verde **"📦 Ver Demo"**
2. Explora la aplicación con datos de ejemplo
3. Prueba todos los filtros y funcionalidades sin necesidad de API key

### Opción 2: Conectar tu cuenta de Guild Wars 2

1. Pega tu API key en el campo de entrada superior
2. Pulsa el botón **"Cargar inventario"**
3. Espera a que se carguen todos los datos (puede tardar unos segundos)
4. ¡Explora tu inventario completo!

### Características y Filtros Disponibles

#### 🔍 Búsqueda
- Busca por **nombre de ítem** o **ID numérico**
- Búsqueda en tiempo real mientras escribes

#### ⭐ Filtrar por Rareza
- Junk (Basura)
- Basic (Básico)
- Fine (Fino)
- Masterwork (Obra maestra)
- Rare (Raro)
- Exotic (Exótico)
- Ascended (Ascendido)
- Legendary (Legendario)

#### 📦 Filtrar por Tipo
- Armor (Armadura)
- Weapon (Arma)
- Trinket (Abalorio)
- Consumable (Consumible)
- CraftingMaterial (Material de fabricación)
- Y muchos más tipos...

#### 📍 Filtrar por Ubicación
- **banco**: Ítems en el banco de cuenta
- **personaje**: Ítems en inventarios de personajes
- **materiales**: Ítems en el almacén de materiales
- **equipado**: Ítems equipados en personajes
- **compartidas**: Ítems en ranuras compartidas

#### 🔀 Ordenar
- **Nombre**: Orden alfabético
- **Cantidad**: De mayor a menor cantidad
- **Rareza**: Por nivel de rareza
- **Tipo**: Agrupado por tipo de objeto

### Interfaz Visual

- **Cards con borde de color**: Cada ítem tiene un borde que refleja su rareza (legendario en morado, exótico en naranja, etc.)
- **Iconos grandes**: Visualización clara de cada ítem
- **Información detallada**: Nombre, tipo, cantidad total y todas sus ubicaciones
- **Localizaciones expandidas**: Ve exactamente dónde está cada ítem (banco, personaje específico, etc.)
- **Animaciones suaves**: Efectos hover en cards y botones para mejor experiencia

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

1. **Modo Demostración**:
   - Datos de ejemplo precargados
   - No requiere API key
   - Perfecto para probar la aplicación

2. **Carga de inventario completo**:
   - Personajes (bolsas + equipo equipado)
   - Banco de cuenta
   - Almacén de materiales
   - Casillas compartidas

3. **Agregación inteligente**:
   - Suma cantidades por `item_id`
   - Guarda localizaciones detalladas con nombre de personaje
   - Batch de metadatos en grupos de 200 ítems
   - Optimizado para grandes inventarios

4. **Sistema de filtrado avanzado**:
   - **Búsqueda textual**: Por nombre o ID
   - **Filtro de rareza**: 8 niveles diferentes
   - **Filtro de tipo**: 15+ tipos de ítems
   - **Filtro de ubicación**: 5 ubicaciones diferentes
   - Todos los filtros funcionan en conjunto

5. **UI reactiva con signals**:
   - Estados visuales: cargando, error, sin resultados
   - Búsqueda en tiempo real
   - Filtros y ordenación instantáneos
   - Actualizaciones sin recarga de página

6. **Diseño visual moderno**:
   - Cards con bordes de colores según rareza
   - Iconos de alta resolución
   - Badges informativos
   - Animaciones y efectos hover
   - Diseño responsive (se adapta a móviles)

7. **Manejo de errores robusto**:
   - Mensajes descriptivos con emojis
   - Detección de API en mantenimiento
   - Sugerencias de solución
   - Logs detallados en consola para debugging

8. **Configuración para desarrollo**:
   - Proxy configurado para evitar CORS
   - Environment separados (dev/prod)
   - Hot reload para desarrollo rápido

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

## Capturas de Pantalla

### Características Visuales
- 🎨 **Bordes de colores por rareza**: Legendario (morado), Exótico (naranja), Raro (amarillo), etc.
- 📊 **Información clara**: Icono grande, nombre, tipo, cantidad y ubicaciones
- 🎯 **Filtros intuitivos**: Búsqueda, rareza, tipo y ubicación en una sola barra
- 🌈 **Badges informativos**: Tipo de objeto y cantidad destacados con colores
- ✨ **Animaciones suaves**: Cards con efecto hover y transiciones fluidas

## Solución de Problemas

### La API de GW2 está en mantenimiento
Si ves el mensaje "API Temporarily disabled":
- Usa el botón **"📦 Ver Demo"** para ver la aplicación funcionando
- La API suele volver en unas horas
- El mensaje indica la fecha de reactivación

### Error de API Key inválida
- Verifica que la key tenga los permisos: `account`, `inventories`, `characters`
- Asegúrate de copiar la key completa (es muy larga)
- Prueba crear una nueva key si el problema persiste

### Errores de CORS
- Asegúrate de usar `npm start` (que incluye el proxy configurado)
- No uses `ng serve` directamente sin el proxy

## Notas Técnicas

- La API key se guarda solo en memoria (signal), **no se persiste** en disco
- Los límites de rate de la API GW2 son generosos para uso personal
- El idioma de los ítems está configurado a **español** (`lang=es`)
- Las imágenes de los ítems se cargan desde `render.guildwars2.com`
- El proxy de desarrollo redirige `/api` a `https://api.guildwars2.com/v2`
- Para producción, necesitarás configurar un proxy en tu servidor backend

## Autor

Carlos López Calvo

