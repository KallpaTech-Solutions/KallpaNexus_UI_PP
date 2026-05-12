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

## Rutas y recarga (F5) en producción

La app usa **`HashRouter`**: la ruta va en el fragmento (`https://…onrender.com/#/admin`). El servidor siempre recibe un GET a `/` con `index.html`, así que **recargar en cualquier página no devuelve 404**, sin reglas extra en Render.

Si más adelante quieres URLs “limpias” (`…/admin` sin `#`), cambia en `App.jsx` a `BrowserRouter` y en Render añade la reescritura **Rewrite** `/*` → `/index.html` ([documentación](https://render.com/docs/redirects-rewrites)).

## Repositorio remoto

`https://github.com/KallpaTech-Solutions/KallpaNexus_UI_PP.git`
