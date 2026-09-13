# Apúntalo

Sistema de gestión para negocios chicos: **barberías y estéticas, talleres y
servicios técnicos, tiendas, y negocios de comida**.

Un solo producto con un núcleo común —clientes, agenda, inventario, caja y
cierre del día— y cuatro caras, porque el vocabulario cambia según el oficio:
en barbería es *cita*, en taller es *orden de trabajo*, en comida es *pedido*,
en tienda es *venta*.

El competidor real no es otro software. Es el cuaderno.

Cada giro llega con sus módulos armados —incluido el perfil de cada
empleado, porque la comisión y el "quién lo atendió" son parte del día— y
el cliente puede pedir lo que le falte.

**Mercado:** México. Los ejemplos de la landing usan vocabulario mexicano
a propósito (pastor, suadero, balatas, fiado).

**Nombre:** «Apúntalo». Es la única palabra que le dice al dueño qué hacer
con el producto: alguien que desconfía de «los sistemas» lo entiende sin
que se lo expliquen. Sirve igual en los cuatro giros —se apunta la cita, la
orden, la venta, el pedido— y no se escribe mal después de oírlo una vez.

## Estado

Prelanzamiento. Lo único construido es la landing.

## Contenido

- `index.html` — landing de prelanzamiento, sin dependencias ni build.
  Se abre directo en el navegador y se despliega como sitio estático.
- `vercel.json` — cabeceras de seguridad del despliegue: CSP, HSTS,
  `X-Frame-Options`, `nosniff`, política de referente y de permisos.

## Diseño

- **Tipografía:** Archivo (Omnibus-Type), en ancho expandido para titulares.
  Elegida por el español y por el parecido con la rotulación de local.
- **Color:** base neutra fría, y un color por vertical tomado del oficio —
  azul eléctrico (barbería), naranja de señalamiento (taller), verde de toldo
  (tienda), rojo de salsa (comida). El acento solo marca estado, dinero y
  acción; nunca decora.
- **Layout:** primero teléfono. El tráfico llega desde video vertical, y así
  es como se usa el producto: de pie, detrás del mostrador.
- **Movimiento:** un solo momento — al elegir vertical cambian el color, la
  pantalla del teléfono y las cifras. Nada aparece al hacer scroll.

## Lista de espera

El formulario escribe en Supabase (proyecto `apuntalo`, tabla
`lista_espera`). La llave que va en el HTML es la **publicable**: es
pública por diseño y no da acceso a nada por sí sola.

Lo que la protege es la seguridad a nivel de fila, activada antes del
primer registro. `anon` tiene una sola política, de `INSERT`. No existe
política de `SELECT`, `UPDATE` ni `DELETE`, así que desde el navegador
nadie puede leer ni borrar la lista aunque tenga la llave a la vista.

Verificado con peticiones reales, no supuesto:

| Prueba | Resultado |
|--------|-----------|
| `INSERT` como anon | 201, se guarda |
| `SELECT` como anon | `[]` — no devuelve nada |
| `DELETE` como anon | la fila sobrevive |
| Contacto repetido | 409, y la interfaz responde igual que un alta nueva para no revelar quién está en la lista |
| Giro inválido | 400, lo rechaza la restricción |

Para leer los registros: panel de Supabase o llave de servicio. Nunca
desde el navegador.

## Seguridad

Auditado con Cyber Neo. Riesgo bajo: sin secretos expuestos, sin XSS
—todas las escrituras al DOM usan `textContent` o `createElement`— y sin
dependencias de terceros que auditar.

Pendiente: **la CSP lleva `'unsafe-inline'`** porque el CSS y el
JavaScript van embebidos. Cuando haya paso de compilación, moverlos a
archivos aparte y quitar esa excepción.

## Pendiente

- El formulario de lista de espera todavía no guarda nada. Falta conectarlo
  a Supabase y desplegar en Vercel.
- Dominio. Se revisaron más de 50: toda palabra real del español está
  registrada en .com, .mx y .app. Libres al momento de revisar:
  apuntalo.mx (49.99 USD/año) y apuntalo.lat (1.99 USD/año).
- Apartar las cuentas de TikTok e Instagram, que para este producto pesan
  más que el dominio.
