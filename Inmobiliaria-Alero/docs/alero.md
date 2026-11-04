# Alero · Inmobiliaria (paquete Básico)

**URL:** https://demo-inmo-alero.vercel.app · **Código:** `frontend/projects/inmo-alero`

## Concepto

Inmobiliaria local de Aguascalientes: compra, venta, renta y asesoría de crédito (Infonavit, Fovissste, bancario). Lema: "Encuentra la casa donde te quedas".
Personalidad: seria pero cercana; "personas, no un call center".

## Identidad

- **Logo:** techo de dos aguas en latón con alero extendido y ventana encendida, sobre cuadro verde pino. Al pasar el cursor el techo se levanta y la ventana parpadea.
- **Paleta:** hueso `#F4F2ED`, verde pino `#1E3A2F`, latón `#C49A55`, tinta `#15191A`.
- **Tipografías:** DM Serif Display (títulos, itálica para acentos) y Plus Jakarta Sans.
- **Movimiento:** sobrio (CSS + IntersectionObserver). Botones con barrido de latón.

## Secciones (una sola página)

1. Portada a pantalla completa con parallax suave y buscador (Comprar/Rentar, tipo, zona, presupuesto) que filtra el listado.
2. Cifras con contador sobre franja verde.
3. Propiedades: 8 fichas con filtros, favoritos, segunda foto al pasar el cursor y ficha en ventana (galería con flechas y teclado, características y "Agendar visita" que prellena el formulario).
4. Servicios: 4 tarjetas que se rellenan de verde desde la esquina.
5. Calculadora de crédito: precio, enganche y plazo → mensualidad animada, barra enganche/crédito e ingreso sugerido.
6. Cómo trabajamos: línea de tiempo que se dibuja.
7. Asesoras (2).
8. Opiniones en carrusel automático con barras de progreso.
9. Contacto: qué necesitas, propiedad o colonia, nombre, WhatsApp y horario → vista previa de WhatsApp.

## Fotos

20 fotos de Pexels (lista `alero` en `frontend/scripts/media-demos.mjs`). Propiedades, zonas y precios inventados.
