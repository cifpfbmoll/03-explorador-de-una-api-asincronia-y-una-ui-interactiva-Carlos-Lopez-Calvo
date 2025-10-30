[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/NJ448ipO)
# 03- Explorador de una API asincronia y una UI interactiva

- **Descripción del Proyecto**: Una aplicación web que permite a los usuarios buscar y explorar una API pública. Incluye una interfaz simple para ingresar consultas de búsqueda, mostrar resultados en tarjetas, y manejar estados como carga, errores o resultados vacíos. Esto es similar al cliente de Reddit que vimos en clase, pero enfocado en la API de GitHub (o lo que surja) para practicar conceptos como solicitudes HTTP y manejo de datos asíncronos.
- **Objetivo**: Ampliar el conocimiento básico de Angular, idealmente para reforzar habilidades en frontend development, API integration y gestión de estado reactivo usando signals.
- **Requisitos Técnicos**:
  - **Framework**: Angular ~20.3.0, con énfasis en módulos standalone para componentes reutilizables.
  - **Características Principales**: Utiliza signals para actualizaciones reactivas, servicios para lógica de negocio, y plantillas Angular para UI dinámica. Añade `HttpClientModule` para manejar solicitudes API.
  - **Dependencias**: Mantiene paquetes como `@angular/core` y `rxjs`; incluye `@angular/common/http` para API calls. Usa versiones compatibles con el proyecto actual para evitar conflictos.
  - **API**: GitHub API REST (e.g., `https://api.github.com/search/repositories`), que es gratuita y no requiere autenticación para consultas públicas. Las opciones son diversas: Spotify, Facebook, Instagram, TikTok, Shazam, Youtube, Codewars, etc. Como hemos visto en clase, y por aportación unánime, también podréis utilizar API de Guild Wars 2 o League of Legends.
- **Estructura del Proyecto**:
  - **Componentes**: Incluye un componente principal como `repo-list.component.ts` (similar a [subreddit-column.component.ts](/reddit-client/src/app/components/subreddit-column.component.ts:0:0-0:0)), con subcomponentes para detalles de repositorios. Añade un `search-bar.component.ts` para la entrada de usuario.
  - **Servicios**: Un `github.service.ts` (por ejemplo) que encapsula llamadas API, con métodos como `searchRepositories(query: string)` para devolver datos en formato observable.
  - **Plantillas**: Usa directivas como `@if`, `@for` y eventos para una UI interactiva, con estilos CSS para una apariencia moderna (p. ej., usando clases como `column`, `loading`).
- **Detalles de la API**: Debes usar, por ejemplo, el endpoint `GET /search/repositories` con parámetros como `q` para la consulta. Ejemplo de llamada: `this.http.get('https://api.github.com/search/repositories', { params: { q: query } })`. Enfatiza el manejo de errores HTTP (e.g., códigos 403 para límites de tasa) y la transformación de respuestas.
- **Características Adicionales**: Para enriquecer el proyecto, sugiero agregar:
  - Filtrado de repositorios (por ejemplo por lenguaje o estrellas). La mayoría de APIs que os proprongo tienen algún sistema similar.
  - Un componente para mostrar detalles de la información al hacer clic.
  - Integración con notificaciones usando signals para actualizaciones en tiempo real.
 
  # Formato de entrega:

  - Vuestra propuesta de proyecto y documentación del mismo.
  - Para la generación de la documentación está permitida el uso (pero no el abuso) de algunas IAs siempre y cuando reviséis lo que entregáis.
  - El código fuente del proyecto en este repo.
  - Algunas imágenes del funcionamiento de vuestro proyecto en local o en github pages (esto último es totalmente voluntario).
 
 # Fecha de entrega

  - El lunes 3 de noviembre a las 23:59 h.
  - Tened en cuenta la penalización establecida como es habitual.
