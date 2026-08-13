# Sistema de Gestión - Sabor Gourmet
## Diagramas de Diseño

---

## 1. DIAGRAMA DE COMPONENTES

```
┌─────────────────────────────────────────────────────────────────────┐
│                   SISTEMA DE GESTIÓN SABOR GOURMET                  │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Interfaz de Usuario)                    │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐      │
│  │   Módulo Mesas   │  │ Módulo Pedidos   │  │ Módulo Facturación│     │
│  │                  │  │                  │  │                  │      │
│  │ - Listar Mesas   │  │ - Ver Menú       │  │ - Generar Factura│      │
│  │ - Ocupar Mesa    │  │ - Agregar Item   │  │ - Calcular Total │      │
│  │ - Liberar Mesa   │  │ - Modificar Item │  │ - Historial Ventas│     │
│  │ - Estado Mesa    │  │ - Remover Item   │  │ - Reportes       │      │
│  │ - Reservas       │  │ - Total Pedido   │  │ - Exportar PDF   │      │
│  └──────────┬───────┘  └────────┬─────────┘  └────────┬─────────┘      │
│             │                   │                     │                │
│             └───────────────────┼─────────────────────┘                │
│                                 │                                      │
│                   ┌─────────────▼──────────────┐                       │
│                   │   Controller Central       │                       │
│                   │   (Coordinador de Módulos) │                       │
│                   └─────────────┬──────────────┘                       │
│                                 │                                      │
└─────────────────────────────────┼──────────────────────────────────────┘
                                  │
                    ┌─────────────▼──────────────┐
                    │      CAPA DE DATOS        │
                    │  (Gestión de Información) │
                    ├──────────────────────────┤
                    │ • LocalStorage            │
                    │ • SessionStorage          │
                    └──────────────────────────┘

```

### Componentes Principales:

1. **Módulo de Mesas**
   - Gestiona el estado de cada mesa (ocupada/libre)
   - Permite ver reservas
   - Muestra tiempo de ocupación
   - Asigna mesero responsable

2. **Módulo de Pedidos**
   - Visualiza menú disponible
   - Permite agregar/modificar items
   - Calcula subtotal por mesa
   - Gestiona estado del pedido

3. **Módulo de Facturación**
   - Genera facturas completas
   - Calcula impuestos y propinas
   - Registra transacciones
   - Genera reportes de ventas

4. **Controller Central**
   - Coordina comunicación entre módulos
   - Gestiona estado global de la aplicación
   - Maneja persistencia de datos

---

## 2. DIAGRAMA DE CLASES UML

```

┌────────────────────────────────────────────────────────────────┐
│                          SABOR GOURMET                         │
│                   Sistema de Gestión Restaurante               │
└────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────┐
│         Restaurante (Singleton)     │
├─────────────────────────────────────┤
│ - nombre: string                    │
│ - direccion: string                 │
│ - telefono: string                  │
│ - mesas: Mesa[]                     │
│ - menu: MenuItem[]                  │
│ - trabajadores: Trabajador[]        │
├─────────────────────────────────────┤
│ + obtenerMesa(id): Mesa             │
│ + obtenerMenuItems(): MenuItem[]    │
│ + crearPedido(): Pedido             │
│ + generarReporte(): Reporte         │
│ + getInstance(): Restaurante        │
└─────────────────────────────────────┘

         ▲                    ▲
         │ Compone            │ Compone
         │                    │
    ┌────┴──────────┐    ┌────┴─────────────┐
    │               │    │                  │
    │               │    │                  │

┌─────────────────────────────────────┐    ┌──────────────────────────┐
│             Mesa                    │    │      MenuItem            │
├─────────────────────────────────────┤    ├──────────────────────────┤
│ - id: number                        │    │ - id: number             │
│ - numero: number                    │    │ - nombre: string         │
│ - capacidad: number                 │    │ - descripcion: string    │
│ - estado: "libre" | "ocupada"       │    │ - precio: number         │
│ - pedido: Pedido | null             │    │ - disponible: boolean    │
│ - mesero: Trabajador | null         │    │ - categoria: string      │
│ - horaOcupacion: Date | null        │    │ - preparacion: number    │
├─────────────────────────────────────┤    ├──────────────────────────┤
│ + ocupar(mesero): void              │    │ + obtenerPrecio(): number│
│ + liberar(): void                   │    │ + esDisponible(): boolean│
│ + asignarPedido(pedido): void       │    │ + tiempoPreparacion():   │
│ + obtenerTiempoOcupacion(): number  │    │   number                 │
│ + cambiarEstado(estado): void       │    └──────────────────────────┘
│ + obtenerPedido(): Pedido           │
└─────────────────────────────────────┘
         ▲
         │ Contiene
         │
    ┌────┴─────────────────────────────────────┐
    │                                          │

┌──────────────────────────────────────────────────────────────┐
│                       Pedido                                │
├──────────────────────────────────────────────────────────────┤
│ - id: number                                                │
│ - mesa: Mesa                                                │
│ - items: DetallePedido[]                                    │
│ - fecha: Date                                               │
│ - estado: "pendiente" | "preparacion" | "listo" | "servido"│
│ - total: number                                             │
│ - observaciones: string                                     │
├──────────────────────────────────────────────────────────────┤
│ + agregarItem(menuItem, cantidad): void                     │
│ + removerItem(detallePedido): void                          │
│ + modificarCantidad(detallePedido, cantidad): void          │
│ + calcularTotal(): number                                   │
│ + cambiarEstado(nuevoEstado): void                          │
│ + obtenerItems(): DetallePedido[]                           │
└──────────────────────────────────────────────────────────────┘

    ▲                                    ▲
    │ Contiene                          │ Compone
    │                                   │
    │                    ┌──────────────┘
    │                    │

┌──────────────────────────────────┐    ┌───────────────────────────┐
│      DetallePedido              │    │     Factura              │
├──────────────────────────────────┤    ├───────────────────────────┤
│ - menuItem: MenuItem             │    │ - id: number              │
│ - cantidad: number               │    │ - pedido: Pedido          │
│ - precioUnitario: number         │    │ - fecha: Date             │
│ - subtotal: number               │    │ - subtotal: number        │
│ - observaciones: string          │    │ - impuesto: number        │
├──────────────────────────────────┤    │ - propina: number         │
│ + calcularSubtotal(): number     │    │ - total: number           │
│ + modificarCantidad(cant): void  │    │ - metodoPago: string      │
└──────────────────────────────────┘    ├───────────────────────────┤
                                        │ + generarFactura(): void  │
                                        │ + calcularImpuesto(): void│
                                        │ + exportarPDF(): void     │
                                        │ + obtenerDetalles(): str  │
                                        └───────────────────────────┘

┌──────────────────────────────────────────────┐
│            Trabajador                        │
├──────────────────────────────────────────────┤
│ - id: number                                 │
│ - nombre: string                             │
│ - cargo: "mesero" | "chef" | "cajero"       │
│ - email: string                              │
│ - telefono: string                           │
│ - turno: "mañana" | "tarde" | "noche"       │
│ - activo: boolean                            │
├──────────────────────────────────────────────┤
│ + obtenerInfo(): object                      │
│ + cambiarTurno(turno): void                  │
│ + desactivar(): void                         │
│ + obtenerMesasAsignadas(): Mesa[]            │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│                Reporte                               │
├──────────────────────────────────────────────────────┤
│ - fechaInicio: Date                                  │
│ - fechaFin: Date                                     │
│ - totalVentas: number                                │
│ - cantidadPedidos: number                            │
│ - platosVendidos: {menu: string, cantidad: number}[] │
│ - mejorHora: string                                  │
├──────────────────────────────────────────────────────┤
│ + generarReporte(): object                           │
│ + ventasPorHora(): Map<string, number>               │
│ + platosPopulares(): MenuItem[]                      │
│ + ingresoTotal(): number                             │
│ + exportarJSON(): string                             │
│ + exportarPDF(): void                                │
└──────────────────────────────────────────────────────┘

```

### Relaciones:
- **Composición**: Restaurante compone Mesas, Menú Items, Trabajadores
- **Asociación**: Mesa asociada a Pedido
- **Agregación**: Pedido agrega DetallePedido
- **Dependencia**: Factura depende de Pedido

---

## 3. PATRONES DE DISEÑO UTILIZADOS

1. **Singleton**: Restaurante (una única instancia)
2. **Observer**: Cambios en estado de mesas notifican al sistema
3. **Strategy**: Diferentes tipos de reportes
4. **Factory**: Creación de Pedidos, Facturas

---

## 4. ESTRUCTURA DE DATOS

```
Restaurante {
  mesas: Mesa[] → {
    id, numero, capacidad, estado,
    pedido: Pedido → {
      id, mesa, items: DetallePedido[] → {
        menuItem, cantidad, precioUnitario
      },
      fecha, estado, total
    },
    mesero: Trabajador
  },
  menu: MenuItem[] → {id, nombre, precio, categoria},
  trabajadores: Trabajador[] → {id, nombre, cargo, turno}
}
```

