# Venta Plus - Cliente Web (Proyecto 2)

Cliente web en **Node.js + Express + EJS** que consume exclusivamente la API REST de `VentaPlus.WebApi` (repositorio `ventaplus-restapi-nrc5443`). No usa Entity Framework ni se conecta directamente a SQL Server: toda la información llega por peticiones HTTP.

## Requisitos

- Node.js 18+ y npm
- Tener corriendo el proyecto `VentaPlus.WebApi` (ver su propio README)
- Visual Studio Code (recomendado)

## Instalación

```bash
git clone https://github.com/Gonzas96/venta-plus-webclient.git
cd venta-plus-webclient
npm install
cp .env.example .env
```

Edita `.env` y ajusta `API_BASE_URL` con el puerto donde corre la API (lo ves al ejecutar el proyecto ASP.NET con F5, ej. `http://localhost:52301/api/productos`).

## Ejecutar

```bash
npm start
```
o, si quieres reinicio automático al guardar cambios (usa nodemon):
```bash
npm run dev
```

Abre `http://localhost:3000` en el navegador.

## Estructura

```
app.js                  -> Punto de entrada, configura Express, EJS y method-override
routes/productos.js     -> Rutas: listar, crear, editar, eliminar (llama a services/apiClient.js)
services/apiClient.js   -> Único módulo que habla por HTTP (axios) con la API REST
views/                  -> Vistas EJS (index, create, edit) + partials (header/footer)
public/css/style.css    -> Estilos
```

## Funcionalidad

| Ruta                          | Método | Descripción                          |
|--------------------------------|--------|----------------------------------------|
| `/productos`                   | GET    | Lista productos                        |
| `/productos/nuevo`              | GET    | Formulario de registro                 |
| `/productos`                   | POST   | Crea un producto (llama POST a la API) |
| `/productos/:id/editar`        | GET    | Formulario de edición                  |
| `/productos/:id?_method=PUT`   | POST   | Actualiza (llama PUT a la API)         |
| `/productos/:id?_method=DELETE`| POST   | Elimina (llama DELETE a la API)        |

Los formularios HTML no soportan PUT/DELETE de forma nativa, por eso se usa el middleware `method-override` (campo `_method` en el query string) para simular esos verbos y que Express los enrute correctamente.

## Notas

- CORS ya está habilitado del lado de la API (`VentaPlus.WebApi/Web.config`), así que no deberías tener problemas de origen cruzado al consumirla desde este cliente (puerto distinto).
- Si la API no está corriendo, el listado muestra un mensaje de error en vez de romper la página.
