# KallpaNexus_UI_PP

Frontend **React (Vite)** del pretotipo KallpaNexus: landing, Nexus Sport, Nexus Stay, panel admin, acceso reservado Tacones y analíticas contra la API.

## Requisitos

- Node.js 20+ (recomendado)

## Comandos

```bash
npm install
npm run dev
npm run build
```

## API en producción (Render Static Site)

En el panel de Render → **Environment** del sitio estático, añade:

| Key             | Value (exacto)                              |
|-----------------|-----------------------------------------------|
| `VITE_API_URL`  | `https://kallpanexus-api-pp.onrender.com`     |

Sin barra final. El código concatena `/api` (misma base que Swagger).

En **local**, si no defines la variable, se usa `http://localhost:5062/api` (ajusta al puerto de tu API).

## Recargar `/admin` (y otras rutas) sin 404 en Render

React Router usa rutas del lado del cliente. Si recargas en `…/admin`, el CDN busca un archivo `/admin` y responde **404** hasta que configures una **reescritura** en Render.

En el **Static Site** del front → **Redirects/Rewrites** → añade una regla:

| Action   | Source | Destination   |
|----------|--------|---------------|
| **Rewrite** | `/*`   | `/index.html` |

Así las rutas que no sean archivos estáticos sirven `index.html` y el router puede montar `/admin`. Ver [Redirects and rewrites](https://render.com/docs/redirects-rewrites).

## Repositorio remoto

`https://github.com/KallpaTech-Solutions/KallpaNexus_UI_PP.git`
