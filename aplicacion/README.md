# Apúntalo — la aplicación

Next.js 15 (App Router) + Supabase. Se usa desde el teléfono.

## Correr en tu máquina

```bash
cp .env.example .env.local   # y pon las llaves de tu proyecto
npm install
npm run dev
```

## Cómo está armado

```
lib/giros.ts          El vocabulario de cada giro. Aquí y en ningún otro
                      lado: un quinto giro es una entrada más.
lib/negocio.ts        De dónde sale el negocio del usuario. SIEMPRE de la
                      sesión, nunca de un campo del formulario.
lib/supabase/         Clientes de navegador y de servidor.
middleware.ts         Refresca la sesión en cada petición.

app/entrar            Correo y contraseña.
app/empezar           Alta del negocio. Llama a crear_negocio().
app/hoy               El cierre del día: total, cuánto te deben, la lista.
app/apuntar           Apuntar una venta, orden o pedido.
```

## Dos decisiones que importan

**El negocio nunca viaja en el formulario.** `sesionActual()` lo saca de
la sesión del usuario. Si el navegador pudiera mandar `negocio_id`,
mandaría el de otro.

**«Hoy» se calcula en la base, no en el navegador.** La función
`apuntes_de_hoy()` corta el día a medianoche en la zona del negocio. En
JavaScript se desfasa con el horario de verano y con el servidor.

## Probado de punta a punta

Con un navegador real (`playwright`), recorriendo el camino del dueño:
entrar sin sesión manda a `/entrar`; sin negocio manda a `/empezar`;
alta del negocio; día vacío con el vocabulario del giro («Cobrar un
corte»); apuntar $250 aparece en la lista con quién atendió; apuntar
$600 sin pagar lleva el total a $850 y muestra «Te deben $600».

## Falta

- Cliente y fiado con nombre (el esquema ya lo aguanta).
- Alta de empleados desde la app.
- Semana y mes, no solo el día.
- Entrar por teléfono en vez de correo, cuando haya para el SMS.
