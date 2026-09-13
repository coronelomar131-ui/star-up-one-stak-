# Modelo de datos

Proyecto Supabase: `apuntalo` (`hvhwauommivdxbvtbbow`, us-east-1).
Migraciones aplicadas: `crear_lista_espera_con_rls`,
`modelo_base_multinegocio`, `esconder_funciones_de_permiso`.

## La idea

Un solo modelo para los cuatro giros. Lo que cambia entre barbería,
taller, tienda y comida es el **vocabulario**, no la estructura: todo es
un apunte con monto, quién atendió y a quién.

```
negocios ─┬─ miembros   (quién trabaja aquí, su papel y su comisión)
          ├─ clientes
          └─ apuntes    (la venta, la cita, la orden, el pedido)
```

| Tabla | Para qué |
|-------|----------|
| `negocios` | El inquilino. Nombre y giro. |
| `miembros` | Liga una cuenta a un negocio. Es el perfil del empleado: nombre, papel (`dueno`/`empleado`) y comisión. |
| `clientes` | Del negocio, no globales. |
| `apuntes` | El corazón. `tipo` es `venta`, `cita`, `orden` o `pedido`; el resto de columnas sirve igual para los cuatro. |
| `lista_espera` | Del prelanzamiento. Vive aparte y no se toca con lo demás. |

`apuntes` lleva `miembro_id` porque en estos negocios la comisión y el
«¿quién lo atendió?» son parte del día, no un extra.

## Aislamiento entre negocios

Es lo que no se puede equivocar: que el negocio de un cliente vea los
datos de otro no tiene vuelta atrás.

Todo pasa por dos funciones, `privado.es_miembro(negocio)` y
`privado.es_dueno(negocio)`. Viven en el esquema `privado` a propósito:
PostgREST publica todo lo que está en `public`, y ahí quedaban
invocables desde fuera como `/rest/v1/rpc/`. En `privado` la API no las
ve, y las políticas las siguen usando porque `authenticated` conserva
`USAGE` sobre el esquema.

Quién puede qué:

| | Empleado | Dueño |
|---|---|---|
| Ver el negocio, el equipo, clientes y apuntes | sí | sí |
| Apuntar y corregir apuntes, agregar clientes | sí | sí |
| Dar de alta y baja al equipo, cambiar comisiones | no | sí |
| Borrar apuntes o clientes | no | sí |

Borrar un apunte es borrar dinero del registro, por eso queda solo en
manos del dueño.

## Verificado con dos negocios reales

No se dio por buena la configuración. Se crearon dos negocios con dos
dueños distintos y se probó desde la sesión de uno contra los datos del
otro:

| Prueba | Resultado |
|--------|-----------|
| A consulta apuntes | ve 1, el suyo. El de B no aparece |
| A consulta negocios | ve 1, el suyo |
| A inserta un apunte en el negocio de B | rechazado |
| A modifica un apunte de B | 0 filas afectadas |
| A se da de alta solo en la plantilla de B | 0 filas |
| `es_miembro` del negocio propio / ajeno | `true` / `false` |

Se repitió la prueba completa **después** de reescribir todas las
políticas, y los datos de prueba se borraron. El asesor de seguridad de
Supabase reporta cero alertas.
