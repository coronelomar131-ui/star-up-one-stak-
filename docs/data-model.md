# Modelo de datos

> El código va en inglés; esta nota va en español porque es para leerse,
> no para compilarse.

Proyecto Supabase: `apuntalo` (`hvhwauommivdxbvtbbow`, us-east-1).

## La idea

Un solo modelo para los cuatro giros. Lo que cambia entre barbería,
taller, tienda y comida es el **vocabulario**, no la estructura: todo es
una entrada con monto, quién atendió y a quién.

```
businesses ─┬─ members    (quién trabaja aquí, su papel y su comisión)
            ├─ customers
            └─ entries    (la venta, la cita, la orden, el pedido)
```

| Tabla | Para qué |
|-------|----------|
| `businesses` | El inquilino. Nombre, giro y zona horaria. |
| `members` | Liga una cuenta a un negocio. Es el perfil del empleado: nombre, papel (`owner`/`staff`) y comisión. |
| `customers` | Del negocio, no globales. |
| `entries` | El corazón. `kind` es `sale`, `appointment`, `job` u `order`; el resto de columnas sirve igual para los cuatro. |
| `waitlist` | Del prelanzamiento. Vive aparte y no se toca con lo demás. |

`entries` lleva `member_id` porque en estos negocios la comisión y el
«¿quién lo atendió?» son parte del día, no un extra.

## Aislamiento entre negocios

Es lo que no se puede equivocar: que el negocio de un cliente vea los
datos de otro no tiene vuelta atrás.

Todo pasa por `private.is_member(business)` y `private.is_owner(business)`.
Viven en el esquema `private` a propósito: PostgREST publica todo lo que
está en `public`, y ahí quedarían invocables desde fuera como
`/rest/v1/rpc/`.

| | `staff` | `owner` |
|---|---|---|
| Ver negocio, equipo, clientes y entradas | sí | sí |
| Registrar y corregir entradas, agregar clientes | sí | sí |
| Alta y baja del equipo, cambiar comisiones | no | sí |
| Borrar entradas o clientes | no | sí |

Borrar una entrada es borrar dinero del registro, por eso queda solo en
manos del dueño.

## Las dos funciones que la aplicación llama

`create_business(name, trade, your_name)` — la única puerta para crear un
negocio. Sin ella nadie podría empezar: `businesses` no tiene política de
`INSERT` y `is_owner` exige ya ser miembro. No acepta `business_id` de
nadie, así que no sirve para colarse en uno ajeno.

`today_entries(business)` — el cierre del día, cortado a medianoche en la
zona horaria del propio negocio. Es `security invoker`: RLS filtra igual
y no escala privilegios.

## Verificado con negocios reales

No se dio por buena la configuración. Se crearon dos negocios con dos
dueños distintos y se probó desde la sesión de uno contra los datos del
otro:

| Prueba | Resultado |
|--------|-----------|
| A consulta entradas | ve 1, la suya. La de B no aparece |
| A consulta negocios | ve 1, el suyo |
| A inserta una entrada en el negocio de B | rechazado |
| A modifica una entrada de B | 0 filas afectadas |
| A se da de alta solo en la plantilla de B | 0 filas |
| `is_member` del negocio propio / ajeno | `true` / `false` |

La lista de espera se probó aparte contra la API pública: `INSERT` 201,
`SELECT` devuelve vacío, `trade` inválido 400.
