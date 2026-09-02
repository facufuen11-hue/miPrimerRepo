# VIH Interactivo 🎗️

Sitio educativo de una sola página sobre VIH, pensado para presentar en una
clase de secundaria (Uruguay), con un juego final (trivia + arrastrar y
soltar) y un **ranking en vivo** al que se conectan todos los compañeros
desde su propio celular.

- **Backend:** Node.js + Express + Socket.io (ranking en tiempo real, sin
  recargar ni hacer polling).
- **Persistencia:** archivo JSON local (`server/data/leaderboard.json`), así
  el ranking sobrevive un reinicio del servidor.
- **Frontend:** HTML/CSS/JS vanilla, mobile-first, con drag & drop que
  funciona con mouse y con touch (Pointer Events).

---

## 1. Instalación y uso local

```bash
npm install
npm start
```

Esto levanta el servidor en `http://localhost:3000`. En la consola vas a ver
algo así:

```
🎓 VIH Interactivo corriendo!
   Local:  http://localhost:3000
   Red:    http://192.168.1.42:3000

   📱 Código QR para proyectar: http://192.168.1.42:3000/qr
   🔒 Panel admin: http://localhost:3000/admin  (contraseña: vih2026)
```

Para desarrollo con recarga automática (nodemon):

```bash
npm run dev
```

---

## 2. Usarlo en el aula (WiFi del liceo)

La idea es que vos abras el servidor en tu notebook, conectada al WiFi del
liceo, y que tus compañeros entren desde el celular usando **tu IP local**
(por ejemplo `http://192.168.1.42:3000`).

### Paso a paso para la clase

1. Conectá tu notebook al WiFi del liceo (asegurate de que sea la **misma
   red** a la que se van a conectar los celulares).
2. Corré `npm start`. La consola te va a mostrar tu IP de red automáticamente
   (línea "Red:").
3. Abrí `http://TU_IP:3000/qr` en el navegador y proyectalo — muestra un
   código QR grande apuntando directo a esa dirección, para que todos
   escaneen y entren sin escribir nada.
4. Si alguien no puede escanear, puede escribir manualmente la dirección
   `http://TU_IP:3000` en el navegador del celular.
5. Cuando terminan de jugar, el ranking de `#ranking` se actualiza solo en
   todas las pantallas (la tuya proyectada incluida).
6. Antes de la próxima clase, entrá a `/admin` y reiniciá el ranking (ver
   sección 4).

### Cómo encontrar tu IP local

**Windows:**
```
ipconfig
```
Buscá "Dirección IPv4" dentro del adaptador WiFi (suele empezar con
`192.168.` o `10.`).

**Mac:**
```
ipconfig getifaddr en0
```
(si usás WiFi por USB-C/adaptador, probá `en1`, `en2`, etc. o mirá
Preferencias del Sistema → Red).

**Linux:**
```
ip addr show | grep "inet "
```
o simplemente `hostname -I`.

> Tip: no hace falta buscarla a mano — cuando corrés `npm start`, el propio
> servidor detecta e imprime tu IP de red en la consola.

### El firewall no me deja conectar desde el celular

Es el motivo más común de que "desde mi compu funciona pero desde el
celular no". Necesitás permitir conexiones **entrantes** al puerto `3000`:

**Windows (Firewall de Windows Defender):**
1. La primera vez que corrés `npm start`, Windows suele mostrar un popup
   "Windows Defender Firewall bloqueó algunas características de esta app" →
   hacé clic en **Permitir acceso** (marcando redes privadas).
2. Si no apareció el popup o lo cerraste sin querer: Panel de Control →
   Sistema y seguridad → Firewall de Windows Defender → *Permitir una
   aplicación a través del Firewall* → agregá **Node.js** (o el ejecutable
   `node.exe`) y marcá la casilla de red **Privada**.
3. Alternativa rápida (PowerShell como administrador):
   ```powershell
   New-NetFirewallRule -DisplayName "VIH Interactivo" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
   ```

**Mac:**
1. Preferencias del Sistema → Red y Seguridad → Firewall.
2. Si está activado, and al correr el server puede aparecer un diálogo
   "¿Querés permitir que 'node' acepte conexiones entrantes?" → **Permitir**.
3. Si no aparece, andá a Firewall → Opciones y agregá/permití `node`
   manualmente.

**Linux (ufw):**
```bash
sudo ufw allow 3000/tcp
```

Si después de esto seguís sin poder conectarte, chequeá que:
- El celular esté en la **misma red WiFi** que la notebook (no en datos
  móviles).
- Algunas redes de instituciones (liceos) usan **"aislamiento de clientes"
  (client isolation / AP isolation)**, que bloquea que los dispositivos de
  la misma red se vean entre sí. Si es el caso, no hay forma de arreglarlo
  desde tu notebook — hablá con el equipo de informática del liceo, usá tu
  propio punto de acceso WiFi (hotspot del celular, todos conectados a él),
  o desplegá el proyecto en internet (ver sección 3).

---

## 3. Desplegarlo gratis en internet (Render o Railway)

Si preferís no depender de la red WiFi del liceo, podés desplegar el
proyecto gratis y compartir un link público.

### Render

1. Subí este proyecto a un repositorio de GitHub (ya lo tenés acá).
2. Entrá a [render.com](https://render.com) y creá una cuenta gratuita.
3. **New +** → **Web Service** → conectá tu repositorio de GitHub.
4. Configurá:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
5. (Opcional) En "Environment" agregá la variable `ADMIN_PASSWORD` con tu
   propia contraseña.
6. Deploy. Render te da una URL pública tipo
   `https://vih-interactivo.onrender.com` — compartila con la clase o
   generá el QR con esa URL (podés usar `/qr?ip=` no aplica acá; simplemente
   compartí el link directo, o generá el QR con cualquier generador online
   apuntando a esa URL).

> Nota: el plan gratuito de Render "duerme" el servicio si no tiene tráfico
> por un rato, y tarda unos segundos en despertar con la primera visita —
> entrá vos primero un par de minutos antes de la clase.

### Railway

1. Subí el proyecto a GitHub.
2. Entrá a [railway.app](https://railway.app) y creá una cuenta.
3. **New Project** → **Deploy from GitHub repo** → elegí este repositorio.
4. Railway detecta Node.js automáticamente. Verificá en **Settings** que:
   - **Start Command:** `npm start`
5. (Opcional) En **Variables** agregá `ADMIN_PASSWORD` con tu contraseña.
6. Una vez desplegado, Railway te da un dominio público (`Settings` →
   `Networking` → `Generate Domain`). Compartilo con la clase.

En ambos casos, como el servidor ya lee `process.env.PORT`, no hace falta
tocar nada del código.

---

## 4. Panel docente (`/admin`)

Entrá a `http://localhost:3000/admin` (o la URL pública si lo desplegaste).

- **Contraseña por defecto:** `vih2026`
  Podés cambiarla seteando la variable de entorno `ADMIN_PASSWORD` antes de
  iniciar el server, por ejemplo:
  ```bash
  ADMIN_PASSWORD=miContraseña npm start
  ```
- **Reiniciar ranking:** borra todos los puntajes guardados. Usalo antes de
  cada clase para que empiecen desde cero.
- **Exportar resultados (CSV):** descarga un archivo con nombre, puntaje,
  aciertos de trivia, aciertos del juego y fecha/hora de cada envío — útil
  para revisar después de la clase.
- **Ver código QR:** acceso directo a `/qr` para proyectar.

---

## 5. Estructura del proyecto

```
.
├── package.json
├── server/
│   ├── index.js        # servidor Express + Socket.io
│   ├── config.js        # puerto, contraseña admin, puntajes
│   ├── leaderboard.js    # persistencia en JSON (lectura/escritura atómica)
│   ├── network.js        # detección de IP local para el QR
│   └── data/
│       └── leaderboard.json   # se crea solo, no se versiona en git
└── public/
    ├── index.html        # sitio de una sola página (todas las secciones)
    ├── admin.html         # panel docente
    ├── css/styles.css
    └── js/
        ├── app.js         # navegación, trivia, drag & drop, socket.io
        └── admin.js        # lógica del panel docente
```

---

## 6. El juego

- **Trivia:** 8 preguntas de opción múltiple (10 pts c/u) sobre qué es el
  VIH, diferencia con sida, indetectable = intransmisible, prevención,
  PrEP/PEP y testeo.
- **Clasificación (drag & drop):** 10 elementos para arrastrar a "Transmite"
  o "No transmite" el VIH (10 pts c/u) — incluye los 5 fluidos que sí
  transmiten (sangre, semen, secreciones vaginales, leche materna,
  secreciones rectales) y 5 mitos comunes que no transmiten (saliva, sudor,
  lágrimas, compartir el mate, picadura de mosquito). Funciona con mouse y
  con touch gracias a Pointer Events.
- **Puntaje máximo:** 180 pts.
- Al enviar el puntaje, se guarda con fecha/hora en el servidor y el
  ranking (top 15, ordenado de mayor a menor) se actualiza **en vivo** en
  todas las pantallas conectadas, sin recargar la página.

---

## 7. Sobre el contenido

La información sobre transmisión, prevención (preservativo, PrEP, PEP) y
tratamiento (TARV, indetectable = intransmisible) está basada en
lineamientos de OMS/ONUSIDA y en cómo se accede a estos servicios en el
sistema de salud uruguayo. Es material de apoyo para una clase — no
reemplaza la consulta con un profesional de la salud.
