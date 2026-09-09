# VIH Interactivo (versión estática)

Sitio educativo de una sola página sobre VIH, para presentar en una clase de
secundaria (Uruguay). Es **100% estático**: HTML + CSS + JS vanilla, sin
backend, sin build tools y sin dependencias externas más allá de las
tipografías de Google Fonts. Anda con solo abrir `index.html` en el
navegador, y se puede publicar en Netlify en menos de un minuto.

## Contenido

1. Inicio
2. Qué es el VIH
3. VIH vs Sida
4. Transmisión (los 5 fluidos, clickeables) + Mitos y verdades (acordeón)
5. Prevención
6. Tratamiento
7. Cuestionario final (10 preguntas, nota de 1 a 10, con mensaje según el
   puntaje y botón para repetir)
8. Fuentes

El cuestionario guarda el **mejor puntaje en `localStorage`** del
navegador/celular donde se juega, para mostrar "Tu mejor puntaje: X/10" la
próxima vez. No hay ranking compartido ni servidor: cada alumno juega y ve
solo su propio resultado.

## Probarlo localmente

No hace falta instalar nada: abrí `index.html` con doble clic, o arrastralo
a una pestaña del navegador.

(Opcional, si preferís servirlo por http en vez de `file://`, por ejemplo
para probar en el celular en la misma red):

```bash
npx serve .
# o
python3 -m http.server 8080
```

## Publicar en Netlify

### Opción 1: arrastrando la carpeta (la más rápida)

1. Entrá a **[app.netlify.com/drop](https://app.netlify.com/drop)**.
2. Arrastrá esta carpeta completa (`index.html`, `styles.css`, `script.js`)
   a la zona de drop. No hace falta cuenta para probarlo, aunque conviene
   crear una gratuita para que el link no expire.
3. Netlify te da al instante una URL pública (tipo
   `https://nombre-random.netlify.app`) para compartir con la clase.

### Opción 2: conectando un repositorio de GitHub

1. Subí esta carpeta a un repositorio de GitHub.
2. Entrá a [app.netlify.com](https://app.netlify.com) → **Add new site** →
   **Import an existing project** → conectá tu cuenta de GitHub y elegí el
   repositorio.
3. Configuración de build:
   - **Build command:** dejalo vacío (no hay build).
   - **Publish directory:** `.` (o la carpeta donde están estos archivos,
     si el repo tiene más contenido).
4. **Deploy site**. Cada vez que hagas push a la rama conectada, Netlify
   vuelve a publicar automáticamente.

En ambos casos podés después personalizar el subdominio desde **Site
settings → Domain management → Options → Edit site name**.

## Estructura

```
.
├── index.html   # todas las secciones + el cuestionario
├── styles.css   # paleta, tipografía (Fraunces + IBM Plex Sans) y estilos responsive
├── script.js    # navegación, fluidos clickeables, acordeón y lógica del cuestionario
└── README.md
```

## Sobre el contenido

La información sobre transmisión, prevención (preservativo, PrEP, PEP) y
tratamiento (TAR, indetectable = intransmisible) está basada en
lineamientos de OMS/ONUSIDA y en cómo se accede a estos servicios en el
sistema de salud uruguayo. Es material de apoyo para una clase — no
reemplaza la consulta con un profesional de la salud.
