# ADR1: Monolito Modular

## Contexto y Declaración del Problema

Para la arquitectura del backend, decidimos implementar un monolito modular en lugar de un monolito tradicional. Un atributo de calidad clave para nosotros es la mantenibilidad. Un monolito modular organiza la aplicación en módulos independientes con límites bien definidos, manteniendo una única unidad desplegable. Cada módulo encapsula una funcionalidad específica del negocio, incluyendo modelos de datos, lógica de negocio e interfaces, y se comunica con otros módulos a través de APIs bien definidas, lo que mejora la cohesión y minimiza las dependencias.

## Factores de Decisión

- Mantenibilidad y modularidad del código
- Facilidad de escalabilidad sin afectar otras partes del sistema
- Separación de preocupaciones para reducir acoplamiento
- Facilidad de prueba mediante la separación de la lógica de negocio de la infraestructura
- Posibilidad de migrar a microservicios en el futuro sin grandes refactorizaciones

## Opciones Consideradas

- Monolito tradicional
- Monolito modular
- Microservicios desde el inicio

## Resultado de la Decisión

Opción elegida: **Monolito Modular**, porque proporciona una arquitectura más flexible y mantenible en comparación con un monolito tradicional, mientras que evita la sobrecarga y complejidad operativa de un sistema basado en microservicios en las etapas iniciales.

### Consecuencias

- **Positivas:**

  - Mejora la modularidad y mantenibilidad del código.
  - Permite escalar el sistema sin modificar otras partes.
  - Reduce el acoplamiento entre módulos y mejora la reutilización del código.
  - Facilita pruebas unitarias e integración.
  - Permite una transición más sencilla a microservicios en el futuro si es necesario.

- **Negativas:**
  - Puede ser menos eficiente en algunas operaciones debido a la necesidad de solicitar información entre módulos en lugar de realizar joins en la base de datos.
  - Requiere una planificación adecuada para definir correctamente los límites de los módulos.

### Confirmación

La correcta implementación del monolito modular se validará mediante:

- Revisión de código para asegurar que cada módulo encapsula correctamente su funcionalidad.
- Documentación clara de las interfaces de cada módulo.

## Pros y Contras de las Opciones

### Opción 1: Monolito Tradicional

- **Pros:**

  - Simplicidad inicial en el desarrollo.
  - Menos sobrecarga en la comunicación interna.

- **Contras:**
  - Alta dependencia entre componentes.
  - Dificultad para escalar y mantener a largo plazo.
  - Acoplamiento fuerte entre módulos, dificultando futuras separaciones.

### Opción 2: Monolito Modular (Elegido)

- **Pros:**

  - Separación clara de responsabilidades.
  - Facilita la mantenibilidad y escalabilidad del sistema.
  - Reducción de acoplamiento entre módulos.
  - Posibilidad de migración progresiva a microservicios.

- **Contras:**
  - Ligera pérdida de eficiencia en comparación con joins directos en base de datos.
  - Mayor esfuerzo en planificación para definir interfaces entre módulos.

### Opción 3: Microservicios desde el Inicio

- **Pros:**

  - Escalabilidad independiente de cada servicio.
  - Separación total entre componentes.

- **Contras:**
  - Complejidad operativa y de despliegue mayor.
  - Sobrecarga en la comunicación entre servicios.
  - Requiere una infraestructura más compleja desde el inicio, lo cual incrementaria los costos.

## Más Información

El artículo **"Monolith First"** de Martin Fowler recomienda comenzar con un monolito antes de considerar microservicios, lo que respalda esta decisión. Además, la modularización sigue los principios de **Presentation Domain Data Layering**, dividiendo la arquitectura en capas de Presentación, Dominio y Datos para una mejor organización y mantenimiento.
