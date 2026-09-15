# GoodRabbit Frontend — Challenge Semi-Senior

Aplicación React + TypeScript para gestión de empleados. Consume la API EmployeeAPI (.NET 8 + MongoDB), maneja autenticación con JWT y muestra una tabla virtualizada de empleados con filtros y generación de reportes asincrónicos.

**Stack:** React 19 · TypeScript · Vite · TanStack Query · Axios · React Router · react-window

---

## Cómo ejecutar

### 1. Levantar el backend

```bash
docker compose up --build
# API disponible en http://localhost:8080
# Swagger en http://localhost:8080/swagger
# Credenciales: admin / admin
```

### 2. Instalar dependencias y correr el frontend

```bash
npm install
npm run dev
# App en http://localhost:5173
```

---

## Configuración de la API

Por defecto apunta a `http://localhost:8080`. Si necesitas cambiar la URL, crea un archivo `.env` en la raíz del proyecto:

```
VITE_API_URL=http://tu-url-aqui
```

La variable la lee `src/api/client.ts`:

```typescript
baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080'
```

---

## Preguntas de arquitectura

### 4a — Tabla con dataset grande

> Dado que `GET /api/employee` puede devolver un dataset grande sin paginar, describe qué estrategia(s) usarías para evitar que la tabla se sobrecargue al renderizar todos los registros, considerando que no puedes modificar el backend. Compara al menos dos enfoques y justifica cuál usarías y por qué, indicando sus trade-offs.

El problema principal es de rendimiento: si se rendereiza todas las filas con un `.map()` directo, el navegador crea miles de nodos en el DOM al mismo tiempo. Con 2000 empleados eso genera lag al cargar y scroll lento porque tiene que pintar y mantener en memoria cada fila.

**Lo que hice: virtualización con react-window**

En vez de renderizar las 2000 filas, solo renderizo las que el usuario puede ver en pantalla en ese momento (la libreria lo calcula dinamicamente). Cuando hace scroll, las filas que salen del viewport se destruyen y las que entran se crean. El DOM siempre tiene sus nodos definidos sin importar cuántos empleados haya en total, lo que hace la experiencia fluida al usuario.

**Alternativa comparada: paginación en cliente**

Dividir el array en páginas de 50 registros y mostrar una por vez. Esto reduce los nodos en el DOM por página, pero el problema es que igual trae todos los datos al navegador desde el primer request. Entonces, los 2000 empleados siguen estando en memoria JavaScript. Además la experiencia del usuario empeora ya que, en vez de scroll natural el usuario tiene que hacer clic en botones de siguiente/anterior.


**Por qué elegí virtualización:** el scroll es más natural, el DOM se mantiene liviano en todo momento y escala bien si el dataset crece.

---

### 4b — Polling del reporte asíncrono

> Describe cómo implementarías el polling contra `GET /api/report/{executionId}/status` de forma robusta: ¿cada cuánto tiempo consultarías?, ¿usarías backoff progresivo?, ¿cómo evitarías dejar el polling corriendo si el usuario navega fuera de la vista (memory leak / peticiones huérfanas)?, ¿qué harías si el job nunca llega a `Completed` (timeout)? Menciona qué usarías en React para manejar este ciclo de vida.

Para el polling usé TanStack Query con `refetchInterval` en lugar de hacer un `useEffect` con `setInterval` a mano. TanStack se encarga solo de parar las consultas cuando el usuario sale de la página, así no quedan peticiones corriendo en el fondo sin que nadie las escuche.

**Intervalo:** consulto el estado cada 3 segundos. Es un balance razonable entre no tardar mucho en mostrar el resultado y no saturar el servidor.

**Backoff progresivo:** no lo implementé. El reporte generalmente termina en pocos segundos y agregar backoff progresivo añadiría complejidad sin un beneficio real en este caso.
En grandes dataset, serviria y es ahi donde quizá implementaria para darle feedback al usuario.


**Cleanup / peticiones huérfanas:** TanStack Query para el `refetchInterval` automáticamente cuando el componente se desmonta porque ya no hay observadores del query. Además, cada consulta recibe un `AbortSignal` que TanStack crea internamente. Esto quiere decir, si el usuario navega fuera a mitad de un request HTTP, axios lo cancela en la red antes de que llegue la respuesta.


**Timeout:** si el reporte nunca llega a `Completed` el polling correría indefinidamente. Implementé un timeout de 2 minutos: dentro del `refetchInterval` calculo cuánto tiempo pasó desde que arrancó el polling y si supera el límite, paro todo y muestro un mensaje de error al usuario.

**Herramientas React utilizadas:**
- `useMutation` para disparar el POST manualmente cuando el usuario hace click
- `useQuery` + `refetchInterval` para el polling automático
- `AbortSignal` pasado por TanStack Query para cancelar requests en vuelo

---

## Tests

Los tests no fueron implementados. No fue por falta de tiempo sino porque 
no tengo experiencia suficiente con Vitest y React Testing Library para 
implementarlos correctamente y poder defenderlos.

Sé qué habría testeado:
- `EmployeeTable` — que renderiza filas con datos mock y muestra el estado vacío
- `useEmployees` — que el hook devuelve los datos mockeando axios

---

## Decisiones técnicas

| Decisión | Por qué |
|---|---|
| Axios sobre fetch nativo | Los interceptores permiten inyectar el JWT en cada request y manejar el 401 en un solo lugar |
| TanStack Query | Maneja loading/error/data automáticamente y el `refetchInterval` evita gestionar `setInterval` manualmente |
| react-window | Virtualización liviana, sin dependencias pesadas, API simple para altura fija |
| localStorage para el token | La API devuelve el token en el body JSON|
| sessionStorage para sesión expirada | Flag temporal que avisa al usuario cuando el token venció — se borra al leerlo para que aparezca exactamente una vez |
